import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { CategoryFormPage } from '../forms/category-form/category-form';

import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'page-category',
  templateUrl: 'category.html'
})
export class CategoryPage {

  public categories: FirebaseListObservable<any[]>;

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public auth: AuthService,
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

  /**
   * Search for vendor that matches user input
   * @param  
   */
  search($event){

  }

}
