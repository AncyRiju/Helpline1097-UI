import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from "../config/config.service";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class loginService
{
	_baseURL = this._config.getCommonBaseURL();
	_userAuthURL = this._baseURL + "user/userAuthenticate/";
	_forgotPasswordURL = this._baseURL + "user/forgetPassword/";
	constructor(
		private _http: Http,
		private _config: ConfigService
	) { }

	public authenticateUser = function ( uname: any, pwd: any )
	{
		return this._http.post( this._userAuthURL, { 'userName': uname, 'password': pwd } )
			.map( this.extractData )
			.catch( this.handleError );
	};

	getSecurityQuestions ( uname: any ): Observable<any>
	{

		return this._http.post( this._forgotPasswordURL, { 'userName': uname } )
			.map( this.extractData )
			.catch( this.handleError );
	};


	private extractData ( res: Response )
	{
		// console.log("inside extractData:"+JSON.stringify(res.json()));
		// let body = res.json();
		//return body.data || {};
		return res.json();
	};

	private handleError ( error: Response | any )
	{
		// In a real world app, you might use a remote logging infrastructure
		let errMsg: string;
		if ( error instanceof Response )
		{
			const body = error.json() || '';
			const err = body.error || JSON.stringify( body );
			errMsg = `${ error.status } - ${ error.statusText || '' } ${ err }`;
		} else
		{
			errMsg = error.message ? error.message : error.toString();
		}
		console.error( errMsg );
		return Observable.throw( errMsg );
	};
};



