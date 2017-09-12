import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { FirebaseListObservable, FirebaseObjectObservable, AngularFireDatabase } from 'angularfire2/database';

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
    public db: AngularFireDatabase,
    params: NavParams
  ) {
    this.vendors = params.get("vendors");
    this.updateVendor = params.get("updateVendor");
    this.categoryToPlaceVendor = params.get("category");
    this.pageTitle = this.updateVendor ? "Update Vendor" : "Create Vendor";

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
    
    if(!this.updateVendor){// Create
      // Add Vendor to Vendor List
      let vendorRecord = this.vendors.push(vendorData);

      // Add Vendor to this Category's vendor list
      let categoryInfo: FirebaseObjectObservable<any> = this.db.object(`/categories/${this.categoryToPlaceVendor.$key}/vendors/${vendorRecord.key}`);
      categoryInfo.set(vendorData);

      // Update Vendor Record from /vendors to set category record 
      vendorRecord.child("categories/"+this.categoryToPlaceVendor.$key).set(this.categoryToPlaceVendor);
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
