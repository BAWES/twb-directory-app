import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

// Services
import { CategoryService } from '../../../providers/category.service'

// Forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-category-form',
  templateUrl: 'category-form.html'
})
export class CategoryFormPage {

  public pageTitle;

  public form: FormGroup;
  public updateCategory;

  constructor(
    public navCtrl: NavController, 
    private _viewCtrl: ViewController,
    private _fb: FormBuilder,
    private _categoryService: CategoryService,
    params: NavParams
  ) {
    this.updateCategory = params.get("updateCategory");
    this.pageTitle = this.updateCategory ? "Update Category" : "Create Category";

    this.form = this._fb.group({
      categoryTitleEn: [this.updateCategory?this.updateCategory.categoryTitleEn:"", Validators.required],
      categoryTitleAr: [this.updateCategory?this.updateCategory.categoryTitleAr:"", Validators.required]
    });
  }

  /**
   * Save a new record
   */
  save(){
    if(!this.updateCategory){
      this._categoryService.create(this.form.value);
    }else{
      this._categoryService.update(this.updateCategory.$key, this.form.value);
    }
    
    this._viewCtrl.dismiss();
  }

  /**
   * Close the page
   */
  close(){
    this._viewCtrl.dismiss();
  }

}
