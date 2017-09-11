import { Injectable } from '@angular/core';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

/*
  Handles all Subcategory functions
*/
@Injectable()
export class SubcategoryService {

  constructor(
    private _db: AngularFireDatabase,
    ) { 
    }

    /**
     * Update across all nodes where it exists
     * @param {any} uid
     * @param {any} data
     */
    update(uid, data){
        //
    }

    /**
     * Delete across all nodes where it exists
     * @param {any} uid
     * @param {any} data
     */
    delete(uid){
        //
    }
}
