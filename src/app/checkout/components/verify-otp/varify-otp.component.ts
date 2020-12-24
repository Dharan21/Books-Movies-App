import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-verify-otp',
  templateUrl: 'verify-otp.component.html',
  styleUrls: ['verify-otp.component.css']
})
export class VerifyOtpComponent {

  otp = '';
  isTrue: boolean;
  firstClick = false;
  @Output() confirmed = new EventEmitter<boolean>();

  verifyOTP() {
    this.firstClick = true;
    if (this.otp === '778899') {
      this.isTrue = true;
      this.confirmed.emit(true);
    } else {
      this.isTrue = false;
    }
  }
}
