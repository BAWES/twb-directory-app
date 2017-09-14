import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';

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
        this._getVendorNodesWhereSubcategoryExists(key).then(vendorNodes => {
            // Loop through the object to create specific nodes to update data 
            // Multi-level updates are treated as "set" which is desctructive if path is not specific.
            var updateData = {};
            for (var objKey in data) {
                updateData[`/subcategories/${key}/${objKey}`] = data[objKey];
                updateData[`/categoriesWithVendors/${parentCategoryKey}/subcategories/${key}/${objKey}`] = data[objKey];

                // Update within /vendors node
                vendorNodes.forEach(vendor => {
                    updateData[`/vendors/${vendor.$key}/subcategories/${key}/${objKey}`] = data[objKey];
                });
            }

            return this._db.object('/').update(updateData);
        });
    }

    /**
     * Delete across all nodes where it exists
     * @param {any} key
     * @param {any} parentCategoryKey
     */
    delete(key, parentCategoryKey){
        this._getVendorNodesWhereSubcategoryExists(key).then(vendorNodes => {
            var deleteData = {
                [`/subcategories/${key}`]: null,
                [`/categoriesWithVendors/${parentCategoryKey}/subcategories/${key}`]: null
            };

            // Update within /vendors node
            vendorNodes.forEach(vendor => {
                deleteData[`/vendors/${vendor.$key}/subcategories/${key}`] = null;
            });

            return this._db.object('/').update(deleteData);
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
    private _getVendorNodesWhereSubcategoryExists(key): Promise<any>{
        return new Promise((resolve, reject) => {
            this._db.list(`/subcategories/${key}/vendors`).take(1).subscribe(vendors => {
                resolve(vendors);
            });
        });
    }
}
