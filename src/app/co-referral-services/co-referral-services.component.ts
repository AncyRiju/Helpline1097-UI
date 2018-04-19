import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service'
import { LocationService } from "../services/common/location.service";
import { CoReferralService } from "../services/coService/co_referral.service";
import { dataService } from "../services/dataService/data.service"
import { Subscription } from 'rxjs/Subscription';
import { MdDialog, MdDialogRef } from '@angular/material';
import { CoAlternateNumberComponent } from './co-alternate-number/co-alternate-number.component';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
// Common service to pass Data
declare var jQuery: any;

import { CommunicationService } from './../services/common/communication.service'
@Component({
  selector: 'app-co-referral-services',
  templateUrl: './co-referral-services.component.html',
  styleUrls: ['./co-referral-services.component.css']
})
export class CoReferralServicesComponent implements OnInit {
  @Input() current_language: any;
  currentlanguage: any;
  @Input() resetProvideServices: any;

  @Output() referralServiceProvided: EventEmitter<any> = new EventEmitter<any>();

  showFormCondition: boolean = false;
  showTableCondition: boolean = true;

  tableArray: any = [];
  data: any = [];
  states: any = [];
  districts: any = [];
  taluks: any = [];
  blocks: any = [];
  branches: any = [];
  directory: any = [];
  sub_directory: any = [];
  detailsList: any = [];

  selected_state: any = undefined;
  selected_district: any = undefined;
  selected_taluk: any = undefined;
  selected_block: any = undefined;
  selected_branch: any = undefined;
  selected_directory: any = undefined;
  selected_sub_directory: any = undefined;
  description: any = undefined;
  subServiceID: number = 3;
  showSendSMS: boolean = false;
  providerServiceMapID: number;
  subscription: Subscription
  beneficiaryRegID: any;
  p = 1;
  enableSms: boolean = true;
  showresult: boolean;
  constructor(
    private _userBeneficiaryData: UserBeneficiaryData,
    private _locationService: LocationService,
    private _coReferralService: CoReferralService,
    private saved_data: dataService,
    private pass_data: CommunicationService,
    private dialog: MdDialog,
    private message: ConfirmationDialogsService
  ) { this.subscription = this.pass_data.getData().subscribe(message => { this.getBenData(message) }); }

