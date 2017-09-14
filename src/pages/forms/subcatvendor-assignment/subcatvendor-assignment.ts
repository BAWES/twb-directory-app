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

  public selectedSubcategories = [];
  public alreadyAssignedSubcategories;

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

    // Create a list of subcategories grouped by each parent category

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
