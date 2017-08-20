import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor'


@Injectable()
export class loginService {
  _baseURL = this._config.getCommonBaseURL();
  _userAuthURL = this._baseURL + 'user/userAuthenticate/';
  _forgotPasswordURL = this._baseURL + 'user/forgetPassword/';
  constructor(
    private _http: InterceptedHttp,
    private _config: ConfigService
  ) { }

  public authenticateUser(uname: any, pwd: any): Observable<any> {
    return this._http.post(this._userAuthURL, { 'userName': uname, 'password': pwd })
      .map(this.extractData)
      .catch(this.handleError);
  };

  getSecurityQuestions(uname: any): Observable<any> {

    return this._http.post(this._forgotPasswordURL, { 'userName': uname })
      .map(this.extractData)
      .catch(this.handleError);
  };


  private extractData(response: Response) {
    if (response.json().data) {
      return response.json().data;
    } else {
      return Observable.throw(response);
    }
  };

  private handleError(error: Response | any) {
    return Observable.throw(error.json());

  };
};



