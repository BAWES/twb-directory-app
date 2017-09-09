import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { VendorFormPage } from '../forms/vendor-form/vendor-form';

import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'page-directory',
  templateUrl: 'directory.html'
})
export class DirectoryPage {

  public vendors: FirebaseListObservable<any[]>;

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public auth: AuthService,
    db: AngularFireDatabase
  ) {
    this.vendors = db.list('/vendors');
  }


  /**
   * Present create vendor page
   */
  createVendor(){
    let modal = this.modalCtrl.create(VendorFormPage, {
      vendors: this.vendors
    });
    modal.present();
  }

}
