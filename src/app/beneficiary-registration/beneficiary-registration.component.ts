import { Component, OnInit, EventEmitter, Input, Output, ViewChild, ElementRef, Renderer } from '@angular/core';
import { RegisterService } from '../services/register-services/register-service';
import { UpdateService } from '../services/update-services/update-service';
import { Router } from '@angular/router';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service'
import { LocationService } from '../services/common/location.service';
import { dataService } from '../services/dataService/data.service';
import { BeneficiaryHistoryComponent } from './../beneficiary-history/beneficiary-history.component'
import { MdDialog, MdDialogRef } from '@angular/material';
import { Message } from './../services/common/message.service'

@Component({
  selector: 'app-beneficiary-registration',
  templateUrl: './beneficiary-registration.component.html',
  styleUrls: ['./beneficiary-registration.component.css'],

})
export class BeneficiaryRegistrationComponent implements OnInit {
  @Output() onBenRegDataSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() onBenSelect: EventEmitter<any> = new EventEmitter<any>(); 1
  @ViewChild('ageRef') input: ElementRef;
  FirstName: any = '';
  LastName: any = '';
  DOB: any;
  PhoneNo = '';
  GenderID: any = '';
  TitleId: number;
  MaritalStatusID: number;
  aadharNo: any = '';
  caste: any = '';
  BeneficiaryTypeID: number;
  educationQualification: any = '';
  state: number;
  district: number;
  taluk: number;
  village: number;
  pincode: any = '';
  preferredLanguage: number;
  ParentBenRegID: number;
  relationShips: any;
  benRegistrationResponse: any;
  registrationNo: any = '';
  benUpdationResponse: any;
  regHistoryList: any = [];
  beneficiaryParentList: any[];
  beneficiaryRelations: any[];
  states: any = [];
  titles: any = [];
  status: any = [];
  benEdus: any = [];
  genders: any = [];
  maritalStatuses: any = [];
  districts: any = [];
  taluks: any = [];
  blocks: any = [];
  communities: any = [];
  directory: any = [];
  language: any = [];
  regHistory: any;
  benRegData: any;
  // states: directory = [];
  calledEarlier = false;
  showSearchResult = false;
  notCalledEarlier;
  updationProcess = false;
  notCalledEarlierLowerPart = false;
  minDate: Date;
  maxDate: Date;
  isParentBeneficiary = false;
  beneficiaryRelationID;
  color;
  calledRadio = true;
  age: number;
  updatedObj: any = {};
  relationshipWith: string;
  today: Date;
  dateFormat: string;


  constructor(private _util: RegisterService, private _router: Router,
    private _userBeneficiaryData: UserBeneficiaryData, private _locationService: LocationService,
    private updateBen: UpdateService, private saved_data: dataService, private renderer: Renderer,
    private message: Message, public dialog: MdDialog) { }

  /* Intialization Of value and object has to be written in here */
  ngOnInit() {
    this.today = new Date();
    this.maxDate = this.today;
    this._userBeneficiaryData.getUserBeneficaryData()
      .subscribe(response => this.SetUserBeneficiaryRegistrationData(response));
    this.startNewCall();
    this.calledEarlier = true;
  }

  reloadCall() {

    this.retrieveRegHistoryByPhoneNo(this.saved_data.callerNumber);
    this.calledEarlier = true;
    this.showSearchResult = false;
    this.notCalledEarlier = false;
    this.updationProcess = false;
    this.notCalledEarlierLowerPart = false;
    this.calledRadio = true;
    this.onBenRegDataSelect.emit(null);
  }

  @Input()
  startNewCall() {
    this.reloadCall();
    this.startCall();
  }
  startCall() {

    const data: any = {};
    data.callID = this.saved_data.callID;
    data.is1097 = true;
    data.createdBy = this.saved_data.uname;
    data.calledServiceID = this.saved_data.current_service.serviceID;
    this._util.startCall(data).subscribe(response => this.setBenCall(response));
  }

  setBenCall(response) {
    this.saved_data.callData = response;
  }

