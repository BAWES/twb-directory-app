import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { FirebaseListObservable } from 'angularfire2/database';

// Forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-create-category',
  templateUrl: 'create-category.html'
})
export class CreateCategoryPage {

  public form: FormGroup;
  public categories: FirebaseListObservable<any[]>;

  constructor(
    public navCtrl: NavController, 
    private _viewCtrl: ViewController,
    private _fb: FormBuilder,
    params: NavParams
  ) {
    this.categories = params.get("categories");
    this.form = this._fb.group({
      categoryTitleEn: ["", Validators.required],
      categoryTitleAr: ["", Validators.required]
    });
  }

  /**
   * Save a new record
   */
  save(){
    this.categories.push({
      categoryTitleEn: this.form.value.categoryTitleEn,
      categoryTitleAr: this.form.value.categoryTitleAr,
    });
  }

  /**
   * Close the page
   */
  close(){
    this._viewCtrl.dismiss();
  }

}
