import { Component } from '@angular/core';
import { Platform, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { VendorPage } from '../vendor/vendor';
import { SubcategoryFormPage } from '../forms/subcategory-form/subcategory-form';
import { SubcategoryAssignmentPage } from '../forms/subcategory-assignment/subcategory-assignment';

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

  public showManagementButton: boolean = false;

  constructor(
    params: NavParams,
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public auth: AuthService,
    public platform: Platform,
    private _subcategoryService: SubcategoryService,
    public db: AngularFireDatabase
  ) {
    this.subcategory = params.get("subcategory");
    this.parentCategory = params.get("parentCategory");

    this.showManagementButton = this._isUpdateAllowed();

    this.vendors = this.db.list(`/subcategories/${this.subcategory.$key}/vendors`);
  }

  showVendorDetail(vendor){
    this.navCtrl.push(VendorPage, {
      vendor: vendor
    });
  }

  createButtonClicked(){
    if(!this._isUpdateAllowed()) return;

    let actionSheet = this.actionSheetCtrl.create({
      title: `What would you like to do to '${this.subcategory.subcategoryTitleEn}'?`,
      buttons: [
        {
          text: 'Manage Vendor Assignment',
          handler: () => {
            this.assignVendors();
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

  assignVendors(){
    if(!this._isUpdateAllowed()) return;

    let modal = this.modalCtrl.create(SubcategoryAssignmentPage, {
      parentCategory: this.parentCategory,
      subcategory: this.subcategory
    });
    modal.present();
  }

  /**
   * Present edit category page for this loaded category
   */
  editSubcategory(){
    if(!this._isUpdateAllowed()) return;

    let modal = this.modalCtrl.create(SubcategoryFormPage, {
      parentCategory: this.parentCategory,
      updateSubcategory: this.subcategory
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
    if(!this._isUpdateAllowed()) return;

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

  /**
   * To improve performance by reducing queries, updating/permanent changes to subcategories
   * will only be allowed if navigating to it from parent category
   */
  private _isUpdateAllowed(){
    if(!this.parentCategory){
      return false;
    }
    return true;
  }


}
