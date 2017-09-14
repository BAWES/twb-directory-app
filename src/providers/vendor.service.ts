import { Injectable } from '@angular/core';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { CategoryService } from './category.service';

/*
  Handles all Vendor functions
*/
@Injectable()
export class VendorService {

  constructor(
    private _db: AngularFireDatabase,
    private _categoryService: CategoryService
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
         * Create Vendor Record
         */
        this._db.object('/').update({
            [`/vendors/${key}`]: data,
        });

        // Get Vendor Record and assign to category
        this._db.object(`/vendors/${key}`).take(1).subscribe(vendor => {
            this._categoryService.addVendorToCategory(vendor, category);
        });
    }

    /**
     * Update across all nodes where it exists
     * @param {any} key
     * @param {any} data
     */
    update(key, data){
        Promise.all([this._getCategoryNodesWhereVendorExists(key), this._getSubcategoryNodesWhereVendorExists(key)]).then(output => {
            let categories = output[0];
            let subcategories = output[1];

            // Loop through the object to create specific nodes to update data 
            // Multi-level updates are treated as "set" which is desctructive if path is not specific.
            var updateData = {};
            for (var objKey in data) {
                // update in /vendors
                updateData[`/vendors/${key}/${objKey}`] = data[objKey];

                // update in categories where it exists in /categoriesWithVendors/${categoryKey}/vendors
                categories.forEach(category => {
                    updateData[`/categoriesWithVendors/${category.$key}/vendors/${key}/${objKey}`] = data[objKey];
                });
                // update in subcategories where it exists /subcategories/${subcategoryKey}/vendors list
                subcategories.forEach(subcategory => {
                    updateData[`/subcategories/${subcategory.$key}/vendors/${key}/${objKey}`] = data[objKey];
                });
            }

            return this._db.object('/').update(updateData);
        });
    }

    /**
     * Delete across all nodes where it exists
     * @param {any} key
     * @param {any} data
     */
    delete(key){
        Promise.all([this._getCategoryNodesWhereVendorExists(key), this._getSubcategoryNodesWhereVendorExists(key)]).then(output => {
            let categories = output[0];
            let subcategories = output[1];

            var deleteData = {};
            // delete in /vendors
            deleteData[`/vendors/${key}`] = null;

            // delete in categories where it exists in /categoriesWithVendors/${categoryKey}/vendors
            categories.forEach(category => {
                deleteData[`/categoriesWithVendors/${category.$key}/vendors/${key}`] = null;
            });
            // delete in subcategories where it exists /subcategories/${subcategoryKey}/vendors list
            subcategories.forEach(subcategory => {
                deleteData[`/subcategories/${subcategory.$key}/vendors/${key}`] = null;
            });
            

            return this._db.object('/').update(deleteData);
        });
    }

    /**
     * Return array of nodes where this vendor exists in categories
     * @param {any} key vendor key
     */
    private _getCategoryNodesWhereVendorExists(key): Promise<any>{
        return new Promise((resolve, reject) => {
            this._db.list(`/vendors/${key}/categories`).take(1).subscribe(categories => {
                resolve(categories);
            });
        });
    }

    /**
     * Return array of nodes where this vendor exists in subcategories
     * @param {any} key vendor key
     */
    private _getSubcategoryNodesWhereVendorExists(key): Promise<any>{
        return new Promise((resolve, reject) => {
            this._db.list(`/vendors/${key}/subcategories`).take(1).subscribe(subcategories => {
                resolve(subcategories);
            });
        });
    }
}
