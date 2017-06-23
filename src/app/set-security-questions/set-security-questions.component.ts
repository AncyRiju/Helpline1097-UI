import { Component, OnInit } from '@angular/core';
import { dataService } from '../services/dataService/data.service';
import { HttpServices } from '../services/http-services/http_services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-set-security-questions',
  templateUrl: './set-security-questions.component.html',
  styleUrls: ['./set-security-questions.component.css']
})
export class SetSecurityQuestionsComponent implements OnInit {

  constructor(public getUserData:dataService,public http_calls:HttpServices,public router:Router) 
  { 
    
  }

  handleSuccess(response)
  {
    this.questions = response;
    console.log(this.questions);
  }
  handleError(response)
  {
    console.log('error',this.questions);
  }
  
  ngOnInit() {

    this.http_calls.getData("http://10.152.3.152:1040/Common/user/getsecurityquetions").subscribe(
      (response: any) => this.handleSuccess(response),
      (error: any) => this.handleError(error));

  }

  uid: any = this.getUserData.uid;
  passwordSection: boolean =false;
  questionsection: boolean = true;
  uname:any=this.getUserData.uname;

  switch()
  {
	  this.passwordSection = true;
	  this.questionsection = false;
  }



  question1: any = "";
  question2: any = "";
  question3: any = "";

  answer1: any = "";
  answer2: any = "";
  answer3: any = "";

  questions: any =[];
  selectedQuestions: any = [];

  updateQuestions(selectedques:any)
  {

  	if(this.selectedQuestions.indexOf(selectedques)== -1)
  	{
			this.selectedQuestions.push(selectedques);
			// this.questions.splice(this.questions.indexOf(selectedques), 1);
  	}
  	else
  	{
			alert('choose a different question... this question is already selected');
  	}
  }

  dataArray: any = [];

  setSecurityQuestions()
  {

    // in place of userID, we have to feed it , as of now its hardcoded only for neer
    console.log(this.selectedQuestions);
  	if(this.selectedQuestions.length==3)
  	{
			
      this.dataArray = [{
        "userID": this.uid,
        "questionID": this.question1,
        "answers": this.answer1,
        "mobileNumber": "1234567890",
        "createdBy": "neeraj"
      },
      {
        "userID": this.uid,
        "questionID": this.question2,
        "answers": this.answer2,
        "mobileNumber": "1234567890",
        "createdBy": "neeraj"
      },
      {
        "userID": this.uid,
        "questionID": this.question3,
        "answers": this.answer3,
        "mobileNumber": "1234567890",
        "createdBy": "neeraj"
      }
      ]
			// this.dataArray = {
			// 	username: this.uname,
			// 	one: {
			// 		"question": this.question1,
			// 		"answer": this.answer1
			// 	},
			// 	two: {
			// 		"question": this.question2,
			// 		"answer": this.answer2
			// 	},
			// 	three: {
			// 		"question": this.question3,
			// 		"answer": this.answer3
			// 	},

			// }
			console.log(JSON.stringify(this.dataArray));
			// alert("the data set is :" + this.dataObj);
			console.log(this.selectedQuestions);	

      this.http_calls.postData("http://10.152.3.152:1040/Common/user/saveUserSecurityQuesAns", this.dataArray).subscribe(
        (response: any) => this.handleQuestionSaveSuccess(response),
        (error: any) => this.handleQuestionSaveError(error));
			
  	}
    	else
    	{
  			alert("all 3 ques shud be diff");
    	}
	  
  
  	}

    handleQuestionSaveSuccess(response)
    {
      console.log('saved questions', response);
      this.switch();

    }
    handleQuestionSaveError(response)
    {
      console.log("question save error", response);
    }

  oldpwd: any;
  newpwd: any;
  confirmpwd: any;

  updatePassword(new_pwd)
  {
  	if(new_pwd===this.confirmpwd)
  	{

	 
    this.http_calls.postData(" http://10.152.3.152:1040/Common/user/setForgetPassword", { "userName": this.uname,"password":new_pwd }).
      subscribe(
      (response: any) => this.successCallback(response),
      (error: any) => this.errorCallback(error));

    alert("password is changed for user " + this.uname + " wd new pwd as : " + new_pwd);
  	}
  	else{
			alert("password dsnt match");
  	}
  }

  successCallback(response)
  {

    console.log(response);
    this.router.navigate(['/loginContentClass']);
  }
  errorCallback(response)
  {
    console.log(response);
  }

}
