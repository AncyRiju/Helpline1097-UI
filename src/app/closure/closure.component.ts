import { Component, OnInit, AfterViewInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { CallServices } from '../services/callservices/callservice.service'
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { CommunicationService } from './../services/common/communication.service'
import { Subscription } from 'rxjs/Subscription';
import { CzentrixServices } from '../services/czentrix/czentrix.service';
import { ClearFormService } from './../services/common/clearform.service'

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
  @ViewChild('Form') closureForm;
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
  ipAddress: any;
  agentID: number;
  today: Date;
  compaignSpecific: boolean = false;
  showSlider: boolean;
  benCallID: any;
  beneficiaryRegID: any = this.saved_data.beneficiaryRegID;
  serviceID: any;
  subscription: Subscription
  callTypeObj: any;
  callSubTypes: any;
  language: any;
  languages: any = [];
  preferredLanguageName: any;
  isCallDisconnected: boolean = false;
  transferValid: boolean = false;
  campaignNames: any = [];
  campaignName: any;
  campaignSkills: any = [];
  campaignSkill: any;
  beneficiarySelected: boolean;
  noOfOutbounds: any;
  prefferedDatedTaken: any;

  isFeedbackRequiredFlag = false;
  showFeedbackRequiredFlag = false;
  subServiceTypes: any = [];
  requestedServiceID: number;
  isEverwell: string;
  everwellBeneficiarySelected: boolean;

  constructor(
    private _callServices: CallServices,
    public saved_data: dataService,
    private message: ConfirmationDialogsService,
    private pass_data: CommunicationService,
    private czentrixServices: CzentrixServices,
    private clearfornData: ClearFormService
  ) {
    this.subscription = this.pass_data.getData().subscribe(benData => { this.outBoundCloseCall(benData) });
    this.subscription = this.clearfornData.clearFormGetter().subscribe(data => { this.clearForm(data) });
    this.saved_data.beneficiarySelected.subscribe((data) => {
      this.setFlag(data)
    });

    this.saved_data.beneficiary_regID_subject.subscribe(response => {
      this.setBenRegID(response);
    });
    this.isEverwell = sessionStorage.getItem("isEverwellCall");
    if(this.isEverwell === 'yes')
    {
      this.saved_data.everwellBeneficiarySelected.subscribe(response => {
        this.setEverwellBenRegID(response);
      });
    }
  }
  /* Intialization of variable and object has to be come here */
  ngOnInit() {
    this.beneficiaryRegID = this.saved_data.beneficiaryRegID;
    let requestObject = { 'providerServiceMapID': this.saved_data.current_service.serviceID };
    if (this.saved_data.current_campaign == 'INBOUND') {
      requestObject['isInbound'] = true;
    } else {
      requestObject['isOutbound'] = true;
    }
    this.isFollowUp = false;
    this._callServices.getCallTypes(requestObject).subscribe(response => {
      this.callTypeObj = response;
      this.populateCallTypes(response)
    }, (err) => {
      this.message.alert(err.errorMessage, 'error');

    });

    this.today = new Date();
    this.minDate = this.today;
    this.minDate.setHours(0, 0, 0, 0);
    this.showSlider = false;
    this.current_campaign = this.saved_data.current_campaign;
    if (!this.saved_data.loginIP) {
      this.getIpAddress();
    } else {
      this.ipAddress = this.saved_data.loginIP;
    }
    this.isCallDisconnected = this.saved_data.isCallDisconnected;
    this.getLanguages();

    let data = {
      "serviceName": this.saved_data.current_service.serviceName
    }
    console.log(data);
    this._callServices.getCampaignNames(data).subscribe(response => this.campaignNamesSuccess(response),
      (err) => {
        console.log("ERROR IN FETCHING CAMPAIGN NAMES");
      })
    this.beneficiarySelected = false;
    this.getSubServiceTypes(requestObject);
  }

  getSubServiceTypes(requestObject: any) {
    this._callServices.getSubServiceTypes(requestObject).subscribe(response => this.setSubServiceTypes(response),
      (err) => {
        console.log("ERROR IN FETCHING CAMPAIGN NAMES");
      })
  }
  setSubServiceTypes(requestObject: any) {
    this.subServiceTypes = requestObject;
  }

  campaignNamesSuccess(res) {
    this.campaignNames = res.campaign;
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    this.setLanguage(this.current_language);

  }

  setLanguage(language) {
    this.currentlanguage = language;
  }

  sliderVisibility(val: any) {
    console.log(this.callTypeID.split(',')[2]);
    if (this.callTypeID.split(',')[2] == "true") {
      this.showSlider = true;
    } else {
      this.showSlider = false;
      this.isFollowUp = false;
      this.isFollowupRequired = false;
    }
  }

  populateCallTypes(response: any) {
    let calls = response.map(function (item) {
      return { 'callTypeDesc': item.callGroupType };
    });
    this.calltypes = calls;
    this.calltypes = calls.filter((item) => {
      return item.callTypeDesc.toLowerCase().trim() !== 'wrapup exceeds';
    })
    if(this.isEverwell === 'yes'){
    this.calltypes = calls.filter((item) => {
      return item.callTypeDesc.toLowerCase().trim() !== 'wrapup exceeds' && item.callTypeDesc.toLowerCase().trim() === 'valid';
    })
  }
  }
  getCallSubType(callType: any) {
    if (callType == 'Transfer') {
      this.transferValid = true;
    }
    else {
      this.transferValid = false;
    }
    this.callTypeID = undefined;
    if(this.isEverwell === 'yes'){
    if ((callType == "Valid" || callType == 'Transfer') && !this.everwellBeneficiarySelected) {
      this.message.alert("Can't make call valid or transfer without selecting beneficiary");
      this.closureForm.form.patchValue({
        "callType": ""
      })
    }
  }
  // else{
  //   if ((callType == "Valid" || callType == 'Transfer') && !this.beneficiarySelected) {
  //     this.message.alert("Can't make call valid or transfer without selecting beneficiary");
  //     this.closureForm.form.patchValue({
  //       "callType": ""
  //     })
  //   }
  //}

    if (callType.toUpperCase() === 'Valid'.toUpperCase()) {
      // this.isFeedbackRequiredFlag = false;
      this.showFeedbackRequiredFlag = true;
    }
    if (callType.toUpperCase() != 'Valid'.toUpperCase()) {
      this.isFeedbackRequiredFlag = false;
      this.showFeedbackRequiredFlag = false;
    }
    // Below variable is used to disable save and continue when call is already disconnected.
    this.isCallDisconnected = this.saved_data.isCallDisconnected;
    this.callSubTypes = this.callTypeObj.filter(function (item) {
      return item.callGroupType === callType;
    }).map(function (previousData, item) {
      return previousData.callTypes;
    })[0];

    let obj = {
      "beneficiaryRegID": this.saved_data.beneficiaryRegID,
      "calledServiceID": this.saved_data.current_service.serviceID,
      "is1097": true
    }
    this._callServices.getBenOutboundList(obj).subscribe(response => {
      this.getBenOutboundDataSuccess(response, callType)
    }), (err) => {
      console.log("error in fetching getBenOutboundList for this ben")
    }
  }
  getBenOutboundDataSuccess(res, callType) {
    if (callType == 'Valid') {
      this.prefferedDatedTaken = [];
      if (res.length > 0)
        this.noOfOutbounds = res.length;

      res.map((obj) => {
        this.prefferedDatedTaken.push({ "prefferedDateTime": obj.prefferedDateTime });
      })
    }
  }
  toUTCDate(date) {
    const _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(),
      date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return _utc;
  };

  millisToUTCDate(millis) {
    return this.toUTCDate(new Date(millis));
  };
  // @Input()
  onView() {
    const requestObject = { 'benCallID': this.saved_data.callData.benCallID };
    this._callServices.getCallSummary(requestObject).subscribe(response => this.populateCallSummary(response),
      (err) => console.log("error in getting call summary in closure component"));
  }
  populateCallSummary(response: any) {
    this.summaryList = [];
    console.log(JSON.stringify(response));
    this.summaryList = response;

    // this.showCallSummary = false;
    // if (this.summaryList.length > 0) {
    //   this.showCallSummary = true;
    // }
  }
  getLanguages() {
    this._callServices.getLanguages().subscribe(response => {

      this.languages = response;
      let preferredlanguageList = this.languages.filter(lang => {
        return lang.languageName.toLowerCase() === 'hindi'
      });
      if (preferredlanguageList) {
        this.preferredLanguageName = preferredlanguageList[0].languageName;
      }
    }, (err) => {
      this.message.alert(err.errorMessage, 'error');

    });
  }

  getCampaignSkills(campaign_name) {
    this.campaignSkill = "";
    this.campaignSkills = [];

    let data = {
      "campaign_name": campaign_name
    }
    this._callServices.getCampaignSkills(data).subscribe(response => this.skillsSuccess(response),
      (err) => {
        this.message.alert(err.errorMessage, 'error');
      })
  }
  skillsSuccess(res) {
    this.campaignSkills = res.response ? res.response.skills : [];
  }


  isFeedbackRequired(ev) {
    this.isFeedbackRequiredFlag = ev.checked;
  }

  transferCall(values) {
    let obj = {
      "transfer_from": this.saved_data.cZentrixAgentID,
      "transfer_campaign_info": values.campaignName,
      "skill_transfer_flag": values.campaignSkill ? '1' : '0',
      "skill": values.campaignSkill
    }
    this._callServices.transferCall(obj).subscribe(response => {
      delete values.campaignName;
      delete values.campaignSkill;
      this.closeCall(values, "submitClose");
    },
      (err) => {
        this.message.alert("Error in transfering", "error");
      });
  }
  closeCall(values: any, btnType: any) {

    values.isFeedback = this.isFeedbackRequiredFlag;
    values.benCallID = this.saved_data.callData.benCallID;
    values.beneficiaryRegID = this.beneficiaryRegID;
    values.providerServiceMapID = this.saved_data.current_service.serviceID;
    // values.preferredLanguageName = values.preferredLanguageName.languageName;
    // Gursimran to look at fixing of followupRequired issue
    if (values.isFollowupRequired == undefined) {
      values.isFollowupRequired = false;
    }

    if (values.prefferedDateTime) {
      values.requestedServiceID = this.requestedServiceID;
      values.prefferedDateTime = new Date(values.prefferedDateTime);
      values.prefferedDateTime
        = new Date((values.prefferedDateTime) - 1 * (values.prefferedDateTime.getTimezoneOffset() * 60 * 1000)).toJSON();
    } else {
      values.preferredDateTime = undefined;
    }
    values.createdBy = this.saved_data.uname;
    values.fitToBlock = values.callTypeID.split(',')[1];
    values.callTypeID = values.callTypeID.split(',')[0];
    values.agentID = this.saved_data.cZentrixAgentID;
    values.agentIPAddress = this.ipAddress;
    if (btnType === 'submitClose') {
      values.endCall = true;
    }
    if (this.saved_data.current_campaign == 'OUTBOUND') {
      values.isCompleted = true;
    }
    console.log('close called with ' + values);
    if (this.saved_data.current_campaign.toUpperCase() === 'OUTBOUND') {
      this.current_campaign = this.saved_data.current_campaign;
      if(this.isEverwell !== 'yes'){
      this._callServices.closeOutBoundCall(this.saved_data.outBoundCallID, true).subscribe((response) => {
        this.closeOutboundCall(btnType, values);
      }, (err) => {
        this.message.alert(err.status, 'error');
      })
    }
    else{
      let outboundObj = {};
      outboundObj['eapiId'] = this.saved_data.outboundEverwellData.eapiId;
      outboundObj['assignedUserID'] = this.saved_data.uid;
      outboundObj['isCompleted'] = true;
      outboundObj['beneficiaryRegId'] = this.saved_data.outboundEverwellData.beneficiaryRegId;
      outboundObj['callTypeID'] = values.callTypeID;
      outboundObj['benCallID'] = values.benCallID;
      outboundObj['callId'] = this.saved_data.callID;
      outboundObj['providerServiceMapId'] = values.providerServiceMapID;
      outboundObj['requestedServiceID'] = null;
      outboundObj['preferredLanguageName'] = "All"
      outboundObj['createdBy'] = this.saved_data.uname;

      this._callServices.closeEverwellOutBoundCall(outboundObj).subscribe((response) => {
        this.closeOutboundCall(btnType, values);
      }, (err) => {
        this.message.alert(err.status, 'error');
      })

    }    

    } else {
      if (btnType === 'submitClose') {
        this._callServices.closeCall(values).subscribe((response) => {
          if (response) {
            this.showAlert();
            // if (btnType === 'submitClose') {
            this.callClosed.emit(this.current_campaign);
            // } else {
            //   this.closedContinue.emit();
            // }
            // this.pass_data.sendData(this.current_campaign);

            /* below lines are commented to use old close call API */
            // this._callServices.disconnectCall(this.saved_data.cZentrixAgentID).subscribe((res) => {
            //   console.log('disconnect response', res);

            // }, (err) => {

            // });
          }
        }, (err) => {
          this.message.alert(err.status, 'error');
        });
      } else {
        this.message.confirm('Continue', 'Providing new service to beneficiary?').subscribe((res) => {
          if (res) {
            this._callServices.closeCall(values).subscribe((response) => {
              if (response) {
                this.closureForm.reset();
                this.showSlider = false;
                this.isFollowUp = false;
                this.isFollowupRequired = false;
                this.showAlert();
                // if (btnType === 'submitClose') {
                // this.callClosed.emit(this.current_campaign);
                // } else {
                this.closedContinue.emit();
                /* below lines are commented to use old close call API */
                // this._callServices.disconnectCall(this.saved_data.cZentrixAgentID).subscribe((res) => {
                //   console.log('disconnect response', res);

                // }, (err) => {

                // });
                // }
                // this.pass_data.sendData(this.current_campaign);
              }
            }, (err) => {
              this.message.alert(err.status, 'error');
            });
          }

        })
      }
    }

  }

  showAlert() {
    sessionStorage.removeItem("isOnCall");
    if (this.transferValid == true) {
      this.message.alert("Call transferred successfully", 'success');
    }
    else {
      this.message.alert('Call closed successfully', 'success');
    }
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

    this.beneficiaryRegID = benData.dataPass.beneficiaryRegID ? benData.dataPass.beneficiaryRegID : this.saved_data.beneficiaryRegID;
    if (benData.dataPass.i_bendemographics.m_language) {
      this.preferredLanguageName = benData.dataPass.i_bendemographics.m_language.languageName;
      // this.preferredLanguageName = benData.dataPass.i_bendemographics.m_language.map(function (item) {
      //   return {
      //     'languageID': item.languageID,
      //     'languageName': item.languageName
      //   }
      // });
    }
    this.onView();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
  getIpAddress() {
    this.czentrixServices.getIpAddress(this.saved_data.Userdata.agentID)
      .subscribe(response => this.ipSuccessHandler(response),
      (err) => {
        this.message.alert(err.errorMessage, 'error');

      });
  }
  ipSuccessHandler(response) {
    console.log('fetch ip response: ' + JSON.stringify(response));
    this.ipAddress = response.response.agent_ip;
  }
  closeOutboundCall(btnType: any, values: any) {
    this._callServices.closeCall(values).subscribe((response) => {
      if (response) {
        this.message.alert('Call closed successfully', 'success');
        if (btnType === 'submitClose') {
          this.saved_data.feedbackData = undefined;
          this.callClosed.emit(this.current_campaign);
          /* below lines are commented to use old close call API */
          // this._callServices.disconnectCall(this.saved_data.cZentrixAgentID).subscribe((res) => {
          //   console.log('disconnect response', res);

          // }, (err) => {

          // });
        } else {
          this.closedContinue.emit();
        }
        // this.pass_data.sendData(this.current_campaign);
      }
    }, (err) => {
      this.message.alert(err.status, 'error');
    });
  }
  clearForm(item) {
    if (item.dataPass === 'closure') {
      this.closureForm.reset();
      this.showSlider = false;
      this.isFollowUp = false;
      this.isFollowupRequired = false;
    }
  }
  blockey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }
  setFlag(data) {
    this.beneficiarySelected = data.beneficiarySelected;
    console.log('BEN SELECTED', this.beneficiarySelected);
  }
  setEverwellBenRegID(data) {    
    this.everwellBeneficiarySelected = data.isEverwellBeneficiarySelected;
    console.log('everwell BEN SELECTED', this.everwellBeneficiarySelected);
  }

  setBenRegID(data) {
    this.beneficiaryRegID = data.beneficiaryRegID;
  }
}
