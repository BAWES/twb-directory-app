import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

// Services
import { CategoryService } from '../../../providers/category.service'

@Component({
  selector: 'page-subcategory-assignment',
  templateUrl: 'subcategory-assignment.html'
})
export class SubcategoryAssignmentPage {

  public pageTitle;

  public parentCategory;
  public subcategory;

  public parentCategoryVendors: FirebaseListObservable<any[]>;

  constructor(
    public navCtrl: NavController, 
    private _viewCtrl: ViewController,
    private _categoryService: CategoryService,
    public db: AngularFireDatabase,
    params: NavParams
  ) {
    this.parentCategory = params.get("parentCategory");
    this.subcategory = params.get("subcategory");

    this.pageTitle = `${this.subcategory.subcategoryTitleEn} Vendors`;

    // Get Parent Category Vendors 
    this.parentCategoryVendors = this.db.list(`/categoriesWithVendors/${this.parentCategory.$key}/vendors`);
  }

  save(){
    console.log("not implemented");
  }

  /**
   * Close the page
   */
  close(){
    this._viewCtrl.dismiss();
  }

}
