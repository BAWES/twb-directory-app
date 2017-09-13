import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';

import { SubcategoryService } from './subcategory.service';

/*
  Handles all Category functions
*/
@Injectable()
export class CategoryService {

  constructor(
    private _db: AngularFireDatabase,
    private _subcategoryService: SubcategoryService
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
        this._getVendorNodesWhereCategoryExists(key).then(vendorNodes => {
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
        });
    }

    /**
     * Delete across all nodes where it exists
     * @param {any} key
     */
    delete(key){
        this._getVendorNodesWhereCategoryExists(key).then(vendorNodes => {
            // Delete all subcategories under this category
            this._db.list(`/categoriesWithVendors/${key}/subcategories`).take(1).subscribe(subcategories => {
                subcategories.forEach(subcategory => {
                    console.log(subcategory);
                    this._subcategoryService.delete(subcategory.$key, key);
                });
            });

            // Main Data
            var deleteData = {
                [`/categories/${key}`]: null,
                [`/categoriesWithVendors/${key}`]: null
            };

            // Update within /vendors node
            vendorNodes.forEach(vendor => {
                deleteData[`/vendors/${vendor.$key}/categories/${key}`] = null;
            });

            return this._db.object('/').update(deleteData);
        });
    }

    /**
     * Return array of nodes where this Category exists within vendor
     */
    private _getVendorNodesWhereCategoryExists(key): Promise<any>{
        return new Promise((resolve, reject) => {
            this._db.list(`/categoriesWithVendors/${key}/vendors`).take(1).subscribe(vendors => {
                resolve(vendors);
            });
        });
    }
}
