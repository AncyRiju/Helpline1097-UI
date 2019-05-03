import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { Router } from '@angular/router';
// import { Cookie } from 'ng2-cookies/ng2-cookies';
import { loginService } from '../services/loginService/login.service';
import { ConfigService } from '../services/config/config.service';
import { CzentrixServices } from './../services/czentrix/czentrix.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { PlatformLocation } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ListnerService } from './../services/common/listner.service';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../services/authentication/auth.service';
import { EmergencyContactsViewModalComponent } from '../emergency-contacts-view-modal/emergency-contacts-view-modal.component';
import { MdDialog } from '@angular/material';
import { AgentForceLogoutComponent } from '../agent-force-logout/agent-force-logout.component';
import { HttpServices } from "../services/http-services/http_services.service";
import { ViewVersionDetailsComponent } from '../view-version-details/view-version-details.component';

@Component({
  selector: 'app-multi-role-screen',
  templateUrl: './multi-role-screen.component.html',
  styleUrls: ['./multi-role-screen.component.css']
})
export class MultiRoleScreenComponent implements OnInit {
  data: any;
  current_service: any;
  current_role: any;
  id: any;
  userName: any = '';
  ctiHandlerURL: any;
  loginUrl: String = this._config.getCommonLoginUrl();
  licenseURL: String = this._config._getOpenCommonBaseURL() + "license.html";
  barMinimized: boolean = true;
  checkRole = true;
  hideBar: boolean = false;
  subscription: Subscription;
  hideHeader: boolean = true;
  label: any = {};
  showContacts: boolean = false;
  api_versionDetails: any;
  version: any;
  uiVersionDetails: any;
  commitDetails: any;
  commitDetailsPath: any = "assets/git-version.json";

