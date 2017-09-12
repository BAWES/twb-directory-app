import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { VendorPage } from '../vendor/vendor';
import { VendorFormPage } from '../forms/vendor-form/vendor-form';
import { SubcategoryListPage } from '../subcategory-list/subcategory-list';

import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'page-category-detail',
  templateUrl: 'category-detail.html'
})
export class CategoryDetailPage {

  public vendors: FirebaseListObservable<any[]>;
  public category;

  constructor(
    params: NavParams,
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public auth: AuthService,
    public db: AngularFireDatabase
  ) {
    this.category = params.get("category");

    this.vendors = this.db.list(`/categoriesWithVendors/${this.category.$key}/vendors`);
  }

  showVendorDetail(vendor){
    this.navCtrl.push(VendorPage, {
      vendor: vendor
    });
  }

  createButtonClicked(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'What would you like to do?',
      buttons: [
        {
          text: 'Create Vendor',
          handler: () => {
            this.createVendor();
          }
        },{
          text: 'Manage Subcategories',
          handler: () => {
            this.manageSubcategories();
          }
        },{
          text: 'Cancel',
          role: 'cancel',
        }
      ]
    });
    actionSheet.present();
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
