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
    this.form = this._fb.group({
      categoryTitleEn: [this.updateVendor?this.updateVendor.categoryTitleEn:"", Validators.required],
      categoryTitleAr: [this.updateVendor?this.updateVendor.categoryTitleAr:"", Validators.required],
      descriptionEn: [this.updateVendor?this.updateVendor.descriptionEn:"", Validators.required],
      descriptionAr: [this.updateVendor?this.updateVendor.descriptionAr:"", Validators.required],
      locationEn: [this.updateVendor?this.updateVendor.locationEn:"", Validators.required],
      locationAr: [this.updateVendor?this.updateVendor.locationAr:"", Validators.required],
      workingHours: [this.updateVendor?this.updateVendor.workingHours:"", Validators.required],
      website: [this.updateVendor?this.updateVendor.website:"", Validators.required],
      instagram: [this.updateVendor?this.updateVendor.instagram:"", Validators.required],
      contactEmail: [this.updateVendor?this.updateVendor.contactEmail:"", Validators.required],
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
