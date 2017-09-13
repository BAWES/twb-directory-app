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
        return this._db.object('/').update({
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

        // Loop through the object to create specific nodes to update data 
        // Multi-level updates are treated as "set" which is desctructive if path is not specific.
        var updateData = {};
        for (var objKey in data) {
            updateData[`/subcategories/${key}/${objKey}`] = data[objKey];
            updateData[`/categoriesWithVendors/${parentCategoryKey}/subcategories/${key}/${objKey}`] = data[objKey];
        }

        return this._db.object('/').update(updateData);
    }

    /**
     * Delete across all nodes where it exists
     * @param {any} key
     * @param {any} parentCategoryKey
     */
    delete(key, parentCategoryKey){
        // TODO: Get paths to this subcategory within each vendor and delete
        return this._db.object('/').update({
            [`/subcategories/${key}`]: null,
            [`/categoriesWithVendors/${parentCategoryKey}/subcategories/${key}`]: null
        });
    }

    /**
     * Add specified vendor within subcategory 
     * Also create record of subcategory within that vendor.
     * @param {any} vendor
     * @param {any} subcategory
     */
    addVendor(vendor, subcategory){
        return this._db.object('/').update({
            [`/subcategories/${subcategory.$key}/vendors/${vendor.$key}`]: vendor,
            [`/vendors/${vendor.$key}/subcategories/${subcategory.$key}`]: subcategory
        });
    }

    /**
     * Remove specified vendor from subcategory 
     * Also remove record of subcategory within that vendor.
     * @param {any} vendor
     * @param {any} subcategory
     */
    removeVendor(vendor, subcategory){
        return this._db.object('/').update({
            [`/subcategories/${subcategory.$key}/vendors/${vendor.$key}`]: null,
            [`/vendors/${vendor.$key}/subcategories/${subcategory.$key}`]: null
        });
    }

    /**
     * Return array of nodes where this subcategory exists
     */
    private _getNodesWhereSubcategoryExists(){

    }
}
