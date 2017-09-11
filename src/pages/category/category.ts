import { Component } from '@angular/core';
import { NavController, ModalController, ActionSheetController } from 'ionic-angular';
import 'rxjs/add/operator/map';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { CategoryFormPage } from '../forms/category-form/category-form';
import { CategoryDetailPage } from '../category-detail/category-detail';

import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'page-category',
  templateUrl: 'category.html'
})
export class CategoryPage {

  public categories: any;

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public auth: AuthService,
    public db: AngularFireDatabase
  ) {
    this.categories = this.db.list('/categories').map(categories => {
      categories.map(category => {
        if(category.vendors){
          let vendorList = [];
          Object.keys(category.vendors).forEach(uidKey => {
            vendorList.push({
              key: uidKey,
              data: category.vendors[uidKey]
            });
          });
          category.vendors = vendorList;
        }
      });
      return categories;
    });
  }

  /*
   * Load category detail page
   */
  loadCategory(category){
    this.navCtrl.push(CategoryDetailPage, {
      category: category
    });
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
   * Present edit category page
   */
  editCategory(category){
    let modal = this.modalCtrl.create(CategoryFormPage, {
      categories: this.categories,
      updateCategory: category 
    });
    modal.present();
  }

  /**
   * Delete category
   * @param category 
   */
  deleteCategory(category){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Are you sure you want to delete ' + category.categoryTitleEn + '?',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.categories.remove(category);
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
   * Search for vendor that matches user input
   * @param  
   */
  search($event){
    let userInput = $event.target.value;
    this.categories = this.db.list('/categories', {
      query: {
        orderByChild: "categoryTitleEn", //need to make sure to store in lowercase in backend and query in lowercase
        startAt: userInput,
        endAt: userInput+'\uf8ff',
      }
    });
  }

}
