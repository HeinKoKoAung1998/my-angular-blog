import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastrService } from 'ngx-toastr';
import { Post } from '../model/post';
import { finalize, map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private storage: AngularFireStorage, private afs: AngularFirestore, private router: Router,
    private toastr: ToastrService) { }

  uploadImage(selectedImage: String, postData: Post, formStatus: string, id: any) {
    const filePath = `postIMG/${Date.now()}`
    console.log(filePath)


    // const fileRef =  this.storage.ref(filePath);
    this.storage.upload(filePath, selectedImage).then(() => {
      console.log('post image uploaded successfully')
      this.storage.ref(filePath).getDownloadURL().subscribe(URL => {
        postData.postImgPath = URL;

        console.log(postData.postImgPath)

        if (formStatus == 'Edit') {
          this.updateData(id, postData)
        } else {
          this.saveData(postData)
        }

      })
    })
  }

  saveData(postData: Post) {
    this.afs.collection('post').add(postData).then((docRef) => {
      this.toastr.success('Data insert Successfully')
      console.log(postData);
    })
  }

  loadData() {
    return this.afs.collection('post').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data };
        })
      })
    )
  }

  loadOneData(id: any) {
    return this.afs.doc(`post/${id}`).valueChanges();
  }

  updateData(id: any, postData: Post) {
    this.afs.doc(`post/${id}`).update(postData).then(() => {
      this.toastr.success('Successfully Updated')
      this.router.navigate(['/posts'])
    })
  }

  deleteImage(postImgPath: any,id: any){
     this.storage.storage.refFromURL(postImgPath).delete().then(()=>{
       this.deleteData(id)
     })
  }

  deleteData(id: any){
    this.afs.doc(`post/${id}`).delete().then(()=>{
      this.toastr.warning('Data Deleted...!')
    })
  }

  markFeatured( id: any, featuredData: any){
    this.afs.doc(`post/${id}`).update(featuredData).then(()=>{
      this.toastr.info('Featured Status Updated')
    })

  }
}
