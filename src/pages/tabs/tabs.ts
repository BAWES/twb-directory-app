import { Component } from '@angular/core';

import { LoginPage } from '../login/login';
import { DirectoryPage } from '../directory/directory';
import { ContactPage } from '../contact/contact';
import { CategoryPage } from '../category/category';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = CategoryPage;
  tab2Root = DirectoryPage;
  tab3Root = LoginPage;
  tab4Root = ContactPage;

  constructor() {

  }
}
