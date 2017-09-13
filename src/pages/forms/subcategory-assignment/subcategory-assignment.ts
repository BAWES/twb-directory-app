import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

// Services
import { SubcategoryService } from '../../../providers/subcategory.service'

@Component({
  selector: 'page-subcategory-assignment',
  templateUrl: 'subcategory-assignment.html'
})
export class SubcategoryAssignmentPage {

  public pageTitle;

  public parentCategory;
  public subcategory;

  public parentCategoryVendors: FirebaseListObservable<any[]>;
  public selectedVendors = [];

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
   * Add selected vendors to subcategory
   */
  save(){
    this.parentCategoryVendors.forEach((vendors) => {
      vendors.forEach(vendor => {
        if(this.selectedVendors[vendor.$key]){
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
