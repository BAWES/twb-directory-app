import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController, private _afAuth: AngularFireAuth) {

  }

  loginWithFacebook(){
    console.log("Logging in with facebook");
    this._afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(res => {
      console.log(res);
    });
  }

  logout(){
    console.log("Logging out.")
    this._afAuth.auth.signOut();
  }

}
