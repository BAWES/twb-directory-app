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

  public parentCategory;
  public subcategory;

  public parentCategoryVendors: FirebaseListObservable<any[]>;
  public selectedVendors = [];
  public alreadyAssignedVendors;

  constructor(
    public navCtrl: NavController, 
    private _viewCtrl: ViewController,
    private _subcategoryService: SubcategoryService,
    public db: AngularFireDatabase,
    params: NavParams
  ) {
    this.parentCategory = params.get("parentCategory");
    this.subcategory = params.get("subcategory");

    this.pageTitle = `${this.subcategory.subcategoryTitleEn} Vendors`;

    // Get Parent Category Vendors 
    this.parentCategoryVendors = this.db.list(`/categoriesWithVendors/${this.parentCategory.$key}/vendors`);

    // Mark vendors that have already been assigned as checked.
    this.db.object(`/subcategories/${this.subcategory.$key}/vendors`).take(1).subscribe(alreadyAssignedVendors => {
      this.alreadyAssignedVendors = alreadyAssignedVendors;
      this.parentCategoryVendors.forEach((vendors) => {
        vendors.forEach(vendor => {
          if(alreadyAssignedVendors[vendor.$key]){
            this.selectedVendors[vendor.$key] = true;
          }
        });
      });
    });
    
  }

  /**
   * Save selected vendors into subcategory
   */
  save(){
    this.parentCategoryVendors.forEach((vendors) => {
      vendors.forEach(vendor => {
        if(this.selectedVendors[vendor.$key] === false && this.alreadyAssignedVendors[vendor.$key]){
          // Remove Vendor which has already been assigned and unticked before saving.
          this._subcategoryService.removeVendor(vendor, this.subcategory);
        }else if(this.selectedVendors[vendor.$key] === true){
          // Add Vendor
          this._subcategoryService.addVendor(vendor, this.subcategory);
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
