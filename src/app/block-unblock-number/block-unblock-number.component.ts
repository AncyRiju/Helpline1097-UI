import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { dataService } from './../services/dataService/data.service';
import { CallServices } from './../services/callservices/callservice.service'
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service'


@Component({
  selector: 'app-block-unblock-number',
  templateUrl: './block-unblock-number.component.html',
  styleUrls: ['./block-unblock-number.component.css']
})
export class BlockUnblockNumberComponent implements OnInit {

  phoneNumber: number;
  maxDate: Date;
  blockedDate: any;
  blockedTill: any;
  isBlockedType: boolean;
  showTable: boolean = false;
  isBlocked: boolean = undefined;
  isUnBlocked: boolean = undefined;
  reason: any;
  blockedBy: string;
  blockForm: FormGroup;
  serviceId: any;
  blackList: any = [];
  searchByPhone: boolean = false;
  constructor(private commonData: dataService, private callService: CallServices,
    private message: ConfirmationDialogsService) { }

  ngOnInit() {
    // this.isBlockedType = undefined;
    this.serviceId = this.commonData.current_service.serviceID;
    this.maxDate = new Date();
    this.addToBlockList();
  }

  getBlockedTillDate(date) {
    this.blockedTill = date.setDate(date.getDate() + 7);
    console.log(this.blockedTill);
  }

  addToBlockList() {
    const searchObj = {};
    searchObj['providerServiceMapID'] = this.serviceId;
    searchObj['phoneNo'] = this.phoneNumber;
    // searchObj['isBlocked'] = this.isBlockedType;
    this.isBlocked = Boolean(this.isBlocked);
    this.callService.getBlackListCalls(searchObj).subscribe((response) => {
      this.showTable = true;
      this.setBlackLists(response);
    }, (err) => {
      this.showTable = false;
    });
  }
  setBlackLists(blackListData: any) {
    this.blackList = blackListData;
  }
  unblock(phoneBlockID: any) {
    const blockObj = {};
    blockObj['phoneBlockID'] = phoneBlockID;
    this.callService.UnBlockPhoneNumber(blockObj).subscribe((response) => {
      this.message.alert('Successfully Unblocked');
      this.addToBlockList();
    }, (err) => {
      this.message.alert(err.status);
    })
  }
  block(phoneBlockID: any) {
    const blockObj = {};
    blockObj['phoneBlockID'] = phoneBlockID;
    this.callService.blockPhoneNumber(blockObj).subscribe((response) => {
      this.message.alert('Successfully blocked');
      this.addToBlockList();
    }, (err) => {
      this.message.alert(err.status);
    })
  }
  getBlackList(e: any) {
    if (!e.checked) {
      this.phoneNumber = undefined;
      this.addToBlockList();
    }

  }
}
