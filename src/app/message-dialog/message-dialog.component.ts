import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent implements OnInit {

  constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<MessageDialogComponent>) { }

  ngOnInit() {
  	console.log(this.data,"DATA IN MESSAGE DIALOG WINDOW");
  	// this.checkForURL(this.data.message);
    this.checkForURL("Hi bro, kindly visit my new sites www.yahala.java.en www.piramal.gov.in, www.piramal.gov.in  www.yahoo.com,www.google.com,https://www.google.com");

  }

  result=[];


  urls=[];

  checkForURL(string)
  {
  	// var matches=[];
  	// matches=string.match(/\bhttp[s,]?:\/\/\S+/gi);
  	// console.log("matches",matches);
   //  if(matches) {
   //    if(matches.length>0)
   //    {
   //      this.urls=matches;
   //    }
   //  }
   //  else {
   //    matches = [];
   //  }

   var request_array=string.split(" ");
   console.log("first array split",request_array);

   for(let i=0;i<request_array.length;i++)
   {
    var req_array=request_array[i].split(",");
    console.log("second array split",req_array);
    for(let z=0;z<req_array.length;z++)
    {
      if(req_array[z].startsWith("www") && (req_array[z].endsWith(".com")||req_array[z].endsWith(".co")||req_array[z].endsWith(".in")))
      {
        this.result.push(req_array[z]);
      }
      else if(req_array[z].startsWith("WWW")&& (req_array[z].endsWith(".com")||req_array[z].endsWith(".co")||req_array[z].endsWith(".in")))
      {
        this.result.push(req_array[z]);
      }
      else if(req_array[z].startsWith("https")&& (req_array[z].endsWith(".com")||req_array[z].endsWith(".co")||req_array[z].endsWith(".in")))
      {
        this.result.push(req_array[z]);
      }
      else if(req_array[z].startsWith("HTTPS")&& (req_array[z].endsWith(".com")||req_array[z].endsWith(".co")||req_array[z].endsWith(".in")))
      {
        this.result.push(req_array[z]);
      }
      else if(req_array[z].startsWith("http")&& (req_array[z].endsWith(".com")||req_array[z].endsWith(".co")||req_array[z].endsWith(".in")))
      {
        this.result.push(req_array[z]);
      }
      else if(req_array[z].startsWith("http")&& (req_array[z].endsWith(".com")||req_array[z].endsWith(".co")||req_array[z].endsWith(".in")))
      {
        this.result.push(req_array[z]);
      }
    }

  }


  console.log(this.result,"RESULT SET OF URLS");
  if(this.result.length>0)
  {
    this.urls=this.result;
  }

}

}