  SetUserBeneficiaryRegistrationData(response: any) {

    const regData = response;
    if (regData.states) {
      this.states = regData.states;
    }
    if (regData.m_Status) {
      this.status = regData.m_Status;
    }
    if (regData.directory) {
      this.directory = regData.directory;
    }

    if (regData.i_BeneficiaryEducation) {
      this.benEdus = regData.i_BeneficiaryEducation;
    }
    if (regData.m_Title) {
      this.titles = regData.m_Title;
    }
    if (regData.m_genders) {
      this.genders = regData.m_genders;
    }
    if (regData.m_maritalStatuses) {
      this.maritalStatuses = regData.m_maritalStatuses;
    }
    if (regData.m_communities) {
      this.communities = regData.m_communities;
    }
    if (regData.m_language) {
      this.language = regData.m_language;
    }
    if (regData.benRelationshipTypes) {
      this.beneficiaryRelations = regData.benRelationshipTypes;
      this.getRelationShipType(this.beneficiaryRelations);
    }

  }

  calledEarlierCheck(flag) {

    if (flag.checked) {
      this.calledEarlier = true;
      // this.showSearchResult = true;
      this.notCalledEarlier = false;
      this.updationProcess = false;
      this.notCalledEarlierLowerPart = false;
      this.calledRadio = true;
      // If condition added for preveting extra api call on radio click.
      if (this.regHistoryList.length > 0) {
        this.onBenRegDataSelect.emit(null);
      }
    }

    if (!flag.checked) {
      this.isParentBeneficiary = false;
      this.notCalledEarlier = true;
      this.notCalledEarlierLowerPart = false;
      this.calledRadio = true;
      this.onBenRegDataSelect.emit(null);
      this.calledEarlier = false;
      this.showSearchResult = false;
      this.updationProcess = false;
      this.FirstName = undefined;
      this.LastName = undefined;
      this.PhoneNo = undefined;
      this.GenderID = undefined;
      this.age = undefined;
      this.TitleId = undefined;
      this.MaritalStatusID = undefined;
      this.DOB = undefined;
      this.aadharNo = undefined;
      this.caste = undefined;
      this.BeneficiaryTypeID = undefined;
      this.educationQualification = undefined;
      this.state = undefined;
      this.district = undefined;
      this.districts = [];
      this.taluk = undefined;
      this.taluks = [];
      this.village = undefined;
      this.blocks = [];
      this.pincode = undefined;
      this.preferredLanguage = undefined;
      // if ()
      // this.beneficiaryRelationID = this.getRelationShipType(this.beneficiaryRelations);
      // this value also comes from the constants

    }
  }

  GetDistricts(state: number) {
    this.districts = [];

    this.taluks = [];

    this.blocks = [];

    this._locationService.getDistricts(state)
      .subscribe(response => this.SetDistricts(response));
  }
  SetDistricts(response: any) {
    // this.districts.push( { "districtID": undefined, "districtName": "" } );
    // for ( let i = 0; i < response.length; i++ )
    // this.districts.push( response[ i ] );
    this.districts = response;
  }
  GetTaluks(district: number) {
    this.taluks = [];
    this.blocks = [];
    this._locationService.getTaluks(district)
      .subscribe(response => this.SetTaluks(response));
  }
  SetTaluks(response: any) {
    this.taluks = response;
    // this.taluks.push( { "blockID": undefined, "blockName": "" } );
    // for ( let i = 0; i < response.length; i++ )
    // 	this.taluks.push( response[ i ] );
  }
  GetBlocks(taluk: number) {
    this.blocks = [];
    this._locationService.getBranches(taluk)
      .subscribe(response => this.SetBlocks(response));
  }
  SetBlocks(response: any) {
    this.blocks = response;
    // this.blocks.push( { "districtBranchID": undefined, "villageName": "" } );
    // for ( let i = 0; i < response.length; i++ )
    // 	this.blocks.push( response[ i ] );
  }

	/**
		* Neeraj Code; 22-jun-2017
		*/
  capturePrimaryInfo() {
    this.notCalledEarlierLowerPart = false;
    this.notCalledEarlier = true;
    this.calledRadio = true;
  }

  captureOtherInfo() {
    this.notCalledEarlierLowerPart = true;
    this.notCalledEarlier = false;
    this.calledRadio = false;
  }

  editBenPrimaryContent() {
    this.notCalledEarlierLowerPart = false;
    this.notCalledEarlier = true;
    this.calledRadio = true;
  }
	/**
	 *End of Neeraj Code; 22-jun-2017
	 */

