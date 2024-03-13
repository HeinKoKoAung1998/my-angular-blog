import { Component } from '@angular/core';
import { CategoriesService } from '../service/categories.service';
import { Category } from '../model/category';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {

  formStatus: string = 'Add';
  categoryId! : string ;
  formCategory! : string;
  categoryArray: Array<any> = [];

  constructor(private categoryService: CategoriesService){}

  ngOnInit(): void{
    this.categoryService.loadData().subscribe((val) => {
      console.log(val);
      this.categoryArray = val ;
    })
  }

  onSubmit(formData: any){
     let CategeriesData: Category = {
      category : formData.value.category
     }
      
     if(this.formStatus == 'Add'){
      this.categoryService.saveData(CategeriesData);
      formData.reset();
     }
     else if(this.formStatus == 'Edit'){
      this.categoryService.updateData(this.categoryId,CategeriesData);
      formData.reset();
      this.formStatus = 'Add'
     }
  }

  onEdit(category: any, id : any){
    this.formCategory = category;
    this.formStatus = 'Edit';
    this.categoryId = id;

  }

  onDelete(id: any){
    this.categoryService.deleteData(id);
  }

}
