import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(
    public navCtrl: NavController, 
    private _auth: AuthService) {

  }

  loginWithFacebook(){
    this._auth.loginWithFacebook();
  }

  logout(){
    this._auth.logout();
  }

}