  registerBeneficiary() {
    this.updatedObj = {};
    this.updatedObj.firstName = this.FirstName;
    this.updatedObj.lastName = this.LastName;
    this.updatedObj.genderID = this.GenderID;
    if (this.DOB) {
      this.updatedObj.dOB = new Date((this.DOB) - 1 * (this.DOB.getTimezoneOffset() * 60 * 1000)).toJSON();
    } else {
      this.updatedObj.dOB = undefined;
    }
    this.updatedObj.titleId = this.TitleId;
    this.updatedObj.maritalStatusID = this.MaritalStatusID;
    this.updatedObj.benPhoneMaps = [];
    this.updatedObj.benPhoneMaps[0] = {};
    this.updatedObj.benPhoneMaps[0].parentBenRegID = this.ParentBenRegID;
    this.updatedObj.benPhoneMaps[0].benRelationshipID = this.beneficiaryRelationID;
    this.updatedObj.benPhoneMaps[0].phoneNo = this.saved_data.callerNumber;
    this.updatedObj.benPhoneMaps[0].createdBy = this.saved_data.uname;
    this.updatedObj.benPhoneMaps[0].deleted = false;
    if (this.PhoneNo) {
      this.updatedObj.benPhoneMaps[1] = {};
      this.updatedObj.benPhoneMaps[1].parentBenRegID = this.ParentBenRegID;
      this.updatedObj.benPhoneMaps[1].benRelationshipID = this.beneficiaryRelationID;
      this.updatedObj.benPhoneMaps[1].phoneNo = this.PhoneNo;
      this.updatedObj.benPhoneMaps[1].createdBy = this.saved_data.uname;
      this.updatedObj.benPhoneMaps[1].deleted = false;
    }
    this.updatedObj.govtIdentityNo = this.aadharNo;
    this.updatedObj.deleted = false;
    this.updatedObj.createdBy = this.saved_data.Userdata.userName;
    this.updatedObj.govtIdentityTypeID = 1;
    this.updatedObj.statusID = 1;
    this.updatedObj.i_bendemographics = {};
    this.updatedObj.i_bendemographics.communityID = this.caste;
    this.updatedObj.i_bendemographics.educationID = this.educationQualification;
    this.updatedObj.i_bendemographics.stateID = this.state;
    this.updatedObj.i_bendemographics.districtID = this.district;
    this.updatedObj.i_bendemographics.blockID = this.taluk;
    this.updatedObj.i_bendemographics.districtBranchID = this.village;
    this.updatedObj.i_bendemographics.pinCode = this.pincode;
    this.updatedObj.i_bendemographics.deleted = false;
    this.updatedObj.i_bendemographics.preferredLangID = this.preferredLanguage;

    const res = this._util.generateReg(this.updatedObj).subscribe(response => {
      this.benRegistrationResponse = response;
      this.handleRegHistorySuccess([response]);
      this.showAlert();
    });
  }

  showAlert() {
    this.message.openSnackBar('Registration Successful!!!! Beneficiary ID is :' + this.benRegistrationResponse.beneficiaryRegID);
  }

  retrieveRegHistoryByPhoneNo(PhoneNo: any) {
    const res = this._util.retrieveRegHistoryByPhoneNo(PhoneNo)
      .subscribe(response => this.handleRegHistorySuccess(response));

  }


  retrieveRegHistory(reg_no: any) {
    const res = this._util.retrieveRegHistory(reg_no)
      .subscribe(response => this.handleRegHistorySuccess(response));

  }

  handleRegHistorySuccess(response: any) {
    this.regHistoryList = response;
    if (this.regHistoryList.length > 0) {
      this.showSearchResult = true;
      this.notCalledEarlier = false;
      this.updationProcess = false;
      this.notCalledEarlierLowerPart = false;
      this.calledRadio = true;
      this.saved_data.parentBeneficiaryData = this.regHistoryList[0];
      this.relationshipWith = 'Relationship with ' + this.regHistoryList[0].firstName + ' ' + this.regHistoryList[0].lastName;
      if (this.regHistoryList[0].benPhoneMaps[0].parentBenRegID !== this.regHistoryList[0].benPhoneMaps[0].benificiaryRegID) {
        this.getParentData(this.regHistoryList[0].benPhoneMaps[0].parentBenRegID)

      }

    }
  }

  handleSuccess(response: any) {
    this.relationShips = response;
  }

  // setting the data of selected beneficiary on the top section as BEN. Data for
  // the agent to see
  passBenRegHistoryData(benRegData: any) {
    this.notCalledEarlier = true;
    this.calledEarlier = false;
    this.showSearchResult = false;
    this.updationProcess = true;
    this.isParentBeneficiary = true;
    this.populateUserData(benRegData);
  }

  updatebeneficiaryincall(benRegData: any) {
    this.saved_data.callData.beneficiaryRegID = benRegData.beneficiaryRegID;
    this._util.updatebeneficiaryincall(this.saved_data.callData).subscribe();
  }

