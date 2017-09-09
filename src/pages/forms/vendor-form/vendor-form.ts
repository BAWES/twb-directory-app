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

  constructor(
    public navCtrl: NavController, 
    private _viewCtrl: ViewController,
    private _fb: FormBuilder,
    params: NavParams
  ) {
    this.vendors = params.get("vendors");
    this.form = this._fb.group({
      vendorNameEn: ["", Validators.required],
      vendorNameAr: ["", Validators.required]
    });
  }

  /**
   * Save a new record
   */
  save(){
    this.vendors.push({
      vendorNameEn: this.form.value.vendorNameEn,
      vendorNameAr: this.form.value.vendorNameAr,
    });
    this._viewCtrl.dismiss();
  }

  /**
   * Close the page
   */
  close(){
    this._viewCtrl.dismiss();
  }

}
