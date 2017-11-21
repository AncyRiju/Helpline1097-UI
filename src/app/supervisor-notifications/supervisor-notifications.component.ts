import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../services/notificationService/notification-service';
import { dataService } from '../services/dataService/data.service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { NotificationsDialogComponent } from '../notifications-dialog/notifications-dialog.component';
import { MdDialog } from '@angular/material';
import { EditNotificationsComponent } from '../edit-notifications/edit-notifications.component';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service'
@Component({
  selector: 'app-supervisor-notifications',
  templateUrl: './supervisor-notifications.component.html',
  styleUrls: ['./supervisor-notifications.component.css']
})
export class SupervisorNotificationsComponent implements OnInit {
  serviceProviderID:any;
  providerServiceMapID: any;
  serviceID:any;
  stateID:any;
  createdBy: any;
  userId: any;
  notificationTypes = [];
  roleObjArray = [];
  notifications = [];
  notificationPostData: any;
  onConfigSubmit: boolean = false;
  p: number = 1;
  minDate: Date;
  roleIDs = [];

  @ViewChild('showNotificationForm') showNotificationForm: NgForm;

  constructor(private notificationService: NotificationService,
              private alertMessage: ConfirmationDialogsService, public commonDataService: dataService, public dialog: MdDialog) { }

  ngOnInit() {
    this.minDate = new Date();
    this.providerServiceMapID = this.commonDataService.current_service.serviceID;
    this.createdBy = this.commonDataService.uname;
    this.userId = this.commonDataService.uid;
    this.notificationService.getNotificationTypes(this.providerServiceMapID)
    .subscribe((response) => {
      console.log(response);
      this.notificationTypes = response.data;
    },
    (error) => {
      console.log(error);
    });
    this.notificationService.getRoles(this.providerServiceMapID)
    .subscribe((response) => {
      console.log(response);
      this.roleObjArray = response.data;
      for (var i = 0; i < this.roleObjArray.length; i++) {
        this.roleIDs.push(this.roleObjArray[i].RoleID);
      }
    },
    (error) => {
      console.log(error);
    });


    this.notificationService.getServiceProviderID(this.providerServiceMapID).subscribe(response=>this.getProviderIDSuccess(response));

  }

  notification_type:any;
  show:any=0;
  checkNotificationType(notification_type)
  {
    if(notification_type.toUpperCase()==="Language Message".toUpperCase())
    {
      this.show=1;
    }
    else if(notification_type.toUpperCase()==="User Message".toUpperCase()||notification_type.toUpperCase()==="User Ratings".toUpperCase())
    {
      this.show=2;
    }
    else if(notification_type.toUpperCase()==="Location Message".toUpperCase())
    {
      this.show=3;
    }
    else
    {
      this.show=0;
    }
  }

  getProviderIDSuccess(response)
  {
    this.serviceProviderID=response.serviceProviderID;
    console.log(this.serviceProviderID,"SP_ID");
    this.serviceID=response.serviceID;
    this.stateID=response.stateID;
    // invoke these all
    this.getAllLanguages();
    this.getOffices(this.serviceProviderID,this.stateID,this.serviceID);
    this.getUsers(this.providerServiceMapID);
  }

  getAllLanguages()
  {
    this.notificationService.getLanguages().subscribe(response=>this.getLanguageSuccessHandeler(response));
  }

  languages:any=[];
  users:any=[];
  offices:any=[];
  getLanguageSuccessHandeler(response)
  {
    console.log(response,"Languages");
    this.languages=response;

  }

  getOffices(providerID,stateID,serviceID)
  {
    this.notificationService.getOffices(providerID,stateID,serviceID).subscribe(response=>this.getOfficesSuccessHandeler(response));
  }

  getOfficesSuccessHandeler(response)
  {
    console.log(response,"offices");
    this.offices=response;
  }

  getUsers(psmID)
  {
    this.notificationService.getUsersByProviderID(psmID).subscribe(response=>this.getUsersSuccessHandeler(response));
  }

  getUsersSuccessHandeler(response)
  {
    console.log(response,"users");
    this.users=response;
  }

