import { Component } from '@angular/core';
import { Platform, NavController, ModalController, ActionSheetController } from 'ionic-angular';
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

  public categories: FirebaseListObservable<any[]>;
  public vendors; // full vendor list
  public vendorSearchResults; // filtered list

  public isSearching = false;
  

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public auth: AuthService,
    public platform: Platform,
    public db: AngularFireDatabase
  ) {
    this.categories = this.db.list('/categories');

    // Prepare vendors for search results
    this.db.list('/vendors').subscribe(vendors => {
      this.vendors = vendors;
      this.vendorSearchResults = vendors;
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
    let modal = this.modalCtrl.create(CategoryFormPage);
    modal.present();
  }

  /**
   * Search for vendor that matches user input
   * @param  
   */
  search($event){
    let userInput = $event.target.value;
    if(!userInput){
      this.isSearching = false;
      return;
    }

    this.isSearching = true;
    this.vendorSearchResults = this.vendors.filter(vendor => {
      if((vendor.vendorNameEn.toLowerCase().indexOf(userInput.toLowerCase()) !== -1) || (vendor.vendorNameAr.indexOf(userInput) !== -1)){
        return true;
      }
      return false;
    });
  }

}
