import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SmsService } from 'src/app/sms.service';

@Component({
  selector: 'app-app-setup',
  templateUrl: './app-setup.component.html',
  styleUrls: ['./app-setup.component.scss'],
})
export class AppSetupComponent implements OnInit {
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private smsService: SmsService) {}

  ngOnInit(): void {}

  getContacts() {
    console.log('Clicked');
    this.smsService.getContacts();
  }
}
