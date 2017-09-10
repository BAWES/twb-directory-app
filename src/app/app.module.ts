import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { CategoryFormPage } from '../pages/forms/category-form/category-form';
import { VendorFormPage } from '../pages/forms/vendor-form/vendor-form';

import { LoginPage } from '../pages/login/login';
import { ContactPage } from '../pages/contact/contact';
import { CategoryPage } from '../pages/category/category';
import { TabsPage } from '../pages/tabs/tabs';

// services
import { AuthService } from '../providers/auth.service';

// native
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Facebook } from '@ionic-native/facebook';

// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyC8IOHQhEVqnxyOPUp60vg7Foiw85QAD7I",
  authDomain: "the-white-book.firebaseapp.com",
  databaseURL: "https://the-white-book.firebaseio.com",
  projectId: "the-white-book",
  storageBucket: "the-white-book.appspot.com",
  messagingSenderId: "970489212684"
};

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    ContactPage,
    CategoryPage,
    TabsPage,
    CategoryFormPage,
    VendorFormPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    ContactPage,
    CategoryPage,
    TabsPage,
    CategoryFormPage,
    VendorFormPage
  ],
  providers: [
    AuthService,
    StatusBar,
    SplashScreen,
    Facebook,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
