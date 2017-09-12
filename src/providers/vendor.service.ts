import { Injectable } from '@angular/core';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

/*
  Handles all Vendor functions
*/
@Injectable()
export class VendorService {

  constructor(
    private _db: AngularFireDatabase,
    ) { 
    }

    /**
     * Create across all nodes where it should exist
     * @param {any} category category to place vendor record in
     * @param {any} data vendor data
     */
    create(category, data){
        // Generate a unique key
        let key = this._db.list('/vendors').push(undefined).key;

        /**
         * Create in all nodes where it should exist
         * - vendor record in /vendor node
         * - vendor record in /categoriesWithVendors node.
         */
        this._db.object('/').update({
            [`/vendors/${key}`]: data,
            [`/categoriesWithVendors/${category.$key}/vendors/${key}`]: data
        });

        // Create category record in in this vendors /vendor node.
        this._db.object('/').update({
            [`/vendors/${key}/categories/${category.$key}`]: category
        });
    }

    /**
     * Update across all nodes where it exists
     * @param {any} key
     * @param {any} data
     */
    update(key, data){
        // let response = this._db.object('/').update({
        //     [`/vendors/${key}`]: data,
        //     [`/categoriesWithVendors/${categoryKey}/vendors/${key}`]: data
        // });

        // update in category list
        // update in subcategory list
    }

    /**
     * Delete across all nodes where it exists
     * @param {any} key
     * @param {any} data
     */
    delete(key){
        //
    }

    /**
     * Return array of nodes where this vendor exists
     */
    private _getNodesWhereVendorExists(){

    }
}
