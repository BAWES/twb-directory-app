import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { VendorPage } from '../vendor/vendor';
import { SubcategoryFormPage } from '../forms/subcategory-form/subcategory-form';

import { AuthService } from '../../providers/auth.service';
import { SubcategoryService } from '../../providers/subcategory.service';

@Component({
  selector: 'page-subcategory-detail',
  templateUrl: 'subcategory-detail.html'
})
export class SubcategoryDetailPage {

  public vendors: FirebaseListObservable<any[]>;
  public subcategory;
  public parentCategory;

  constructor(
    params: NavParams,
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public auth: AuthService,
    private _subcategoryService: SubcategoryService,
    public db: AngularFireDatabase
  ) {
    this.subcategory = params.get("subcategory");

    this.vendors = this.db.list(`/subcategories/${this.subcategory.$key}/vendors`);
  }

  showVendorDetail(vendor){
    this.navCtrl.push(VendorPage, {
      vendor: vendor
    });
  }

  createButtonClicked(){
    let actionSheet = this.actionSheetCtrl.create({
      title: `What would you like to do to '${this.subcategory.subcategoryTitleEn}'?`,
      buttons: [
        {
          text: 'Assign Vendors',
          handler: () => {
            // this.assignVendors();
            console.log("Not yet implemented");
          }
        },{
          text: 'Remove Vendors',
          handler: () => {
            // this.removeVendors();
            console.log("Not yet implemented");
          }
        },{
          text: 'Edit Subcategory',
          handler: () => {
            this.editSubcategory();
          }
        },{
          text: 'Delete Subcategory',
          role: 'destructive',
          handler: () => {
            this.deleteSubcategory();
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
   * Present edit category page for this loaded category
   */
  editSubcategory(){
    let modal = this.modalCtrl.create(SubcategoryFormPage, {
      updateCategory: this.subcategory
    });
    modal.onDidDismiss(() => {
      // Go back to previous page to refresh header
      this.navCtrl.pop();
    });
    modal.present();
  }

  /**
   * Delete currently loaded category
   */
  deleteSubcategory(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Are you sure you want to delete ' + this.subcategory.subcategoryTitleEn + '?',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this._subcategoryService.delete(this.subcategory.$key, this.parentCategory.$key);
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
