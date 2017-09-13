import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';

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
        return this._db.object('/').update({
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
        let vendorNodes = this._getVendorNodesWhereCategoryExists(key);

        // Loop through the object to create specific nodes to update data 
        // Multi-level updates are treated as "set" which is desctructive if path is not specific.
        var updateData = {};
        for (var objKey in data) {
            updateData[`/categories/${key}/${objKey}`] = data[objKey];
            updateData[`/categoriesWithVendors/${key}/${objKey}`] = data[objKey];

            // Update within /vendors node
            vendorNodes.forEach(vendor => {
                updateData[`/vendors/${vendor.$key}/categories/${key}/${objKey}`] = data[objKey];
            });
        }

        return this._db.object('/').update(updateData);
    }

    /**
     * Delete across all nodes where it exists
     * @param {any} key
     */
    delete(key){
        // Important
        // Todo: First Delete all subcategories under this category (use subcategory service to do that)
        

        let vendorNodes = this._getVendorNodesWhereCategoryExists(key);

        var deleteData = {
            [`/categories/${key}`]: null,
            [`/categoriesWithVendors/${key}`]: null
        };

        // Update within /vendors node
        vendorNodes.forEach(vendor => {
            deleteData[`/vendors/${vendor.$key}/categories/${key}`] = null;
        });

        return this._db.object('/').update({
            [`/categories/${key}`]: null,
            [`/categoriesWithVendors/${key}`]: null
        });
    }

    /**
     * Return array of nodes where this Category exists within vendor
     */
    private _getVendorNodesWhereCategoryExists(key){
        let nodes = [];
        this._db.list(`/categoriesWithVendors/${key}/vendors`).take(1).subscribe(vendors => {
            nodes = vendors;
        });
        return nodes;
    }
}