  populateUserData(benRegData: any) {
    this.updatebeneficiaryincall(benRegData);
    const res = this._util.retrieveRegHistory(benRegData.beneficiaryRegID)
      .subscribe(response => {
        this.populateRegistrationFormForUpdate(response[0])
      });

    this.benRegData = benRegData;
  }

  populateRegistrationFormForUpdate(registeredBenData) {
    console.log('registered ben data is :', registeredBenData)
    this.FirstName = registeredBenData.firstName;
    this.LastName = registeredBenData.lastName;
    this.GenderID = registeredBenData.genderID;
    this.DOB = new Date(registeredBenData.dOB);
    this.TitleId = registeredBenData.titleId;
    this.MaritalStatusID = registeredBenData.maritalStatusID;
    if (registeredBenData.benPhoneMaps[0]) {
      this.ParentBenRegID = registeredBenData.benPhoneMaps[0].parentBenRegID;
    }
    if (registeredBenData.benPhoneMaps[1]) {
      this.PhoneNo = registeredBenData.benPhoneMaps[1].phoneNo;
    }
    this.aadharNo = registeredBenData.govtIdentityNo;
    this.caste = registeredBenData.i_bendemographics.communityID;
    this.educationQualification = registeredBenData.i_bendemographics.educationID;
    this.state = registeredBenData.i_bendemographics.stateID;
    this.district = registeredBenData.i_bendemographics.districtID;
    this.districts = registeredBenData.i_bendemographics.m_district;
    this.taluk = registeredBenData.i_bendemographics.blockID;

    this.taluks = registeredBenData.i_bendemographics.m_districtblock;
    this.village = registeredBenData.i_bendemographics.districtBranchID;
    this.blocks = registeredBenData.i_bendemographics.m_districtbranchmapping;
    this.age = registeredBenData.age;
    // Checking whether it has parent or not
    if (registeredBenData.benPhoneMaps[0].benRelationshipType.benRelationshipID === 1) {
      this.beneficiaryRelationID = registeredBenData.benPhoneMaps[0].benRelationshipType.benRelationshipID;
      this.isParentBeneficiary = false;
    } else {
      this.beneficiaryRelations = this.beneficiaryRelations.filter(function (item) {
        return item.benRelationshipType !== 'Self'; // This value has to go in constant
      });
      this.beneficiaryRelationID = registeredBenData.benPhoneMaps[0].benRelationshipType.benRelationshipID;
    }
    if (this.state) {
      this.GetDistricts(this.state);
    }
    if (this.district) {
      this.GetTaluks(this.district);
    }
    if (this.taluk) {
      this.GetBlocks(this.taluk);
    }
    this.pincode = registeredBenData.i_bendemographics.pinCode;
    this.preferredLanguage = registeredBenData.i_bendemographics.preferredLangID;
    this.updatedObj = registeredBenData;
    this.saved_data.beneficiaryData = registeredBenData;
    this.onBenRegDataSelect.emit(this.benRegData);
  }

