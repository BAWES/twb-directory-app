import { Injectable } from '@angular/core';
import 'rxjs/add/operator/take';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

/*
  Handles all Category functions
*/
@Injectable()
export class CategoryService {

  constructor(
    private _db: AngularFireDatabase,
    ) { 
    }

    /**
     * Create across all nodes where it should exist
     * @param {any} data
     */
    create(data){
        // Generate a unique key
        let key = this._db.list('/').push(undefined).key;

        // Create in all nodes where it should exist
        let response = this._db.object('/').update({
            [`/categories/${key}`]: data,
            [`/categoriesWithVendors/${key}`]: data
        });
    }

    /**
     * Update across all nodes where it exists
     * @param {any} uid
     * @param {any} data
     */
    update(uid, data){
        let response = this._db.object('/').update({
            [`/categories/${uid}`]: data,
            [`/categoriesWithVendors/${uid}`]: data
        });
    }

    /**
     * Delete across all nodes where it exists
     * @param {any} uid
     * @param {any} data
     */
    delete(uid){
        let response = this._db.object('/').update({
            [`/categories/${uid}`]: null,
            [`/categoriesWithVendors/${uid}`]: null
        });
    }
}
