import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController) {

  }

  loginWithFacebook(){
    console.log("Logging in with facebook");
  }

  logout(){
    console.log("Logging out.")
  }

}
