import { Component } from '@angular/core';

import { LoginPage } from '../login/login';
import { ContactPage } from '../contact/contact';
import { CategoryPage } from '../category/category';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = CategoryPage;
  tab2Root = LoginPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
