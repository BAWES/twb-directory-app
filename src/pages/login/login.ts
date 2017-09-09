import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Facebook } from '@ionic-native/facebook';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(
    public navCtrl: NavController, 
    private _afAuth: AngularFireAuth,
    private _platform: Platform,
    private _fb: Facebook) {

  }

  loginWithFacebook(){
    console.log("Logging in with facebook");
    if (this._platform.is('cordova')) {
      return this._fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential);
      })
    }else {
      this._afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(res => {
        console.log(res);
      });
    }
  }

  logout(){
    console.log("Logging out.")
    this._afAuth.auth.signOut();
  }

}
