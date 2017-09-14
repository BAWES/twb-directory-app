import { Component } from '@angular/core';
import { Platform, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';

import { VendorFormPage } from '../forms/vendor-form/vendor-form';
import { CategoryFormPage } from '../forms/category-form/category-form';
import { CategoryAssignmentPage } from '../forms/category-assignment/category-assignment';
import { CategoryDetailPage } from '../category-detail/category-detail';

import { VendorService } from '../../providers/vendor.service';
import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'page-vendor',
  templateUrl: 'vendor.html'
})
export class VendorPage {

  public vendor; //vendor data here

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    private _vendorService: VendorService,
    public auth: AuthService,
    public platform: Platform,
    params: NavParams
  ) {
    this.vendor = params.get("vendor");
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

  /**
   * Present assign to categories page
   */
  assignToCategories(){
    let modal = this.modalCtrl.create(CategoryAssignmentPage, {
      vendor: this.vendor
    });
    modal.onDidDismiss(() => {
      // Go back to previous page to refresh
      this.navCtrl.pop();
    });
    modal.present();
  }

  /**
   * Present edit category page
   */
  editVendor(){
    let modal = this.modalCtrl.create(VendorFormPage, {
      updateVendor: this.vendor
    });
    modal.onDidDismiss(() => {
      // Go back to previous page to refresh header
      this.navCtrl.pop();
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
