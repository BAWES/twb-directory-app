import { Component, ViewChild } from '@angular/core';
import { MenuController, NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { ContactPage } from '../contact/contact';
import { CategoryPage } from '../category/category';

@Component({
  selector: 'page-navigation',
  templateUrl: 'navigation.html'
})
export class NavigationPage {

  rootPage: any = CategoryPage;

  @ViewChild('contentArea') nav: NavController

  constructor(private _menuCtrl: MenuController) {

  }

  /**
   * Load Page as supplied in param
   * @param pageName 
   */
  loadPage(pageName: string){
    switch(pageName){
      case "category-page":
        this.rootPage = CategoryPage;
        break;
      case "login-page":
        this.rootPage = LoginPage;
        break;
      case "contact-page":
        this.rootPage = ContactPage;
        break;
    }

    this._menuCtrl.close();
  }
}
