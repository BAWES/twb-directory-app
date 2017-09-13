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
