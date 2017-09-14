import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

// Services
import { SubcategoryService } from '../../../providers/subcategory.service'

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
    private _subcategoryService: SubcategoryService,
    public db: AngularFireDatabase,
    params: NavParams
  ) {
    this.vendor = params.get("vendor");

    this.pageTitle = `Categories ${this.vendor.vendorNameEn}`;

    // Get All Categories 
    this.allCategories = this.db.list(`/categories`);

    // Mark categories that have already been assigned as checked.
    this.db.object(`/vendors/${this.vendor.$key}/categories`).take(1).subscribe(alreadyAssignedCategories => {
      this.alreadyAssignedCategories = alreadyAssignedCategories;
      this.allCategories.forEach((vendors) => {
        vendors.forEach(vendor => {
          if(alreadyAssignedCategories[vendor.$key]){
            this.selectedCategories[vendor.$key] = true;
          }
        });
      });
    });
    
  }

  /**
   * Save selected vendors into subcategory
   */
  save(){
    this.allCategories.forEach((vendors) => {
      vendors.forEach(vendor => {
        if(this.selectedCategories[vendor.$key] === false && this.alreadyAssignedCategories[vendor.$key]){
          // Remove Vendor which has already been assigned and unticked before saving.
          // this._subcategoryService.removeVendor(vendor, this.subcategory);
        }else if(this.selectedCategories[vendor.$key] === true){
          // Add Vendor
          // this._subcategoryService.addVendor(vendor, this.subcategory);
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
