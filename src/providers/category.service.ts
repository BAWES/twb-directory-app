import { Injectable } from '@angular/core';

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
        let key = this._db.list('/categories').push(undefined).key;

        // Create in all nodes where it should exist
        let response = this._db.object('/').update({
            [`/categories/${key}`]: data,
            [`/categoriesWithVendors/${key}`]: data
        });
    }

    /**
     * Update across all nodes where it exists
     * @param {any} key
     * @param {any} data
     */
    update(key, data){
        // TODO: Get paths to this category within each vendor and update
        let response = this._db.object('/').update({
            [`/categories/${key}`]: data,
            [`/categoriesWithVendors/${key}`]: data
        });
    }

    /**
     * Delete across all nodes where it exists
     * @param {any} key
     */
    delete(key){
        // TODO: Get paths to this category within each vendor and delete
        // Possible Todo: Delete all subcategories under this category (use subcategory service to do that)
        let response = this._db.object('/').update({
            [`/categories/${key}`]: null,
            [`/categoriesWithVendors/${key}`]: null
        });
    }

    /**
     * Return array of nodes where this category exists
     */
    private _getNodesWhereCategoryExists(key){
        // 1) Get list of all vendors under this category 
        // let vendors = this._db.list(`/categoriesWithVendors/${key}/`);
        // 2) return node links to this category within each /vendor node.
    }
}
