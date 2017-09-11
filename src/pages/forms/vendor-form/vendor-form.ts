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

  constructor(
    public navCtrl: NavController, 
    private _viewCtrl: ViewController,
    private _fb: FormBuilder,
    params: NavParams
  ) {
    this.vendors = params.get("vendors");
    this.updateVendor = params.get("updateVendor");
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
    if(!this.updateVendor){
      this.vendors.push(this.form.value);
    }else{
      this.vendors.set(this.updateVendor.$key, this.form.value);
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
