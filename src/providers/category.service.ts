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
     * @param {any} data
     */
    delete(key){
        // TODO: Get paths to this category within each vendor and delete
        // Possible Todo: Delete all subcategories under this category (use subcategory service to do that?)
        // Possible Todo: Disable deletion of category if it has vendors under it which have no other category?
        let response = this._db.object('/').update({
            [`/categories/${key}`]: null,
            [`/categoriesWithVendors/${key}`]: null
        });
    }

    /**
     * Return array of nodes where this vendor exists
     */
    private _getNodesWhereCategoryExists(){

    }
}
