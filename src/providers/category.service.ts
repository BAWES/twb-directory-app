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
        // Create category in "/categories" node
        let response = this._db.list("/categories").push(data);
    }

    /**
     * Update across all nodes where it exists
     * @param {any} uid
     * @param {any} data
     */
    update(uid, data){
        // Update in "/categories" node
        let response = this._db.list("/categories").set(uid, data);
    }

    /**
     * Delete across all nodes where it exists
     * @param {any} uid
     * @param {any} data
     */
    delete(uid){
        // Delete from "/categories" node
        let response = this._db.object(`/categories/${uid}`).remove();
    }
}
