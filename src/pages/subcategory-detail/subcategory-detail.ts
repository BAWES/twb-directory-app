import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { VendorPage } from '../vendor/vendor';
import { VendorFormPage } from '../forms/vendor-form/vendor-form';
import { CategoryFormPage } from '../forms/category-form/category-form';
import { SubcategoryFormPage } from '../forms/subcategory-form/subcategory-form';
import { SubcategoryListPage } from '../subcategory-list/subcategory-list';

import { AuthService } from '../../providers/auth.service';
import { CategoryService } from '../../providers/category.service';

@Component({
  selector: 'page-subcategory-detail',
  templateUrl: 'subcategory-detail.html'
})
export class SubcategoryDetailPage {

  public vendors: FirebaseListObservable<any[]>;
  public subcategories: FirebaseListObservable<any[]>;
  public category;

  constructor(
    params: NavParams,
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public auth: AuthService,
    private _categoryService: CategoryService,
    public db: AngularFireDatabase
  ) {
    this.category = params.get("category");

    this.vendors = this.db.list(`/categoriesWithVendors/${this.category.$key}/vendors`);
    this.subcategories = this.db.list(`/categoriesWithVendors/${this.category.$key}/subcategories`);
  }

  showVendorDetail(vendor){
    this.navCtrl.push(VendorPage, {
      vendor: vendor
    });
  }

  createButtonClicked(){
    let actionSheet = this.actionSheetCtrl.create({
      title: `What would you like to do to '${this.category.categoryTitleEn}'?`,
      buttons: [
        {
          text: 'Create Vendor',
          handler: () => {
            this.createVendor();
          }
        },{
          text: 'Create Subcategory',
          handler: () => {
            this.createSubcategory();
          }
        },{
          text: 'Manage Subcategories',
          handler: () => {
            this.manageSubcategories();
          }
        },{
          text: 'Edit Category',
          handler: () => {
            this.editCategory();
          }
        },{
          text: 'Delete Category',
          role: 'destructive',
          handler: () => {
            this.deleteCategory();
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
  editCategory(){
    let modal = this.modalCtrl.create(CategoryFormPage, {
      updateCategory: this.category
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
  deleteCategory(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Are you sure you want to delete ' + this.category.categoryTitleEn + '?',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this._categoryService.delete(this.category.$key);
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

  createSubcategory(){
    let modal = this.modalCtrl.create(SubcategoryFormPage, {
      parentCategory: this.category
    });
    modal.present();
  }

  createVendor(){
    let modal = this.modalCtrl.create(VendorFormPage, {
      category: this.category
    });
    modal.present();
  }

  manageSubcategories(){
    let modal = this.modalCtrl.create(SubcategoryListPage, {
      category: this.category
    });
    modal.present();
  }


}
