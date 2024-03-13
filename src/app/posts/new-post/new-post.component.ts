import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/service/categories.service';
import { Post } from 'src/app/model/post';
import { PostsService } from 'src/app/service/posts.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent {


  permalink: string = '';
  imgSrc: any = './assets/placeholder.png';
  selectedImg: any;
  categories: any = [];

  postForm!: FormGroup;

  post : any;

  formStatus: string = 'Add New'

  docId: string = '';

  constructor(private categoryService: CategoriesService, private postService: PostsService, private fb: FormBuilder, private storage: AngularFireStorage, private afs: AngularFirestore, private toastr: ToastrService,
    private route: ActivatedRoute) {
     
      if(this.docId){
        this.route.queryParams.subscribe(val=>{
          console.log(val)
          this.docId = val['id']
          this.postService.loadOneData(val['id']).subscribe(post => {
            console.log(post)
            this.post = post
    
            this.postForm = fb.group({
              title: [this.post.title, [Validators.required, Validators.minLength(10)]],
              permalink: [this.post.permalink],
              excerpt: [this.post.excerpt, [Validators.required, Validators.minLength(50)]],
              category: [`${this.post.category.categoryId}-${this.post.category.category}`, Validators.required],
              postImg: ['', Validators.required],
              content: [this.post.content, Validators.required]
            })
            this.imgSrc = this.post.postImgPath
            this.formStatus = 'Edit'
          })
         })
      }else{
        this.postForm = fb.group({
          title: ['', [Validators.required, Validators.minLength(10)]],
          permalink: [''],
          excerpt: ['', [Validators.required, Validators.minLength(50)]],
          category: ['', Validators.required],
          postImg: ['', Validators.required],
          content: ['', Validators.required]
        })
      }

    
  }


  ngOnInit(): void {
    this.categoryService.loadData().subscribe(val => {
      this.categories = val;
      console.log(this.categories);
    })
  }

  get fc() {
    return this.postForm.controls;
  }



  onTitleChanged($event: any) {
    const title = $event.target.value;
    this.permalink = title.replace(/\s/g, '-')
    // console.log(this.permalink)
  }

  showPreview($event: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result
    }
    reader.readAsDataURL($event.target.files[0]);
    this.selectedImg = $event.target.files[0];
  }



  onSubmit() {
    console.log(this.postForm.value)


    let splitted = this.postForm.value.category.split('-')
    console.log(splitted)

    const postData: Post = {
      title: this.postForm.value.title,
      permalink: this.postForm.value.permalink,
      category: {
        categoryId: splitted[0],
        category: splitted[1]
      },
      postImgPath: '',
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      status: 'new',
      views: 0,
      createdAt: new Date()
    }

    this.postService.uploadImage(this.selectedImg, postData,this.formStatus,this.docId);
    this.postForm.reset()
    this.imgSrc = './assets/placeholder.png';
  }
}
