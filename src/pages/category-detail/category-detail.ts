import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { VendorFormPage } from '../forms/vendor-form/vendor-form';

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

    this.vendors = this.db.list('/vendors');
  }


  createVendor(){
    let modal = this.modalCtrl.create(VendorFormPage, {
      vendors: this.vendors
    });
    modal.present();
  }


}
