import { Injectable } from '@angular/core';

import { Platform } from 'ionic-angular';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

/*
  Handles all Auth functions
*/
@Injectable()
export class AuthService {

  // Logged in agent details
  public isLoggedIn: boolean;
  public displayName: string;
  public email: string;

  constructor(
    private _platform: Platform,
    private _afAuth: AngularFireAuth,
    private _fb: Facebook
    ) { 
        this.listenForAuthStatusChange();
    }

    /**
     * Listen for auth status changes for rest of the app
     */
    listenForAuthStatusChange(){
        this._afAuth.authState.subscribe(user => {
        if (!user) {
            this.isLoggedIn = false;
            this.displayName = null;   
            this.email = null;     
            return;
        }
        this.isLoggedIn = true;
        this.displayName = user.displayName;      
        this.email = user.email;      
        });
    }

    /**
     * Login via Facebook
     */
    loginWithFacebook(){
        if (this._platform.is('cordova')) {
            return this._fb.login(['email', 'public_profile']).then((res: FacebookLoginResponse) => {
                const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
                return firebase.auth().signInWithCredential(facebookCredential);
            });
        }else {
            this._afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(res => {
                console.log(res);
            });
        }
    }

    /**
     * Logs a user out
     */
    logout(){
        this._afAuth.auth.signOut();
    }
}
