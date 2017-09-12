import { Component } from '@angular/core';
import { NavController, ModalController, ActionSheetController } from 'ionic-angular';
import 'rxjs/add/operator/map';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { CategoryFormPage } from '../forms/category-form/category-form';
import { CategoryDetailPage } from '../category-detail/category-detail';

import { AuthService } from '../../providers/auth.service';
import { SubcategoryService } from '../../providers/subcategory.service';

@Component({
  selector: 'page-subcategory-list',
  templateUrl: 'subcategory-list.html'
})
export class SubcategoryListPage {

  public categories: FirebaseListObservable<any[]>;

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public auth: AuthService,
    private _subcategoryService: SubcategoryService,
    public db: AngularFireDatabase
  ) {
    this.categories = this.db.list('/categories');
  }

  /*
   * Load detail page
   */
  load(category){
    this.navCtrl.push(CategoryDetailPage, {
      category: category
    });
  }

  /**
   * Present create page
   */
  create(){
    let modal = this.modalCtrl.create(CategoryFormPage);
    modal.present();
  }

  /**
   * Present edit page
   */
  edit(category){
    let modal = this.modalCtrl.create(CategoryFormPage, {
      updateCategory: category 
    });
    modal.present();
  }

  /**
   * Delete category
   * @param subcategory 
   */
  deleteSubcategory(subcategory){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Are you sure you want to delete ' + subcategory.subcategoryTitleEn + '?',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this._subcategoryService.delete(subcategory.$key);
          }
        },{
          text: 'Cancel',
          role: 'cancel',
        }
      ]
    });
    actionSheet.present();
  }

}