  constructor(public dataSettingService: dataService, private _config: ConfigService, location: PlatformLocation,
    public router: Router, private authService: AuthService, private _loginService: loginService, private Czentrix: CzentrixServices,
    private alertMessage: ConfirmationDialogsService, private sanitizer: DomSanitizer, private listnerService: ListnerService, private dialog: MdDialog,
    public HttpServices: HttpServices) {
    location.onPopState((e: any) => {
      console.log(e);
      window.history.forward();

    })
    this.subscription = this.listnerService.cZentrixGetData().subscribe(flag => { this.hideCZentix(flag) }, (err) => {
      this.alertMessage.alert('Error in passing Data');
    });
  }
  ngOnInit() {
    this.dataSettingService.sendHeaderStatus.subscribe((data) => { this.setHeaderName(data) });

    this.data = this.dataSettingService.Userdata;
    this.current_role = (this.dataSettingService.current_role) ? this.dataSettingService.current_role.RoleName : '';
    this.current_service = (this.dataSettingService.current_service) ? this.dataSettingService.current_service.serviceName : '';
    this.id = this.dataSettingService.cZentrixAgentID ?
      this.dataSettingService.cZentrixAgentID : (this.dataSettingService.Userdata.agentID ?
        this.dataSettingService.Userdata.agentID : undefined);
    this.dataSettingService.roleSelected.subscribe((obj) => {
      this.id = obj['id'];
      this.current_role = obj['role'];
      this.current_service = obj['service'];
      const url = this._config.getTelephonyServerURL() + 'bar/cti_handler.php?e=' + this.id;
      console.log('url = ' + url);
      this.ctiHandlerURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    })
    this.hideHeader = true;
    const url = this._config.getTelephonyServerURL() + 'bar/cti_handler.php';
    console.log('url = ' + url);
    this.ctiHandlerURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    console.log('url = ' + url);
    this.userName = this.dataSettingService.Userdata.userName;

    this.getCommitDetails();
    // this.router.navigate(['/MultiRoleScreenComponent/roleSelection']);
    // const userObj = JSON.parse(Cookie.get('userID'));
    // if (userObj) {
    //   this._loginService.getUserDetailsByID(userObj.userID).subscribe((response) => {
    //     if (response.isAuthenticated === true && response.Status === 'Active') {

    //       this.userName = response.userName;
    //       this.router.navigate(['/MultiRoleScreenComponent/dashboard']);
    //     } else {
    //       location.assign(this.loginUrl);
    //       Cookie.deleteAll();

    //     }
    //   }, (err) => {
    //   })
    // } else {
    //   location.assign(this.loginUrl);
    //   Cookie.deleteAll();
    // }
  }
  // logOut() {
  //   this.router.navigate([''])
  //   // Cookie.deleteAll();
  //   // location.assign(this.loginUrl);
  // }
  setHeaderName(data) {
    this.label = data;
    if (this.label.includes('Dashboard')) {
      this.showContacts = true;
    }
    else {
      this.showContacts = false;
    }
  }
  logOut() {
    this.ipSuccessLogoutHandler(this.dataSettingService.loginIP);


  }
  minimizeBar() {
    this.barMinimized = true;
  }
  toggleBar() {
    this.barMinimized = !this.barMinimized;

  }
  ipSuccessLogoutHandler(response) {
    this.router.navigate(['']);
    this.authService.removeToken();
    this.Czentrix.agentLogout(this.dataSettingService.cZentrixAgentID, response).subscribe((res) => {

      if (res.response.status.toUpperCase() !== 'FAIL') {
        sessionStorage.removeItem('isOnCall');
        this.router.navigate(['']);
        sessionStorage.removeItem('apiman_key');
        this.authService.removeToken();

      } else {
        sessionStorage.removeItem('isOnCall');
        this.router.navigate(['']);
        sessionStorage.removeItem('apiman_key');
        this.authService.removeToken();

        // this.alertMessage.alert('Czentrix Agent Not Logged In');
      }
    }, (err) => {
      sessionStorage.removeItem('isOnCall');
      this.router.navigate(['']);
      this.authService.removeToken();

      // this.alertMessage.alert(err.errorMessage,'error');
    });
  }
  hideCZentix(flag: any) {
    if (flag.eventCzentrix.hideBar === true) {
      this.hideBar = false;
    } else if (flag.eventCzentrix.innerPage === true) {
      this.hideHeader = false;
    } else if (flag.eventCzentrix.innerPage === false) {
      this.hideHeader = true;
    } else if (flag.eventCzentrix.hideBar === false) {
      this.hideBar = true;
    }
  }
  showEmergencyContacts() {
    this.dialog.open(EmergencyContactsViewModalComponent, {
      width: '700px',
      //height: '550px'
      disableClose: false
    });
  }

  agentForceLogout() {
    this.dialog.open(AgentForceLogoutComponent, {
      width: '500px',
      disableClose: false
    });
  }
  getCommitDetails() {

    let Data = this.commitDetailsPath;
    this.HttpServices.getCommitDetails(this.commitDetailsPath).subscribe((res) => this.successhandeler1(res), err => this.successhandeler1(err));
  }
  successhandeler1(response) {
    console.log(response, "language response");
    this.commitDetails = response;
    this.uiVersionDetails = {
      'Version': this.commitDetails['version'],
      'Commit': this.commitDetails['commit']
    }
    console.log('uiVersionDetails', this.uiVersionDetails);
  }
 viewVersionDetails() {
    this._loginService.getApiVersionDetails().subscribe((apiResponse) => {
      console.log("apiResponse", apiResponse);
      if (apiResponse.statusCode == 200) {
        let api_versionDetails = {
          'Version': apiResponse.data['git.build.version'],
          'Commit': apiResponse.data['git.commit.id']
        }
        if (api_versionDetails) {
          this.openVersionDialogComponent(api_versionDetails);
        }
      }
    }), (err) => {
      console.log(err, "error");
    }
  }
  openVersionDialogComponent(api_versionDetails) {
    this.dialog.open(ViewVersionDetailsComponent, {
      width: "80%",
      data: {
        uiversionDetails: this.uiVersionDetails,
        api_versionDetails: api_versionDetails
      }
    })
  }
}
