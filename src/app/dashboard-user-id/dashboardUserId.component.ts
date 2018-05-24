import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { CzentrixServices } from './../services/czentrix/czentrix.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';

@Component({
    selector: 'dashboard-user-id',
    templateUrl: './dashboardUserId.html',
})
export class DashboardUserIdComponent implements OnInit {
    current_service: any;
    current_role: any;
    status: any;
    constructor(
        public dataSettingService: dataService,
        public router: Router,
        private Czentrix: CzentrixServices,
        private message: ConfirmationDialogsService
    ) {
        this.current_service = this.dataSettingService.current_service.serviceName;
        this.current_role = this.dataSettingService.current_role.RoleName;

    };
    ngOnInit() {
        this.getAgentStatus()
    }
    getAgentStatus() {
        this.Czentrix.getAgentStatus().subscribe((res) => {
            if (res && res.data.stateObj.stateName) {
            this.status = res.data.stateObj.stateName;
            if (this.status.toUpperCase() === 'INCALL' || this.status.toUpperCase() === 'CLOSURE') {
                let CLI = res.data.cust_ph_no;
                let session_id = res.data.session_id;
                sessionStorage.setItem('isOnCall', 'yes');
                this.router.navigate(['/MultiRoleScreenComponent/InnerpageComponent', CLI, session_id, 'INBOUND']);
            } 
            // else {
            if (res.data.stateObj.stateType) {
                this.status += ' (' + res.data.stateObj.stateType + ')';
            }
            if(res.data.dialer_type.toUpperCase() == "PROGRESSIVE" )  {
                this.dataSettingService.inOutCampaign.next("1");
            }
            else if(res.data.dialer_type.toUpperCase() == "PREVIEW") {
                this.dataSettingService.inOutCampaign.next("0");
            }
        }
            // }

        }, (err) => {
            // this.message.alert(err.errorMessage,'error');
            console.log("CZ AGENT NOT LOGGED IN")
        })
    }
    // tslint:disable-next-line:eofline
}