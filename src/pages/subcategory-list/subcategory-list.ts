import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { SubcategoryFormPage } from '../forms/subcategory-form/subcategory-form';

import { AuthService } from '../../providers/auth.service';
import { SubcategoryService } from '../../providers/subcategory.service';

@Component({
  selector: 'page-subcategory-list',
  templateUrl: 'subcategory-list.html'
})
export class SubcategoryListPage {

  public parentCategory;
  public subcategories: FirebaseListObservable<any[]>;

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public auth: AuthService,
    private _subcategoryService: SubcategoryService,
    public db: AngularFireDatabase,
    params: NavParams
  ) {
    this.parentCategory = params.get("category");

    let node = `/categoriesWithVendors/${this.parentCategory.$key}/subcategories`;
    this.subcategories = this.db.list(node);
  }

  /**
   * Present create page
   */
  create(){
    let modal = this.modalCtrl.create(SubcategoryFormPage);
    modal.present();
  }

  /**
   * Present edit page
   */
  edit(category){
    let modal = this.modalCtrl.create(SubcategoryFormPage, {
      updateCategory: category 
    });
    modal.present();
  }

  /**
   * Delete category
   * @param subcategory 
   */
  delete(subcategory){
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
