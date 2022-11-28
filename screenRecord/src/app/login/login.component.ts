import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  tokenClient:any;
  

  constructor(private router: Router) { }

  ngOnInit() {
    //call gapiload
    this.gapiLoaded()
  }

  loginWithGoogleAuth(){

    // call handle authclick 
    this.handleAuthClick();
  }

 gapiLoaded() {
    gapi.load('client', this.initializeGapiClient);
 }
 
async initializeGapiClient() {
    await gapi.client.init({
        apiKey: environment.API_KEY,
        discoveryDocs: environment.DISCOVERY_DOCS,
    });
    // gapiInited = true;
    // maybeEnableButtons();
}

handleAuthClick() {
  // @ts-ignore
  this.tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: environment.CLIENT_ID,
    scope: environment.SCOPES,
    callback: ''
  });

  this.tokenClient.callback = async (resp) => {
    console.log(resp)
      if (resp.error !== undefined) {
          throw (resp);
      }
      //set accees toke n to localstorage
      if(resp.access_token){
        localStorage.setItem('acces_token',resp.access_token);
        let folder_exist:any = this.checkFolder();
        console.log(folder_exist);


        if(!folder_exist){
          this.createFolder();
          console.log('folder created');
        }
        // this.router.navigate(['record']);
      }
      console.log('Sign-in Successful');
  };

  if (gapi.client.getToken() === null) {
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
      this.tokenClient.requestAccessToken({ prompt: '' });
  }
}

handleSignoutClick() {
  let token = gapi.client.getToken();
  if (token !== null) {
    // @ts-ignore
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken(null);
  }
}

 checkFolder() {
  // @ts-ignore
  gapi.client.drive.files.list({
      // give name of the folder to check
      'q': 'name = "Screen_Recorder"',
  }).then(function (response) {
      var files = response.result.files;
      if (files && files.length > 0) {
          for (var i = 0; i < files.length; i++) {
              var file = files[i];
              console.log('Folder Available');
              return true;
          }
      } else {
          // if folder not available
          console.log('Folder not available');
          return false;
      }
  })
}

createFolder() {
  var access_token = gapi.auth.getToken().access_token;
  var request = gapi.client.request({
      'path': 'drive/v2/files',
      'method': 'POST',
      'headers': {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + access_token,
      },
      'body': {
          'title': 'Screen_Recorder',
          'mimeType': 'application/vnd.google-apps.folder'
      }
  });
  request.execute(function (response) {
      // folder is created
      console.log(response);
  })
}

getAccesToken(){
  console.log(gapi.auth.getToken().access_token)
}

}
