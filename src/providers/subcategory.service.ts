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
     * Create across all nodes where it should exist
     * @param {any} parentCategoryKey
     * @param {any} data
     */
    create(parentCategoryKey, data){
        // Generate a unique key
        let key = this._db.list('/subcategories').push(undefined).key;

        // Create in all nodes where it should exist
        let response = this._db.object('/').update({
            [`/subcategories/${key}`]: data,
            [`/categoriesWithVendors/${parentCategoryKey}/subcategories/${key}`]: data
        });
    }

    /**
     * Update across all nodes where it exists
     * @param {any} key
     * @param {any} parentCategoryKey
     * @param {any} data
     */
    update(key, parentCategoryKey, data){
        // TODO: Get paths to this subcategory within each vendor and update
        let response = this._db.object('/').update({
            [`/subcategories/${key}`]: data,
            [`/categoriesWithVendors/${parentCategoryKey}/subcategories/${key}`]: data
        });
    }

    /**
     * Delete across all nodes where it exists
     * @param {any} key
     * @param {any} parentCategoryKey
     */
    delete(key, parentCategoryKey){
        // TODO: Get paths to this subcategory within each vendor and delete
        let response = this._db.object('/').update({
            [`/subcategories/${key}`]: null,
            [`/categoriesWithVendors/${parentCategoryKey}/subcategories/${key}`]: null
        });
    }

    /**
     * Return array of nodes where this subcategory exists
     */
    private _getNodesWhereSubcategoryExists(){

    }
}
