import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { CategoryFormPage } from '../forms/category-form/category-form';

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
    // let modal = this.modalCtrl.create(CategoryFormPage, {
    //   categories: this.categories
    // });
    // modal.present();
  }


}
