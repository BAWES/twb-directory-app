import { Component, Input, forwardRef, Renderer, ElementRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Platform, AlertController, ActionSheetController } from 'ionic-angular';

import { AuthService } from '../../providers/auth.service';
import { CameraService } from '../../providers/camera.service';

import * as firebase from 'firebase';

/*
  AWS S3 Image Upload Component 
  Uploads file then emits event with its details
*/
@Component({
  selector: 'image-upload',
  templateUrl: 'image-upload.html',
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploadComponent),
      multi: true
    }
  ]
})
export class ImageUploadComponent implements ControlValueAccessor {
  // File input used for browser fallback when no cordova is available
  @ViewChild('fileInput') fileInput:ElementRef;

  // Default value the form element should have 
  // (In case an image has already been uploaded for it)
  _value: string;

  // Icon to use, by default its a regular image icon
  @Input() label: string = "Photo";
  // Icon to use, by default its a regular image icon
  @Input() icon: string = "image";
  // File prefix when uploading to S3
  @Input() prefix: string = "image";

  // Bucket where to upload
  public bucketUrl: string;

  // Progress variables
  public isUploading = false;

  // the method set in registerOnChange, it is just 
  // a placeholder for a method that takes one parameter, 
  // we use it to emit changes back to the form
  private _propagateChange = (_: any) => {};

  constructor(
    private _platform: Platform,
    private _renderer:Renderer,
    private _auth: AuthService,
    private _cameraService: CameraService,
    private _actionSheetCtrl: ActionSheetController,
    private _alertCtrl: AlertController
    ) {
      // By Default, use the permanent bucket url
      this.bucketUrl = `/uploads/${this._auth.uid}`;
  }

  /**
   * Upload Photo button clicked
   * - On Native device, load native camera/gallery
   * - On Browser, trigger a click on the html file input
   */
  uploadBtnClicked(){
    // If already uploading, do nothing, just return
    if(this.isUploading) return;

    if(this._platform.is("cordova")){
      // Display action sheet giving user option of camera vs local filesystem.
      let actionSheet = this._actionSheetCtrl.create({
        title: "Select image source",
        buttons: [
          {
            text: 'Load from Library',
            handler: () => {
              this._cameraService.getImageFromLibrary().then((nativeImageFilePath) => {
                  // Upload and process for progress
                  this.uploadFileViaNativeFilePath(nativeImageFilePath);
              }, (err) => {
                  // Error getting picture
                  // alert("Error getting picture from Library: " + JSON.stringify(err));
                  console.log("Error getting picture from Library: " + JSON.stringify(err));
              });;
            }
          },
          {
            text: 'Use Camera',
            handler: () => {
              this._cameraService.getImageFromCamera().then((nativeImageFilePath) => {
                  // Upload and process for progress
                  this.uploadFileViaNativeFilePath(nativeImageFilePath);
              }, (err) => {
                  // Error getting picture
                  // alert("Error getting picture from Camera: " + JSON.stringify(err));
                  console.log("Error getting picture from Camera: " + JSON.stringify(err));
              });;
            }
          }
        ]
      });
      actionSheet.present();

    }else{
      // Trigger click event on regular HTML file input
      let event = new MouseEvent('click', {bubbles: true});
      this._renderer.invokeElementMethod(this.fileInput.nativeElement, 'dispatchEvent', [event]);
    }
  }


  /**
   * Upload the selected file through regular HTML file input 
   * This method will only be called if the target is not a cordova app.
   * @param  {any} $event
   */
  uploadFileViaHtmlFileInput($event){
    let fileList: FileList = $event.target.files;

    // Check if files available
    if(fileList.length > 0){
      let file = fileList.item(0);

      this.isUploading = true;

      let storageRef = firebase.storage().ref();
      let uploadRef = storageRef.child(`${this.bucketUrl}/${file.name}`);
      uploadRef.put(file).then((snapshot) => {
        if(snapshot.state == "success"){
          this.value = snapshot.downloadURL;
          this.isUploading = false;
        }
      });
    }
  }

  /**
   * Upload the selected file through regular HTML file input 
   * This method will only be called if the target is not a cordova app.
   * @param  {any} path
   */
  uploadFileViaNativeFilePath(path){
    // Upload and process for progress
    // this._awsService.uploadNativePath(this.prefix, path)
    //   .then((uploadObservable) => {
    //     this.processFileUpload(uploadObservable);
    //   })
    //   .catch((err) => {
    //     alert(err);
    //   });
  }

  /**
   * Getter for Value
   */
  get value() {
    return this._value;
  }
  /**
   * Setter for Value
   */
  set value(val) {
    this._value = val;
    // Notify of changes
    this._propagateChange(this._value);
  }

  /**
   * ControlValueAccessor interface methods
   * - They allow this component to be used as a form element (with validation and ngModel)
   */

  /**
   * Called on form Init / Update
   * @param {*} obj
   */
  writeValue(obj: any) {
    if (obj) {
      this.value = obj;
    }
  }

  /**
   * Propogate change on change, notify outside world of changes
   * @param {any} fn
   */
  registerOnChange(fn) {
    this._propagateChange = fn;
  }

  /**
   * Called on touch/ element blur
   */
  registerOnTouched() {}

    
}
