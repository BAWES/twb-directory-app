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
  public selectedSubcategories = [];

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

          // Mark categories that have already been assigned as checked.
          this._markAlreadyAssigned();
        });
      });
    });

    // Allow admin to select from that list to create assignments
    
  }

  
  private _markAlreadyAssigned(){
    
    // this.db.object(`/vendors/${this.vendor.$key}/categories`).take(1).subscribe(alreadyAssignedCategories => {
    //   this.alreadyAssignedCategories = alreadyAssignedCategories;
    //   this.allCategories.forEach((categories) => {
    //     categories.forEach(category => {
    //       if(alreadyAssignedCategories[category.$key]){
    //         this.selectedCategories[category.$key] = true;
    //       }
    //     });
    //   });
    // });
  }

  /**
   * Save selected vendors into subcategory
   */
  save(){
    console.log(this.selectedSubcategories);
    // this.close();
  }

  /**
   * Close the page
   */
  close(){
    this._viewCtrl.dismiss();
  }

}
