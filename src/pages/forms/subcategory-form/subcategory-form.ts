import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

// Services
import { SubcategoryService } from '../../../providers/subcategory.service'

// Forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-subcategory-form',
  templateUrl: 'subcategory-form.html'
})
export class SubcategoryFormPage {

  public pageTitle;

  public form: FormGroup;
  public updateSubcategory;
  public parentCategory;

  constructor(
    public navCtrl: NavController, 
    private _viewCtrl: ViewController,
    private _fb: FormBuilder,
    private _subcategoryService: SubcategoryService,
    params: NavParams
  ) {
    this.updateSubcategory = params.get("updateSubcategory");
    this.parentCategory = params.get("parentCategory");
    this.pageTitle = this.updateSubcategory ? "Update Subcategory" : "Create Subcategory";

    this.form = this._fb.group({
      subcategoryTitleEn: [this.updateSubcategory?this.updateSubcategory.subcategoryTitleEn:"", Validators.required],
      subcategoryTitleAr: [this.updateSubcategory?this.updateSubcategory.subcategoryTitleAr:"", Validators.required]
    });
  }

  /**
   * Save a new record
   */
  save(){
    if(!this.updateSubcategory){
      this._subcategoryService.create(this.parentCategory.$key, this.form.value);
    }else{
      this._subcategoryService.update(this.parentCategory.$key, this.updateSubcategory.$key, this.form.value);
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