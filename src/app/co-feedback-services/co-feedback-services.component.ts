import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service'
import { LocationService } from "../services/common/location.service";
import { CoFeedbackService } from "../services/coService/co_feedback.service";
import { FeedbackTypes } from "../services/common/feedbacktypes.service";
import { dataService } from "../services/dataService/data.service"

@Component( {
	selector: 'app-co-feedback-services',
	templateUrl: './co-feedback-services.component.html',
	styleUrls: [ './co-feedback-services.component.css' ]
} )
export class CoFeedbackServicesComponent implements OnInit
{
	@Output() feedbackServiceProvided: EventEmitter<any> = new EventEmitter<any>();
	constructor(
		private _userBeneficiaryData: UserBeneficiaryData,
		private _locationService: LocationService,
		private _coFeedbackService: CoFeedbackService,
		private _feedbackTypes: FeedbackTypes,
		private _savedData: dataService
	) { }

	showFormCondition: boolean = false;
	showTableCondition: boolean = true;
	feedbackServiceID: number = 4;
	selected_state: any;
	selected_district: any;
	selected_taluk: any;
	selected_sdtb: any;
	selected_institution: any;
	selected_designation: any;
	selected_feedbackType: any;
	selected_severity: any;
	selected_doi: any;

	feedbackDescription: any = "";
	beneficiaryRegID: any;
	userName: any;

	states: any = [];
	districts: any = [];
	taluks: any = [];
	blocks: any = [];
	institutes: any = [];
	designations: any = [];
	feedbackTypes: any = [];
	feedbackSeverities: any = [];

	showForm ()
	{
		this.showFormCondition = true;
		this.showTableCondition = false;
	}

	showTable ()
	{
		this.showFormCondition = false;
		this.showTableCondition = true;
	}

	ngOnInit ()
	{
		this.beneficiaryRegID = this._savedData.beneficiaryData.beneficiaryRegID;
		this.userName = this._savedData.uname;
		this._userBeneficiaryData.getUserBeneficaryData()
			.subscribe( response => this.SetUserBeneficiaryFeedbackData( response ) );
		this._coFeedbackService.getDesignations()
			.subscribe( response => this.setDesignation( response ) );
		this._feedbackTypes.getFeedbackTypesData()
			.subscribe( response => this.setFeedbackTypes( response ) );
		this._feedbackTypes.getFeedbackSeverityData()
			.subscribe( response => this.setFeedbackSeverity( response ) );
		this._coFeedbackService.getFeedbackHistoryById( this.beneficiaryRegID )
			.subscribe( response => this.setFeedbackHistoryByID( response ) );
	}

	SetUserBeneficiaryFeedbackData ( regData: any )
	{
		if ( regData.states )
		{
			this.states = regData.states;
		}
	}

	GetDistricts ( state: number )
	{
		this.districts = [];
		this.taluks = [];
		this.blocks = [];
		this.institutes = [];
		this._locationService.getDistricts( state )
			.subscribe( response => this.SetDistricts( response ) );
	}
	SetDistricts ( response: any )
	{
		this.districts = response;
	}
	GetTaluks ( district: number )
	{
		this.taluks = [];
		this.blocks = [];
		this.institutes = [];
		this._locationService.getTaluks( district )
			.subscribe( response => this.SetTaluks( response ) );
	}
	SetTaluks ( response: any )
	{
		this.taluks = response;
	}
	GetBlocks ( taluk: number )
	{
		this.blocks = [];
		this.institutes = [];
		this._locationService.getBranches( taluk )
			.subscribe( response => this.SetBlocks( response ) );
	}
	SetBlocks ( response: any )
	{
		this.blocks = response;
	}

	GetInstitutes ()
	{
		this.institutes = [];
		let object = { "stateID": this.selected_state, "districtID": this.selected_district, "districtBranchMappingID": this.selected_sdtb };
		this._locationService.getInstituteList( object )
			.subscribe( response => this.SetInstitutes( response ) );
	}
	SetInstitutes ( response: any )
	{
		this.institutes = response.institute;
	}

	// getDesignation ( val: any )
	// {
	// 	console.log( "its" + val );
	// 	if ( val === '1' )
	// 	{
	// 		this.designations = [ "d1", "d2", "d3" ];
	// 	}
	// 	if ( val === '2' )
	// 	{
	// 		this.designations = [ "d1.1", "d2.2", "d3.3" ];
	// 	}
	// 	if ( val === '3' )
	// 	{
	// 		this.designations = [ "d1.1.1", "d2.2.2", "d3.3.3" ];
	// 	}
	// }
	setDesignation ( response: any )
	{
		this.designations = response;
	}
	setFeedbackTypes ( response: any )
	{
		this.feedbackTypes = response;
	}

	setFeedbackSeverity ( response: any )
	{
		this.feedbackSeverities = response;
	}

	feedbacksArray: any = [];
	modalArray: any = [];

	feedbackcounter: any = 1000;

	generatefeedbackID ()
	{
		return this.feedbackcounter++;
	}

	// submitFeedback ( object: any )
	submitFeedback ()
	{

		// console.log( object, this.feedbackDescription.value );
		// console.log( object );
		//"serviceAvailDate": object.doi,
		if ( this.selected_doi )
		{
			this.selected_doi = new Date(( this.selected_doi ) - 1 * ( this.selected_doi.getTimezoneOffset() * 60 * 1000 ) ).toJSON();
		}
		let feedbackObj = [ {
			"institutionID": this.selected_institution,
			"designationID": this.selected_designation,
			"severityID": this.selected_severity,
			"feedbackTypeID": this.selected_feedbackType,
			"feedback": this.feedbackDescription,
			"beneficiaryRegID": this.beneficiaryRegID,
			"serviceAvailDate": this.selected_doi,
			"serviceID1097": this.feedbackServiceID,
			"userID": this._savedData.uid,
			"createdBy": this.userName,
			"benCallID": this._savedData.callData.benCallID,
			"1097ServiceID": 1
		}];

		this._coFeedbackService.createFeedback( feedbackObj )
			.subscribe( response => this.showtable( response, feedbackObj ) );
	}
	showtable ( response, obj )
	{
		console.log( 'after registering feedback', response );
		var object = {
			"feedbackID": "",
			"feedback": "",
			"severityID": "",
			"feedbackTypeID": "",
			"createdBy": "",
			"feedbackStatusID": ""
		};
		this.showTable();
		// var fdbkID = response.feedBackId;//this.generatefeedbackID();
		// object.id = fdbkID;
		// object.dor = new Date();
		// object.status = 'open';
		// object.agentID = "CO0111120";
		// console.log( object );
		// this.feedbacksArray.push( object );
		object.feedbackID = response.feedBackId;
		object.feedback = response.feedback;
		object.severityID = response.severityID;
		object.feedbackTypeID = response.feedbackTypeID;
		object.createdBy = response.createdBy;
		object.feedbackStatusID = response.feedbackStatusID;
		this.feedbacksArray.push( object );

	}

	modalData ( object )
	{
		this.modalArray.push( object );

		alert( "your data is" + object );

	}

	setFeedbackHistoryByID ( response: any )
	{
		console.log( 'the response for feedback history is', response );
		this.feedbacksArray = response;

	}


}