  updateBeneficiary() {
    this.updatedObj.firstName = this.FirstName;
    this.updatedObj.lastName = this.LastName;
    this.updatedObj.genderID = this.GenderID;
    if (this.DOB) {
      this.DOB = new Date(this.DOB);
      this.updatedObj.dOB = new Date((this.DOB) - 1 * (this.DOB.getTimezoneOffset() * 60 * 1000)).toJSON();
    } else {
      this.updatedObj.dOB = undefined;
    }
    this.updatedObj.titleId = this.TitleId;
    this.updatedObj.maritalStatusID = this.MaritalStatusID;
    // this.updatedObj.parentBenRegID = this.ParentBenRegID;
    // this.updatedObj.altPhoneNo = this.PhoneNo;
    let phones = this.updatedObj.benPhoneMaps.length;
    // if (phones > 0) {
    //   phones = 1;
    // }
    // if (
    //   !this.updatedObj.benPhoneMaps[phones] ||
    //   !((this.updatedObj.benPhoneMaps[phones].phoneNo) && (this.updatedObj.benPhoneMaps[phones].phoneNo === this.PhoneNo))
    // )
    for (let index = 0; index < phones; index++) {
      // this.updatedObj.benPhoneMaps[phones] = {};
      this.updatedObj.benPhoneMaps[index].parentBenRegID = this.ParentBenRegID;
      this.updatedObj.benPhoneMaps[index].benificiaryRegID = this.updatedObj.beneficiaryRegID;
      this.updatedObj.benPhoneMaps[index].benRelationshipID = this.beneficiaryRelationID;
      if (index === 1) {
        this.updatedObj.benPhoneMaps[index].phoneNo = this.PhoneNo;
      }
      if (this.updatedObj.benPhoneMaps[index].createdBy) {
        this.updatedObj.benPhoneMaps[index].modifiedBy = this.saved_data.uname;
      } else {
        this.updatedObj.benPhoneMaps[index].createdBy = this.saved_data.uname;
        this.updatedObj.benPhoneMaps[index].deleted = false;
      }
    }
    this.updatedObj.govtIdentityNo = this.aadharNo;

    if (!this.updatedObj.i_bendemographics.beneficiaryRegID) {
      this.updatedObj.i_bendemographics.beneficiaryRegID = this.updatedObj.beneficiaryRegID;
    }
    this.updatedObj.i_bendemographics.communityID = this.caste;
    this.updatedObj.i_bendemographics.educationID = this.educationQualification;
    this.updatedObj.i_bendemographics.stateID = this.state;
    this.updatedObj.i_bendemographics.districtID = this.district;
    this.updatedObj.i_bendemographics.blockID = this.taluk;
    this.updatedObj.i_bendemographics.districtBranchID = this.village;
    this.updatedObj.i_bendemographics.pinCode = this.pincode;
    this.updatedObj.i_bendemographics.preferredLangID = this.preferredLanguage;


    // saving the updated ben data in the in_app_saved data service file
    this.saved_data.beneficiaryData = this.updatedObj;
    // return;

    this.updateBen.updateBeneficiaryData(this.updatedObj).subscribe(response =>
      this.updateSuccessHandeler(response)
    );
  }

  updateSuccessHandeler(response) {
    this.benUpdationResponse = response;
    // this.regHistoryList = [response];
    this.regHistoryList = '';
    this.regHistoryList = [response];
    this.showSearchResult = true;
    this.notCalledEarlier = false;
    this.updationProcess = false;
		/**
		 *Neeraj Code; 22-jun-2017
		 */
    this.notCalledEarlierLowerPart = false;
    this.calledRadio = true;
		/**
	 *End of Neeraj Code; 22-jun-2017
	 */
  }

	/**
	 * NEERAJ; Select beneficiary for service provided; 27-JUN-2017
	 */
  selectBeneficiary(regHistory: any) {

    this.saved_data.benRegId = regHistory.beneficiaryRegID;

    const dialogRef = this.dialog.open(BeneficiaryHistoryComponent, {
      height: '75%',
      width: '75%',
      data: regHistory.beneficiaryRegID,
    });
    dialogRef.afterClosed().subscribe(result => {
      this.populateUserData(regHistory);
      this.onBenSelect.emit('benService');
      this.showSearchResult = false;
      this.notCalledEarlierLowerPart = false;
    });

  }

  getRelationShipType(relationShips) {
    let benificiaryRelationType = [];
    benificiaryRelationType = relationShips.filter(function (item) {
      return item.benRelationshipType === 'Self'; // This value has to go in constant
    });
    this.beneficiaryRelationID = benificiaryRelationType[0]['benRelationshipID']
    return this.beneficiaryRelationID;
  }
  // Handling Error
  getParentData(parentBenID) {
    this._util.retrieveRegHistory(parentBenID).subscribe((response) => {
      if (response) {
        this.relationshipWith = 'Relationship with ' + response[0].firstName + ' ' + response[0].lastName;
      }
    }, (err) => {
        console.log('Something Went Wrong in fetching Parent Data');
      })

  }
  // to Calculate the age on the basis of date of birth
  calculateAge(date) {
    this.age = this.today.getFullYear() - date.getFullYear();
    const month = this.today.getMonth() - date.getMonth();
    if (month < 0 || (month === 0 && this.today.getDate() < date.getDate())) {
      this.age--;
    }
    return this.age;
  }
  // calculate date of birth on the basis of age
  calculateDOB(age) {
    const currentYear = this.today.getFullYear();
    // int parsing in decimal format
    this.DOB = new Date('' + (currentYear - parseInt(age, 10)));
    this.renderer.setElementAttribute(this.input.nativeElement, 'readonly', 'readonly');
  }
  // to remove the readonly on double click
  enableAge(data) {
    this.renderer.setElementAttribute(this.input.nativeElement, 'readonly', null);

  }
}
