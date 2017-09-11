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
  }


  /**
   * Present create category page
   */
  createCategory(){
    // let modal = this.modalCtrl.create(CategoryFormPage, {
    //   categories: this.categories
    // });
    // modal.present();
  }

  /**
   * Present edit category page
   */
  editCategory(category){
    // let modal = this.modalCtrl.create(CategoryFormPage, {
    //   categories: this.categories,
    //   updateCategory: category 
    // });
    // modal.present();
  }

  /**
   * Delete category
   * @param category 
   */
  deleteCategory(category){
    // let actionSheet = this.actionSheetCtrl.create({
    //   title: 'Are you sure you want to delete ' + category.categoryTitleEn + '?',
    //   buttons: [
    //     {
    //       text: 'Delete',
    //       role: 'destructive',
    //       handler: () => {
    //         this.categories.remove(category);
    //       }
    //     },{
    //       text: 'Cancel',
    //       role: 'cancel',
    //     }
    //   ]
    // });
    // actionSheet.present();
  }

}
