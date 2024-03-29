import { Component } from '@angular/core';
import { Platform, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';

import { VendorFormPage } from '../forms/vendor-form/vendor-form';
import { CategoryAssignmentPage } from '../forms/category-assignment/category-assignment';
import { SubcatVendorAssignmentPage } from '../forms/subcatvendor-assignment/subcatvendor-assignment';

import { CategoryDetailPage } from '../category-detail/category-detail';
import { SubcategoryDetailPage } from '../subcategory-detail/subcategory-detail';

import { VendorService } from '../../providers/vendor.service';
import { AuthService } from '../../providers/auth.service';

import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'page-vendor',
  templateUrl: 'vendor.html'
})
export class VendorPage {

  //realtime vendor data from /vendor
  public vendor; 
  public categories = [];
  public subcategories = [];

  // vendor data passed from category (without subcategory and category nodes.)
  // We need this for category management in assignToCategories()
  private _basicVendorData; 

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    private _vendorService: VendorService,
    public auth: AuthService,
    public platform: Platform,
    public db: AngularFireDatabase,
    params: NavParams
  ) {
    this._basicVendorData = params.get("vendor");
    // Realtime object from db
    this.db.object(`/vendors/${this._basicVendorData.$key}`).subscribe(vendor => {
      this.vendor = vendor;

      // Prepare category and subcategory arrays
      if(vendor.categories){
        this.categories = [];
        Object.keys(vendor.categories).forEach(categoryKey => {
          vendor.categories[categoryKey].$key = categoryKey;
          this.categories.push(vendor.categories[categoryKey]);
        });
      }else this.categories = [];

      if(vendor.subcategories){
        this.subcategories = [];
        Object.keys(vendor.subcategories).forEach(subcategoryKey => {
          vendor.subcategories[subcategoryKey].$key = subcategoryKey;
          this.subcategories.push(vendor.subcategories[subcategoryKey]);
        });
      }else this.subcategories = [];
      
    });
  }

  createButtonClicked(){
    let actionSheet = this.actionSheetCtrl.create({
      title: `What would you like to do to '${this.vendor.vendorNameEn}'?`,
      buttons: [
        {
          text: 'Manage Category Assignment',
          handler: () => {
            this.assignToCategories();
          }
        },
        {
          text: 'Manage Subcategory Assignment',
          handler: () => {
            this.assignToSubcategories();
          }
        },{
          text: 'Edit Vendor',
          handler: () => {
            this.editVendor();
          }
        },{
          text: 'Delete Vendor',
          role: 'destructive',
          handler: () => {
            this.deleteVendor();
          }
        },{
          text: 'Cancel',
          role: 'cancel',
        }
      ]
    });
    actionSheet.present();
  }

  /*
   * Load category detail page
   */
  loadCategoryDetailPage(category){
    this.navCtrl.push(CategoryDetailPage, {
      category: category
    });
  }

  /*
   * Load subcategory detail page
   */
  loadSubcategoryDetailPage(subcategory){
    this.navCtrl.push(SubcategoryDetailPage, {
      subcategory: subcategory,
    });
  }

  /**
   * Present assign to categories page
   */
  assignToCategories(){
    let modal = this.modalCtrl.create(CategoryAssignmentPage, {
      vendor: this._basicVendorData
    });
    modal.present();
  }

  /**
   * Present assign to subcategories page
   */
  assignToSubcategories(){
    let modal = this.modalCtrl.create(SubcatVendorAssignmentPage, {
      vendor: this.vendor,
      basicVendor: this._basicVendorData
    });
    modal.present();
  }

  /**
   * Present edit category page
   */
  editVendor(){
    let modal = this.modalCtrl.create(VendorFormPage, {
      updateVendor: this._basicVendorData
    });
    modal.onDidDismiss(() => {
      // Update basic vendor data to match real data
      Object.keys(this._basicVendorData).forEach(key => {
        this._basicVendorData[key] = this.vendor[key];
      });
    });
    modal.present();
  }

  /**
   * Delete
   * @param category 
   */
  deleteVendor(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Are you sure you want to delete '+this.vendor.vendorNameEn+'?',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this._vendorService.delete(this.vendor.$key);
            this.navCtrl.pop();
          }
        },{
          text: 'Cancel',
          role: 'cancel',
        }
      ]
    });
    actionSheet.present();
  }

}
