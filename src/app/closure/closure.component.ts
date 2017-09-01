import { Component, OnInit, AfterViewInit, EventEmitter, Input, Output } from '@angular/core';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { CallServices } from '../services/callservices/callservice.service'
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { CommunicationService } from './../services/common/communication.service'
import { Subscription } from 'rxjs/Subscription';



@Component({
  selector: 'app-closure',
  templateUrl: './closure.component.html',
  styleUrls: ['./closure.component.css']
})
export class ClosureComponent implements OnInit
// export class ClosureComponent implements AfterViewInit
{

  @Input() current_language: any;
  currentlanguage: any;

  @Output() callClosed: EventEmitter<any> = new EventEmitter<any>();
  @Output() closedContinue: EventEmitter<any> = new EventEmitter<any>();
  summaryList: any = [];
  showCallSummary: boolean = false;
  remarks: any;
  callClosureType: any;
  calltypes: any = [];
  isFollowupRequired: boolean = false;
  prefferedDateTime: any;
  callTypeID: any;
  minDate: Date;
  maxDate: Date;
  isFollowUp;
  followUpDate: any;
  picker = '';
  current_campaign: any;

  today: Date;

  showSlider: boolean;
  benCallID: any;
  beneficiaryRegID: any;
  serviceID: any;
  subscription: Subscription
  callTypeObj: any;
  callSubTypes: any;
  constructor(
    private _callServices: CallServices,
    private saved_data: dataService,
    private message: ConfirmationDialogsService,
    private pass_data: CommunicationService,
  ) { this.subscription = this.pass_data.getData().subscribe(benData => { this.outBoundCloseCall(benData) }); }
  /* Intialization of variable and object has to be come here */
  ngOnInit() {
    const requestObject = { 'providerServiceMapID': this.saved_data.current_service.serviceID };
    this.isFollowUp = false;
    this._callServices.getCallTypes(requestObject).subscribe(response => {
      this.callTypeObj = response;
      this.populateCallTypes(response)
    }, (err) => {

    });

    this.today = new Date();
    this.minDate = this.today;
    this.showSlider = false;
    this.current_campaign = this.saved_data.current_campaign;
  }


  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    this.setLanguage(this.current_language);

  }

  setLanguage(language) {
    this.currentlanguage = language;
  }

  sliderVisibility(val) {
    if (val) {
      this.showSlider = true;
    } else {
      this.showSlider = false;
    }
  }

  populateCallTypes(response: any) {
    this.calltypes = response.map(function (item) {
      return { 'callTypeDesc': item.callGroupType };
    });
  }
  getCallSubType(callType: any) {

    this.callSubTypes = this.callTypeObj.filter(function (item) {
      return item.callGroupType === callType;
    }).map(function (previousData, item) {
      return previousData.callTypes;
    })[0];
  }
  // @Input()
  onView() {
    const requestObject = { 'benCallID': this.saved_data.callData.benCallID };
    this._callServices.getCallSummary(requestObject).subscribe(response => this.populateCallSummary(response));
  }
  populateCallSummary(response: any) {
    this.summaryList = [];
    console.log(JSON.stringify(response));
    this.summaryList = response;

    this.showCallSummary = false;
    if (this.summaryList.length > 0) {
      this.showCallSummary = true;
    }
  }

  closeCall(values: any, btnType: any) {

    values.benCallID = this.saved_data.callData.benCallID;
    values.beneficiaryRegID = this.beneficiaryRegID;
    values.providerServiceMapID = this.saved_data.current_service.serviceID;

    // Gursimran to look at fixing of followupRequired issue
    if (values.isFollowupRequired == undefined) {
      values.isFollowupRequired = false;
    }

    if (values.prefferedDateTime) {
      values.prefferedDateTime = new Date(values.prefferedDateTime);
      values.prefferedDateTime
        = new Date((values.prefferedDateTime) - 1 * (values.prefferedDateTime.getTimezoneOffset() * 60 * 1000)).toJSON();
    } else {
      values.preferredDateTime = undefined;
    }
    values.createdBy = this.saved_data.uname;
    values.fitToBlock = values.callTypeID.split(',')[1];
    values.callTypeID = values.callTypeID.split(',')[0];
    console.log('close called with ' + values);
    this._callServices.closeCall(values).subscribe((response) => {
      this.showAlert();
      if (btnType === 'submitClose') {
        this.callClosed.emit(this.current_campaign);
      } else {
        this.closedContinue.emit();
      }
      // this.pass_data.sendData(this.current_campaign);

    }, (err) => {
      this.message.alert(err.status);
    });

  }

  showAlert() {
    this.message.alert('Call closed Successful!!!!');
    // alert('Call closed Successful!!!!');
  }
  isFollow(e) {
    if (e.checked) {
      this.isFollowUp = true;
      this.isFollowupRequired = true
    } else {
      this.isFollowUp = false;
      this.isFollowupRequired = false;
    }

  }
  outBoundCloseCall(benData: any) {
    this.beneficiaryRegID = benData.dataPass.beneficiaryRegID;
    this.onView();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}
