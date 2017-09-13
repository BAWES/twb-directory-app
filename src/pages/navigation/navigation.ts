import { Component, ViewChild } from '@angular/core';
import { MenuController, NavController, Platform } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { ContactPage } from '../contact/contact';
import { CategoryPage } from '../category/category';

@Component({
  selector: 'page-navigation',
  templateUrl: 'navigation.html'
})
export class NavigationPage {

  rootPage: any = CategoryPage;
  menuSide: string = "left";

  @ViewChild('contentArea') nav: NavController

  constructor(private _menuCtrl: MenuController, public platform: Platform) {

  }

  switchToArabic(){
    this._menuCtrl.close();
    this.platform.setDir('rtl', true);
    // this.platform.setLang('ar', false);
    this._menuCtrl.enable(false, 'menuLeft');
    this._menuCtrl.enable(true, 'menuRight');
  }

  switchToEnglish(){
    this._menuCtrl.close();
    this.platform.setDir('ltr', true);
    this.platform.setLang('en', false);
    this._menuCtrl.enable(false, 'menuRight');
    this._menuCtrl.enable(true, 'menuLeft');
  }

  /**
   * Load Page as supplied in param
   * @param pageName 
   */
  pushPage(pageName: string){
    switch(pageName){
      case "login":
        this.nav.push(LoginPage);
        break;
      case "contact":
        this.nav.push(ContactPage);
        break;
    }

    this._menuCtrl.close();
  }

}
