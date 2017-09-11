import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { FirebaseListObservable } from 'angularfire2/database';

// Forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-vendor-form',
  templateUrl: 'vendor-form.html'
})
export class VendorFormPage {

  public pageTitle;

  public form: FormGroup;
  public vendors: FirebaseListObservable<any[]>;
  public updateVendor;

  //when vendor is created within a category, they are automatically placed within it.
  public categoryToPlaceVendor; 
  
  constructor(
    public navCtrl: NavController, 
    private _viewCtrl: ViewController,
    private _fb: FormBuilder,
    params: NavParams
  ) {
    this.vendors = params.get("vendors");
    this.updateVendor = params.get("updateVendor");
    this.categoryToPlaceVendor = params.get("category");
    this.pageTitle = this.updateVendor ? "Update Category" : "Create Category";

    this.form = this._fb.group({
      vendorNameEn: [this.updateVendor?this.updateVendor.vendorNameEn:"", Validators.required],
      vendorNameAr: [this.updateVendor?this.updateVendor.vendorNameAr:"", Validators.required],
      descriptionEn: [this.updateVendor?this.updateVendor.descriptionEn:""],
      descriptionAr: [this.updateVendor?this.updateVendor.descriptionAr:""],
      locationEn: [this.updateVendor?this.updateVendor.locationEn:""],
      locationAr: [this.updateVendor?this.updateVendor.locationAr:""],
      workingHours: [this.updateVendor?this.updateVendor.workingHours:""],
      website: [this.updateVendor?this.updateVendor.website:""],
      instagram: [this.updateVendor?this.updateVendor.instagram:""],
      contactEmail: [this.updateVendor?this.updateVendor.contactEmail:""],
    });
  }

  /**
   * Save a new record
   */
  save(){
    let vendorData = this.form.value;
    vendorData.categories = this.categoryToPlaceVendor;
    
    if(!this.updateVendor){
      // Vendor Creation -> Place it in this category as well + Define that it belongs to this category.

      // Add Vendor to Vendor List
      this.vendors.push(vendorData);

      // Add Vendor to this category
    }else{
      // Vendor Update -> Update this vendors record across all categories and subcategories it is present in.
      // this.vendors.update(this.updateVendor.$key, vendorData);
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
