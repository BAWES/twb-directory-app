import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

// Services
import { SubcategoryService } from '../../../providers/subcategory.service'

@Component({
  selector: 'page-subcatvendor-assignment',
  templateUrl: 'subcatvendor-assignment.html'
})
export class SubcatVendorAssignmentPage {

  public pageTitle;

  public vendor; //vendor we're assigning categories to.

  public allowedVendorCategoriesAndSubcategories = [];

  constructor(
    public navCtrl: NavController, 
    private _viewCtrl: ViewController,
    private _subcategoryService: SubcategoryService,
    public db: AngularFireDatabase,
    params: NavParams
  ) {
    this.vendor = params.get("vendor");

    this.pageTitle = `${this.vendor.vendorNameEn}`;

    // Get all "Parent" categories this vendor is assigned to
    this.db.list(`/vendors/${this.vendor.$key}/categories`).take(1).subscribe(vendorCategories => {
      vendorCategories.forEach((vendorCategory, index) => {
        this.allowedVendorCategoriesAndSubcategories[index] = {
          categoryTitle: vendorCategory.categoryTitleEn,
          subcategories: []
        };
        // Get list of ALL subcategories belonging to this category and append to array
        this.db.list(`/categoriesWithVendors/${vendorCategory.$key}/subcategories`).take(1).subscribe(subcategories => {
          subcategories.forEach(subcategory => {
            this.allowedVendorCategoriesAndSubcategories[index].subcategories.push(subcategory);
          });
        });
      });
    });

    // Allow admin to select from that list to create assignments
    
  }

  /**
   * Save selected vendors into subcategory
   */
  save(){

    this.close();
  }

  /**
   * Close the page
   */
  close(){
    this._viewCtrl.dismiss();
  }

}
