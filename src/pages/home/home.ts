import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { CreateCategoryPage } from '../category/create-category/create-category'

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
    let modal = this.modalCtrl.create(CreateCategoryPage, {
      categories: this.categories
    });
    modal.present();
  }

}
