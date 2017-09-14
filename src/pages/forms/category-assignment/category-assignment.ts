import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

// Services
import { CategoryService } from '../../../providers/category.service'

@Component({
  selector: 'page-category-assignment',
  templateUrl: 'category-assignment.html'
})
export class CategoryAssignmentPage {

  public pageTitle;

  public vendor; //vendor we're assigning categories to.

  public allCategories: FirebaseListObservable<any[]>;
  public selectedCategories = [];
  public alreadyAssignedCategories;

  constructor(
    public navCtrl: NavController, 
    private _viewCtrl: ViewController,
    private _categoryService: CategoryService,
    public db: AngularFireDatabase,
    params: NavParams
  ) {
    this.vendor = params.get("vendor");

    this.pageTitle = `${this.vendor.vendorNameEn}`;

    // Get All Categories 
    this.allCategories = this.db.list(`/categories`);

    // Mark categories that have already been assigned as checked.
    this.db.object(`/vendors/${this.vendor.$key}/categories`).take(1).subscribe(alreadyAssignedCategories => {
      this.alreadyAssignedCategories = alreadyAssignedCategories;
      this.allCategories.forEach((categories) => {
        categories.forEach(category => {
          if(alreadyAssignedCategories[category.$key]){
            this.selectedCategories[category.$key] = true;
          }
        });
      });
    });
    
  }

  /**
   * Save selected vendors into subcategory
   */
  save(){
    this.allCategories.forEach((categories) => {
      categories.forEach(category => {
        if(this.selectedCategories[category.$key] === false && this.alreadyAssignedCategories[category.$key]){
          // Remove Vendor which has already been assigned and unticked before saving.
          this._categoryService.removeVendorFromCategory(this.vendor, category);
        }else if(this.selectedCategories[category.$key] === true){
          // Add Vendor
          this._categoryService.addVendorToCategory(this.vendor, category);
        }
      });
    });

    this.close();
  }

  /**
   * Close the page
   */
  close(){
    this._viewCtrl.dismiss();
  }

}
