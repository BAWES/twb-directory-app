import { Component } from '@angular/core';
import { Platform, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';

import { CategoryFormPage } from '../forms/category-form/category-form';
import { CategoryDetailPage } from '../category-detail/category-detail';

import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'page-vendor',
  templateUrl: 'vendor.html'
})
export class VendorPage {

  public vendor; //vendor data here

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public auth: AuthService,
    public platform: Platform,
    params: NavParams
  ) {
    this.vendor = params.get("vendor");
  }

  /**
   * Present create category page
   */
  create(){
    let modal = this.modalCtrl.create(CategoryFormPage);
    modal.present();
  }

  /**
   * Present edit category page
   */
  edit(){
    let modal = this.modalCtrl.create(CategoryFormPage, {
    });
    modal.present();
  }

  /**
   * Delete
   * @param category 
   */
  delete(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Are you sure you want to delete ?',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            // this._categoryService.delete(category.$key);
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
