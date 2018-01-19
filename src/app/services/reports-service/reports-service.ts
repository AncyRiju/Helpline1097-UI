import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor';

@Injectable()
export class ReportsService {
  private getAllBySexualOrientationURL = this._config.getCommonBaseURL() + "crmReports/getAllBySexualOrientation";
  private getAllByGenderURL = this._config.getCommonBaseURL() + "crmReports/getAllByGender";
  private getAllByAgeGroupURL = this._config.getCommonBaseURL() + "crmReports/getAllByAgeGroup";
  private getAllReportsByDateURL = this._config.getCommonBaseURL() + "crmReports/getAllReportsByDate";
  private getCountsByPreferredLanguageURL = this._config.getCommonBaseURL() + "crmReports/getCountsByPreferredLanguage";

  constructor(
    private _http: Http,
    private _config: ConfigService,
    private httpInterceptor: InterceptedHttp
  ) { }

  getAllBySexualOrientation(data) {
    return this.httpInterceptor.post(this.getAllBySexualOrientationURL, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllByGender(data) {
    return this.httpInterceptor.post(this.getAllByGenderURL, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllByAgeGroup(data) {
    return this.httpInterceptor.post(this.getAllByAgeGroupURL, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllReportsByDate(data) {
    return this.httpInterceptor.post(this.getAllReportsByDateURL, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCountsByPreferredLanguage(data) {
    return this.httpInterceptor.post(this.getCountsByPreferredLanguageURL, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    if (res.json().data) {
      return res.json().data;
    } else {
      return Observable.throw(res.json());
    }
  };

  private customhandleError(error: Response | any) {
    return Observable.throw(error.json());

  };
  private handleError(error: Response) {
    return Observable.throw(error.json());
  };

}