import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { FirebaseListObservable } from 'angularfire2/database';

// Forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-category-form',
  templateUrl: 'category-form.html'
})
export class CategoryFormPage {

  public form: FormGroup;
  public categories: FirebaseListObservable<any[]>;
  public updateCategory;

  constructor(
    public navCtrl: NavController, 
    private _viewCtrl: ViewController,
    private _fb: FormBuilder,
    params: NavParams
  ) {
    this.categories = params.get("categories");
    this.updateCategory = params.get("updateCategory");
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
      this.categories.push(this.form.value);
    }else{
      this.categories.set(this.updateCategory.$key, this.form.value);
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