  ngOnInit() {
    this.providerServiceMapID = this.saved_data.current_service.serviceID;
    this.GetServiceTypes();

    // call the api to get all the referrals done and store them in array;
    // this.tableArray = []; //substitute it with the response
    // // call the api to get all the states
    // this.states = [];  //substitute it with the response
    this._userBeneficiaryData.getUserBeneficaryData(this.saved_data.current_service.serviceID)
      .subscribe(response => this.SetUserBeneficiaryRegistrationData(response),
      (err) => {
        this.message.alert(err.errorMessage,'error');
      });
    this.GetInformationDirectory();
  }
  tempFlag: boolean;
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    this.setLanguage(this.current_language);
    if(this.resetProvideServices) {
      this.tempFlag = true;

      this.showTableCondition = true;
      this.showFormCondition = false;
      this.detailsList = [];
      this.showresult = false;
      // this.selected_state = undefined;

    }
    
  }

  setLanguage(language) {
    this.currentlanguage = language;
    console.log(language, 'language in referral tak');
  }

  GetServiceTypes() {
    this._coReferralService.getTypes(this.providerServiceMapID)
      .subscribe(response => this.setServiceTypes(response),
      (err) => {
        this.message.alert(err.errorMessage,'error');
      });
  }
  setServiceTypes(response: any) {
    for (let i: any = 0; i < response.length; i++) {
      if (response[i].subServiceName.toUpperCase().search('REFE') >= 0) {
        this.subServiceID = response[i].subServiceID;
        break;
      }
    }
  }

  setBeneficiaryData() {
    this._coReferralService.getReferralHistoryByID(this.beneficiaryRegID, this.saved_data.current_service.providerServiceMapID)
      .subscribe(response => this.getReferralHistory(response),
      (err) => {
        this.message.alert(err.errorMessage,'error');
      });
  }

  getReferralHistory(response: any) {
    console.log('referral history is :', response);
    // this.tableArray = response;
    if (response) {
      this.data = response;
    }
    else {
      this.message.alert("No data found")
    }

  }

  showForm() {
    this.showFormCondition = true;
    this.showTableCondition = false;
    if(this.tempFlag){
            jQuery('#referralForm').trigger("reset");
            this.tempFlag = false;
    }

  }

  showTable() {
    this.showFormCondition = false;
    this.showTableCondition = true;
    this.setBeneficiaryData();
  }

  SetUserBeneficiaryRegistrationData(regData: any) {
    if (regData.states) {
      this.states = regData.states;
    }
    if (regData.directory) {
      // this.directory = regData.directory;
    }
  }
  GetInformationDirectory() {
    this._locationService.getDirectory(this.providerServiceMapID).subscribe((response) => {
      this.directory = response.directory;
    }, (err) => {
      this.message.alert(err.errorMessage,'error');

    });
  }
  GetDistricts(state: number) {
    this.districts = [];
    this.taluks = [];
    this.blocks = [];
    this._locationService.getDistricts(state)
      .subscribe(response => this.SetDistricts(response),
      (err) => {
        this.message.alert(err.errorMessage,'error');
      });
  }
  SetDistricts(response: any) {
    this.districts = response;
  }
  GetTaluks(district: number) {
    this.taluks = [];
    this.blocks = [];
    this._locationService.getTaluks(district)
      .subscribe(response => this.SetTaluks(response),
      (err) => {
        this.message.alert(err.errorMessage,'error');
      });
  }
  SetTaluks(response: any) {
    this.taluks = response;
  }
  GetSDTB(taluk: number) {
    this.blocks = [];
    this._locationService.getBranches(taluk)
      .subscribe(response => this.SetSDTB(response),
      (err) => {
        this.message.alert(err.errorMessage,'error');
      });
  }
  SetSDTB(response: any) {
    this.blocks = response;
  }

  GetSubDirectory(directoryID: number) {
    this._locationService.getSubDirectory(directoryID)
      .subscribe(response => this.SetSubDirectory(response),
      (err) => {
        this.message.alert(err.errorMessage,'error');
      });
  }
  SetSubDirectory(response: any) {
    this.sub_directory = response.subDirectory;
  }

  GetReferralDetails() {
    this._coReferralService.getDetails(
      this.selected_directory, this.selected_sub_directory, this.selected_state, this.selected_district, this.selected_taluk,
      this.saved_data.uname, this.beneficiaryRegID, this.subServiceID, this.saved_data.callData.benCallID
    ).subscribe(response => this.SetReferralDetails(response),
    (err) => {
      this.message.alert(err.errorMessage,'error');
    });
  }

  SetReferralDetails(response: any) {
    console.log('success referral', response);
    if (response) {
      this.showresult = true;

      this.detailsList = response;
      if (this.detailsList.length > 0) {
        this.showSendSMS = true;
      }
      this.referralServiceProvided.emit();
      this.provideReferralDescription();
    }

  }

  provideReferralDescription() {
    const refObj = {
      'state': this.selected_state,
      'district': this.selected_district,
      'taluk': this.selected_taluk,
      'block': this.selected_block,
      'selected_directory': this.selected_directory,
      'selected_sub_directory': this.selected_sub_directory,
      'date': new Date()
    }
    // this.tableArray.push(refObj);
    // this.data.push(refObj);
    this.setBeneficiaryData();

  }
  getBenData(benData: any) {
    this.beneficiaryRegID = benData.dataPass.beneficiaryRegID;
    this.setBeneficiaryData();
  }
  toUTCDate(date) {
    const _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(),
      date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return _utc;
  };

  millisToUTCDate(millis) {
    return this.toUTCDate(new Date(millis));
  };

  sendSMS() {
    let dialogReff = this.dialog.open(CoAlternateNumberComponent, {
      height: '280px',
      width: '420px',
      disableClose: true,
      data: {
        'currentlanguage': this.current_language
      }
    });

    dialogReff.afterClosed().subscribe(result => {
      if (result) {
        this.message.alert('Message sent to alternate number','success');
      }
      else {
        let primaryNumber = this.saved_data.callerNumber;
        this.message.alert('Message sent to primary number','success');
      }
    });
  }
  toggleSms(e: any) {
    if (!e.checked) {
      this.enableSms = true;
    } else {
      this.enableSms = false;
    }
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }



}
