import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import * as firebase from 'firebase';

// Services
import { CategoryService } from '../../../providers/category.service'

// Forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-category-form',
  templateUrl: 'category-form.html'
})
export class CategoryFormPage {

  public pageTitle;

  public form: FormGroup;
  public updateCategory;

  // All files associated with this category since the dawn of time
  // A category can only have one file. so we will delete all other files on save or leaving the view.
  private _filesAssociated = [];
  private _finalFileToKeep = ""; // the unique file belonging to this category

  constructor(
    public navCtrl: NavController, 
    private _viewCtrl: ViewController,
    private _fb: FormBuilder,
    private _categoryService: CategoryService,
    params: NavParams
  ) {
    this.updateCategory = params.get("updateCategory");
    this._finalFileToKeep = this.updateCategory && this.updateCategory.backgroundImage ? this.updateCategory.backgroundImage : "";
    if(this._finalFileToKeep) this._filesAssociated.push(this._finalFileToKeep);
    
    this.pageTitle = this.updateCategory ? "Update Category" : "Create Category";

    this.form = this._fb.group({
      categoryTitleEn: [this.updateCategory?this.updateCategory.categoryTitleEn:"", Validators.required],
      categoryTitleAr: [this.updateCategory?this.updateCategory.categoryTitleAr:"", Validators.required],
      backgroundImage: [this.updateCategory?this.updateCategory.backgroundImage:""]
    });

    // Push to associated files array for later deletion if not saved.
    this.form.controls.backgroundImage.valueChanges.subscribe((data) => {
      this._filesAssociated.push(data);
    });
  }

  ionViewWillLeave(){
    // Delete all dangling files
    this.deleteAssociatedDanglingFiles();
  }

  /**
   * Save a new record
   */
  save(){
    // Store file to keep to avoid the dangling file deletion.
    this._finalFileToKeep = this.form.controls.backgroundImage.value;

    // Process Save
    if(!this.updateCategory){
      this._categoryService.create(this.form.value).then(() => this.closePage());
    }else{
      this._categoryService.update(this.updateCategory.$key, this.form.value).then(() => this.closePage());
    }
  }

  /**
   * Deletes remaining files that this category no longer needs.
   */
  deleteAssociatedDanglingFiles(){
    this._filesAssociated.forEach(fileUrl => {
      if(fileUrl != this._finalFileToKeep){
        firebase.storage().refFromURL(fileUrl).delete();
      }
    });
  }

  /**
   * Close the page
   */
  closePage(){
    this._viewCtrl.dismiss();
  }

}
