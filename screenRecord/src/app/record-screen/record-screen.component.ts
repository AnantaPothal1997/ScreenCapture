import { ElementRef } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-record-screen',
  templateUrl: './record-screen.component.html',
  styleUrls: ['./record-screen.component.sass']
})
export class RecordScreenComponent implements OnInit {

  recording: any;
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

    this.recording = navigator.mediaDevices.getDisplayMedia({
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

}
