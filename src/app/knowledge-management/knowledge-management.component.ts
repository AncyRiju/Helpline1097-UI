/* Functionality of the Components
 * Upload a document or file to Open KM
 * Parameter is one Object
 * File/Document Content in Base 64 Format
 ** Created by :Pankush Manchanda 31 ,July 2017 **
 ** Copy Write Wipro technologies **
*/

// modules or custom components
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MdSelectModule } from '@angular/material';

// services
import { CoCategoryService } from '../services/coService/co_category_subcategory.service';
import { dataService } from '../services/dataService/data.service';
import { UploadServiceService } from '../services/upload-services/upload-service.service';

@Component({
  selector: 'app-knowledge-management',
  templateUrl: './knowledge-management.component.html',
  styleUrls: ['./knowledge-management.component.css']
})
export class KnowledgeManagementComponent implements OnInit {
  // declaring object
  public categories: any = [];
  public subCategories: any = [];
  public file: File;
  knowledgeForm: FormGroup;

  // declaring variables
  public categoryID;
  public subCategoryID;
  public fileContent;
  public providerServiceMapID;
  public userID;
  public fileName;
  public fileExtension;
  public createdBy;

  constructor(private fb: FormBuilder, private _coCategoryService: CoCategoryService,
    private _dataService: dataService, private _uploadService: UploadServiceService) {
    this.createForm();
  }

  // Create form intialization and object in ngOnInit
  ngOnInit() {
    this.getCategory();
    this.providerServiceMapID = this._dataService.current_service.serviceID;
    this.userID = this._dataService.uid;
    this.createdBy = this._dataService.uname;
  }

  // form creation using reactive form form builder
  createForm() {
    this.knowledgeForm = this.fb.group({
      category: ['', Validators.required], // <--- the FormControl called "name"
      subCategory: ['', Validators.required],
      fileInput: ['', Validators.required]
    });
  }

  // getting list of category
  getCategory() {
    this._coCategoryService.getCategories()
      .subscribe((response) => {
        this.categories = response;
      }, (err) => {
        console.log('Error in Knowledge Managemant Catyegory');
        // error catch here
      });
  }
  // getting list of subcategory by categoryId
  getSubCategory(categoryID: any) {
    this._coCategoryService.getSubCategories(categoryID)
      .subscribe((response) => {
        this.subCategories = response;
      }, (err) => {
        console.log('Error in Knowledge Managemant Catyegory');
        // error catch here
      });
  }
  // submit event to submit the form
  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    debugger;
    const documentUploadObj = {};
    const documentUploadArray = [];
    if (valid) {
      documentUploadObj['fileName'] = value.fileInput;
      documentUploadObj['fileExtension'] = '.' + value.fileInput.split('.')[1];
      documentUploadObj['providerServiceMapID'] = this.providerServiceMapID;
      documentUploadObj['userID'] = this.userID;
      documentUploadObj['fileContent'] = this.fileContent.split(',')[1];
      documentUploadObj['createdBy'] = this.createdBy;
      documentUploadObj['categoryID'] = value.category;
      documentUploadObj['subCategoryID'] = value.subCategory;
      documentUploadArray.push(documentUploadObj);
      this.uploadFile(documentUploadArray);
    }
  }
  // file change event
  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): any {
    this.file = inputValue.files[0];
    if (this.file) {
      this.knowledgeForm.controls['fileInput'].setValue(this.file.name);
      const myReader: FileReader = new FileReader();
      // binding event to access the local variable
      myReader.onloadend = this.onLoadFileCallback.bind(this)
      myReader.readAsDataURL(this.file);
    } else {
      this.knowledgeForm.controls['fileInput'].setValue('');
    }

  }
  onLoadFileCallback = (event) => {
    this.fileContent = event.currentTarget.result;

  }

  // Calling service Method to call the services
  uploadFile(uploadObj: any) {
    this._uploadService.uploadDocument(uploadObj).subscribe((response) => {
    }, (err) => {

    })
  }

}
