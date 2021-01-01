import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-app-setup',
  templateUrl: './app-setup.component.html',
  styleUrls: ['./app-setup.component.scss'],
})
export class AppSetupComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor() {}

  ngOnInit(): void {}
}
