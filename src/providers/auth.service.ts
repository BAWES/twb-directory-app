import { Injectable } from '@angular/core';

import { Platform } from 'ionic-angular';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/take';

/*
  Handles all Auth functions
*/
@Injectable()
export class AuthService {

  // Logged in agent details
  public isLoggedIn: boolean = false;
  public isAdmin: boolean = false;
  public displayName: string;
  public email: string;

  constructor(
    private _platform: Platform,
    private _db: AngularFireDatabase,
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
            // User successfully logged in.
            this.isLoggedIn = true;
            this.displayName = user.displayName;      
            this.email = user.email;
            this.checkIfUserIsAdmin(user.uid);
        });
    }

    /**
     * Check if logged in user is admin
     */
    checkIfUserIsAdmin(uid: string){
        if(!this.isLoggedIn) return;
        this._db.object(`/admins/${uid}`)
            .take(1)
            .subscribe(adminRecord => this.isAdmin = adminRecord.$exists());
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
