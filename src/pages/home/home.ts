import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { CategoryFormPage } from '../category/category-form/category-form'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public categories: FirebaseListObservable<any[]>;

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    db: AngularFireDatabase
  ) {
    this.categories = db.list('/categories');
  }


  /**
   * Present create category page
   */
  createCategory(){
    let modal = this.modalCtrl.create(CategoryFormPage, {
      categories: this.categories
    });
    modal.present();
  }

}
