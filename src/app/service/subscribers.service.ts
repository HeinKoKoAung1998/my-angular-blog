import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscribersService {

  constructor(private afs: AngularFirestore,private toastr: ToastrService) { }

  loadData(){
    return this.afs.collection('subscribers').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a=>{
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, data};
        })
      })
    )
  }

  deleteData(id: any){
    this.afs.doc(`subscribers/${id}`).delete().then(()=>{
      this.toastr.success('Data Deleted...!')
    })
  }
}
