import { Component, OnInit } from '@angular/core';
import { SupervisorCallTypeReportService } from '../services/supervisorServices/supervisor-calltype-reports-service.service';
import { dataService } from '../services/dataService/data.service';



@Component({
	selector: 'app-supervisor-calltype-reports',
	templateUrl: './supervisor-calltype-reports.component.html',
	styleUrls: ['./supervisor-calltype-reports.component.css']
})
export class SupervisorCalltypeReportsComponent implements OnInit {

	// ngmodels
	maxDate: Date;
	today: Date;


	callType: any;
	start_date: any;
	end_date: any;

	// arrays

	callTypes: any;
	filterCallListArray: any;

	// flags

	tableFlag: boolean;
	showPaginationControls: boolean;


	constructor(public _SupervisorCallTypeReportService: SupervisorCallTypeReportService,
		public commonDataService: dataService) {

		this.tableFlag = false;
		this.today = new Date();
		

		this.filterCallListArray = [];

	}

	ngOnInit() {
		this.maxDate = new Date();
		let requestObject = { 'providerServiceMapID': this.commonDataService.current_service.serviceID };
		this._SupervisorCallTypeReportService.getCallTypes(requestObject).subscribe((response: Response) => this.callTypes = this.successhandeler(response));
		this.showPaginationControls = false;
	}

	setTableFlag(val) {
		this.tableFlag = val;
		this.get_filterCallList();
	}

	get_filterCallList() {
		let requestObj = {
			"calledServiceID": this.commonDataService.current_service.serviceID,
			"callTypeID": this.callType,
			"filterStartDate": "",
			"filterEndDate": ""
		}

		if (this.start_date && this.end_date) {
			requestObj.filterStartDate = new Date((this.start_date) - 1 * (this.start_date.getTimezoneOffset() * 60 * 1000)).toJSON();
			requestObj.filterEndDate = new Date((this.end_date) - 1 * (this.end_date.getTimezoneOffset() * 60 * 1000)).toJSON();

		} else {
			requestObj.filterStartDate = undefined;
			requestObj.filterEndDate = undefined;
		}

		// write the api here to get filtercall list
		this._SupervisorCallTypeReportService.filterCallList(requestObj).subscribe(
			(response: Response) => this.filterCallListArray = this.successhandeler(response));
	}

	successhandeler(response) {
		console.log(response, "respinse call wala");
		if (response.length > 5) {
			this.showPaginationControls = true;
		}
		return response;
	}

}