  createNotification() {
    let dialog = this.dialog.open(NotificationsDialogComponent, {
      disableClose: true,
      data: {
        notificationTypes: this.notificationTypes,
        roleObjArray: this.roleObjArray
      }
    });
    dialog.afterClosed()
    .subscribe((data) => {
      if (data) {
        this.notificationService.createNotification(data)
        .subscribe((response) => {
          console.log(response);
          if (response.data.length > 0) {
            let dialog = this.dialog.open(MessageDialogComponent, {
              data: {
                message: "Successfully created notification",
                type: "Message"
              }
            });
                // this.notificationService.getSupervisorNotifications(this.notificationPostData)
                //   .subscribe((response) => {
                //     this.notifications = response.data;
                //     console.log(this.notifications);
                //   },
                //   (error) => {
                //     this.alertMessage.alert(error.status);
                //   });
              }
            },
            (error) => {
              console.log(error);
              let dialog = this.dialog.open(MessageDialogComponent, {
                data: {
                  message: "Error in creating notification",
                  type: "Message"
                }
              });
            });
      }
    });
  }
  onSubmitShowForm() {
    console.log(this.showNotificationForm.value);
    // console.log(new Date((this.showNotificationForm.value.startDate) - 1 * (this.showNotificationForm.value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z");
    this.onConfigSubmit = true;

    let roleIDs=undefined;
    if(this.show===0)
    {
    roleIDs=(this.showNotificationForm.value.roles == "") ? this.roleIDs : this.showNotificationForm.value.roles;
    }

    let languageIDs=undefined;
    if(this.show===1)
    {
    languageIDs=(this.showNotificationForm.value.Languages == "") ? languageIDs : this.showNotificationForm.value.Languages;
    }

    let workingLocationIDs=undefined;
    if(this.show===3)
    {
    workingLocationIDs=(this.showNotificationForm.value.Offices == "") ? workingLocationIDs : this.showNotificationForm.value.Offices;
    }

    let userIDs=undefined;
    if(this.show===2)
    {
    userIDs=[(this.showNotificationForm.value.Users == "") ? userIDs : this.showNotificationForm.value.Users];
    }


    this.notificationPostData = {
      "providerServiceMapID": this.providerServiceMapID,
      "notificationTypeID": this.showNotificationForm.value.notificationType,
      "roleIDs":roleIDs,
      "userIDs":userIDs,
      "workingLocationIDs":workingLocationIDs,
      "languageIDs":languageIDs,
      "validStartDate": new Date((this.showNotificationForm.value.startDate) - 1 * (this.showNotificationForm.value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z",
      "validEndDate": new Date((this.showNotificationForm.value.endDate) - 1 * (this.showNotificationForm.value.endDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T23:59:59.999Z"
    };
    console.log(JSON.stringify(this.notificationPostData));
    this.notificationService.getSupervisorNotifications(this.notificationPostData)
    .subscribe((response) => {
      this.notifications = response.data;
      console.log(this.notifications);
    },
    (error) => {
      console.log(error);
    });
  }

  onEditClick(row, event) {
    event.preventDefault();
    let dialog = this.dialog.open(EditNotificationsComponent, {
      data: row,
      disableClose: true
    });
    dialog.afterClosed()
    .subscribe((data) => {
      if (data) {
        this.notificationService.updateNotification(data)
        .subscribe((response) => {
          console.log(response);
          if (response.data != {}) {
            let dialog = this.dialog.open(MessageDialogComponent, {
              data: {
                message: "Successfully edited notification",
                type: "Message"
              }
            });
            this.notificationService.getSupervisorNotifications(this.notificationPostData)
            .subscribe((response) => {
              this.notifications = response.data;
            },
            (error) => {
              this.alertMessage.alert(error.status);
            });
          }
        },
        (error) => {
          console.log(error);
          let dialog = this.dialog.open(MessageDialogComponent, {
            data: {
              message: "Error in editing notification",
              type: "Message"
            }
          });
        })
      }
    })
  }
  blockey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }

}
