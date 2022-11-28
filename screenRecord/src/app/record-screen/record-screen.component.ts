import { ElementRef } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-record-screen',
  templateUrl: './record-screen.component.html',
  styleUrls: ['./record-screen.component.sass']
})
export class RecordScreenComponent implements OnInit {

  MediaRecorder:any;
  navigator = <any>navigator;
  recording: any;
  blobFile:any;
  @ViewChild('videoPlayer') videoplayer: ElementRef;
  @ViewChild('recorderPlayer') recPlayer: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;

  recorder: any;
  
  showRecPlayer = false;
  


  constructor() { }


  ngOnInit() {
  }

  recordScreen(){

let data = [];

    this.recording = this.navigator.mediaDevices.getDisplayMedia({
      video: {
          // mediaSource: true,
      },
      audio: true,
  })
      .then(async (e) => {
    
          // For recording the mic audio
          let audio = await navigator.mediaDevices.getUserMedia({ 
              audio: true, video: false })
    
          // Assign the recorded mediastream to the src object 
          this.videoplayer.nativeElement.srcObject = e;
    
          // Combine both video/audio stream with MediaStream object
          let combine = new MediaStream([...e.getTracks(), ...audio.getTracks()])
    
          /* Record the captured mediastream
             with MediaRecorder constructor */
          this.recorder = new MediaRecorder(combine);
    
          // Starts the recording when clicked
          this.recorder.start();
          alert("recording started")
    
          // For a fresh start
          data = []
     
          /* Push the recorded data to data array 
            when data available */
          this.recorder.ondataavailable = (e) => {
              data.push(e.data);
          };
    
          this.recorder.onstop = () => {
    
              /* Convert the recorded audio to 
                 blob type mp4 media */
              let blobData = new Blob(data, { type: 'video/mp4' });
    
              // Convert the blob data to a url
              let url = URL.createObjectURL(blobData)

              this.blobFile = blobData;
    
              // Assign the url to the output video tag and anchor 
              this.recPlayer.nativeElement.src = url
              this.downloadLink.nativeElement.href = url
          };



      });
  }


  stopRecoding(){
    this.recorder.stop();
    this.showRecPlayer = true;
  }

  uploadFileToDrive(){
    this.upload();
  }

  upload() {


    let newDate = new Date();

    console.log(this.blobFile);
    // console.log(); return 0;
    // @ts-ignore
    let uploadFile_name = "screen_capture_" + newDate.getMilliseconds();
    // set file metadata
    var metadata = {
        name: uploadFile_name+".mp4",
        mimeType: 'video/mp4',
        parents: [localStorage.getItem('folder_id')]
    };
    var formData = new FormData();
    formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    // set file as blob formate
    formData.append("file", this.blobFile);
    fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: 'POST',
        headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('acces_token') }),
        body: formData
    }).then(function (response) {
      console.log(response)
        return response.json();
    }).then(function (value) {
        console.log(value);
        // file is uploaded
    });
  }

}
