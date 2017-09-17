import { Component, Input, forwardRef, Renderer, ElementRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Platform, AlertController, ActionSheetController } from 'ionic-angular';
import { File as NativeFile, Entry, FileEntry }  from '@ionic-native/file';

import { AuthService } from '../../providers/auth.service';
import { CameraService } from '../../providers/camera.service';

import * as firebase from 'firebase';

/*
  Firebase Image Upload Component 
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

  // Bucket where to upload
  @Input() bucketUrl: string = "";

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
    private _nativeFile: NativeFile
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
   * @param  {any} nativeFilePath
   */
  uploadFileViaNativeFilePath(nativeFilePath){
    this.isUploading = true;
    this._attemptNativeFileUpload(nativeFilePath)
      .then((downloadUrl: string) => {
        this.isUploading = false;
        this.value = downloadUrl;
      })
      .catch((err) => {
        this.isUploading = false;
        alert(err);
      });
  }

  /**
   * Attempt native file upload
   * @param nativeFilePath 
   */
  private _attemptNativeFileUpload(nativeFilePath){
    return new Promise((resolve, reject) => {
      // Resolve File Path on System 
      this._nativeFile.resolveLocalFilesystemUrl(nativeFilePath).then((entry: Entry) => {
        // Convert entry into File Entry which can output a JS File object
        let fileEntry =  entry as FileEntry;

        // Return a File object that represents the current state of the file that this FileEntry represents
        fileEntry.file((file: any) => {

            // Store File Details for later use
            let fileName = file.name;
            let fileType = file.type;
            let fileLastModified = file.lastModifiedDate;

            // Read File as Array Buffer, Convert to Blob, then to JS File
            var reader = new FileReader();
            reader.onloadend = (event: any) => {
                var blob = new Blob([new Uint8Array(event.target.result)], { type: fileType });
                var file: any = blob;
                file.name = fileName;
                file.lastModifiedDate = fileLastModified;

                // Upload file to Firebase Storage
                let storageRef = firebase.storage().ref();
                let uploadRef = storageRef.child(`${this.bucketUrl}/${file.name}`);
                uploadRef.put(file).then((snapshot) => {
                  if(snapshot.state == "success"){
                    resolve(snapshot.downloadURL);
                  }
                });
            };
            reader.readAsArrayBuffer(file);

        }, (error) => {
            reject("Unable to retrieve file properties: " + JSON.stringify(error));
        });
      }).catch(err => { 
          reject("Error resolving file " + JSON.stringify(err));
      });
    });
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
