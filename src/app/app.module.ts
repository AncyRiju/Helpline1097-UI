import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import
{
  MaterialModule,
  MdMenuModule,
} from '@angular/material';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { MdDatepickerModule } from '@angular/material';
import { MdInputModule } from '@angular/material';
import { MdNativeDateModule } from '@angular/material';


import { AppComponent } from './app.component';
// login components
import { loginContentClass } from './login/login.component';
import { ResetComponent } from './resetPassword/resetPassword.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { myPassword } from './directives/password/myPassword.directive';
import { myName } from './directives/name/myName.directive';
import { myMobileNumber } from './directives/MobileNumber/myMobileNumber.directive';
import { myEmail } from './directives/email/myEmail.directive';


// dashboard components
import { dashboardContentClass } from './dashboard/dashboard.component';

import { DashboardRowHeaderComponent } from './dashboard-row-header/dashboardRowHeader.component';
import { DashboardNavigationComponent } from './dashboard-navigation/dashboardNavigation.component';
import { DashboardUserIdComponent } from './dashboard-user-id/dashboardUserId.component';
import { ActivityThisWeekComponent } from './activity-this-week/activity-this-week.component';
import { AlertsNotificationComponent } from './alerts-notifications/alerts-notifications.component';
import { DailyTasksComponent } from './daily-tasks/daily-tasks.component';
import { NewsInformationsComponent } from './news-informations/news-informations.component';
import { RatingComponent } from './rating/rating.component';
import { WeatherWarningsComponent } from './weather-warnings/weather-warnings.component';

// multi role screen component
import { MultiRoleScreenComponent } from './multi-role-screen/multi-role-screen.component';

// innerpage components
import { InnerpageComponent } from './innerpage/innerpage.component';


import { CoCounsellingServicesComponent } from './co-counselling-services/co-counselling-services.component';
import { CoFeedbackServicesComponent } from './co-feedback-services/co-feedback-services.component';
import { CoInformationServicesComponent } from './co-information-services/co-information-services.component';
import { CoReferralServicesComponent } from './co-referral-services/co-referral-services.component';
import { BeneficiaryRegistrationComponent } from './beneficiary-registration/beneficiary-registration.component';
import { ServiceRoleSelectionComponent } from './service-role-selection/service-role-selection.component';
import { CoServicesComponent } from './co-services/co-services.component';
import { UpdatesFromBeneficiaryComponent } from './updates-from-beneficiary/updates-from-beneficiary.component';
import { ClosureComponent } from './closure/closure.component';
import { SetSecurityQuestionsComponent } from './set-security-questions/set-security-questions.component';


// material modules  

// admin components
import { SuperAdminComponent } from './super-admin/super-admin.component'
import { AdminServiceProviderComponent } from './admin-service-provider/admin-service-provider.component';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { AdminLanguageMasterComponent } from './admin-language-master/admin-language-master.component';
import { AdminRoleMasterComponent } from './admin-role-master/admin-role-master.component';
import { AdminServiceMasterComponent } from './admin-service-master/admin-service-master.component';
import { AdminScreenMasterComponent } from './admin-screen-master/admin-screen-master.component';
// services
import { loginService } from './services/loginService/login.service';
import { RegisterService } from './services/register-services/register-service';
import { dataService } from './services/dataService/data.service';
import { DashboardHttpServices } from './http-service/http-service.service';
import { SPService } from './services/adminServices/AdminServiceProvider/admin_service_provider.service';
import { UserService } from './services/adminServices/AdminUser/user.service';
import { LanguageService } from './services/adminServices/AdminLanguage/language.service';
import { RoleService } from './services/adminServices/AdminRole/Role.service';
import { ServicemasterService } from './services/adminServices/AdminService/servicemaster.service';
import { ScreenService } from './services/adminServices/AdminScreen/screen.service';
import { HttpServices } from './services/http-services/http_services.service';
import { UserBeneficiaryData } from './services/common/userbeneficiarydata.service'
import { LocationService } from "./services/common/location.service";
import { CoReferralService } from "./services/coService/co_referral.service";
import { CoFeedbackService } from "./services/coService/co_feedback.service";
import { FeedbackTypes } from "./services/common/feedbacktypes.service";
import { UpdateService } from "./services/update-services/update-service";
import { CallServices } from "./services/callservices/callservice.service";
import { ConfigService } from "./services/config/config.service"



@NgModule( {
  declarations: [
    AppComponent, dashboardContentClass, loginContentClass,
    ResetComponent, myPassword, InnerpageComponent, MultiRoleScreenComponent,
    DashboardRowHeaderComponent, DashboardNavigationComponent,
    DashboardUserIdComponent, ActivityThisWeekComponent,
    AlertsNotificationComponent, DailyTasksComponent, NewsInformationsComponent,
    RatingComponent, WeatherWarningsComponent, AdminServiceProviderComponent,
    myName, myMobileNumber, myEmail, CoCounsellingServicesComponent,
    CoFeedbackServicesComponent, CoInformationServicesComponent,
    CoReferralServicesComponent, BeneficiaryRegistrationComponent,
    ServiceRoleSelectionComponent, CoServicesComponent, UpdatesFromBeneficiaryComponent, ClosureComponent, SuperAdminComponent,
    AdminUserComponent, AdminLanguageMasterComponent, AdminRoleMasterComponent,
    AdminServiceMasterComponent, AdminScreenMasterComponent, SetSecurityQuestionsComponent, SetPasswordComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    MdMenuModule,
    MdDatepickerModule,
    MdNativeDateModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MdInputModule,
    RouterModule.forRoot( [
      {
        path: 'resetPassword',
        component: ResetComponent
      },
      {
        path: 'loginContentClass',
        component: loginContentClass
      },
      {
        path: 'InnerpageComponent',
        component: InnerpageComponent
      },
      {
        path: 'setQuestions',
        component: SetSecurityQuestionsComponent
      },
      {
        path: 'MultiRoleScreenComponent',
        component: MultiRoleScreenComponent,
        children: [
          {
            path: '',
            component: ServiceRoleSelectionComponent,
            outlet: 'postLogin_router'
          },
          {
            path: 'dashboard',
            component: dashboardContentClass,
            outlet: 'postLogin_router'
          },
          {
            path: 'superAdmin',
            component: SuperAdminComponent,
            outlet: 'postLogin_router'
          }
        ]
      },
      {
        path: 'setPassword',
        component: SetPasswordComponent
      },
      {
        path: '',
        redirectTo: '/loginContentClass',
        pathMatch: 'full'
      },
      {
        path: 'InnerpageComponent/:mobileNumber',
        component: InnerpageComponent
      },
    ] ) ],
  providers: [ loginService, dataService, DashboardHttpServices, SPService, RegisterService,
    UserService, LanguageService, RoleService, ServicemasterService, ScreenService, HttpServices,
    UserBeneficiaryData, LocationService, CoReferralService, CoFeedbackService, FeedbackTypes,
    UpdateService, CallServices, ConfigService ],
  bootstrap: [ AppComponent ]
} )

export class AppModule { }
