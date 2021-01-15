import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Contact } from 'src/app/shared/models/contact';
import { SmsService } from 'src/app/sms.service';
import { MatStepper } from '@angular/material/stepper';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-app-setup',
  templateUrl: './app-setup.component.html',
  styleUrls: ['./app-setup.component.scss'],
})
export class AppSetupComponent implements OnInit {
  reviewContactsStep = false;
  getContactsStep = false;
  contactsByPhonenumbers: Contact[] = [];
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  pageSize = 10;
  pageSizeOptions: number[] = [25, 50, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  constructor(private smsService: SmsService) {}

  ngOnInit(): void {}

  getContacts(stepper: MatStepper) {
    console.log('Clicked');
    this.smsService.getContacts().subscribe((res) => {
      this.smsService.contacts = res;
      this.convertContactsToNumberBased(res);
      this.getContactsStep = true;
      stepper.next();
    });
  }

  convertContactsToNumberBased(contacts: Contact[]) {
    contacts.forEach((contact) => {
      if (
        typeof contact.phoneNumbers === 'object' &&
        contact.phoneNumbers !== null
      ) {
        const newContact: Contact = {
          id: contact.id,
          name: contact.name,
          owner: contact.owner,
          phoneNumbers: '',
        };
        // :fire
        contact.phoneNumbers.forEach((number) => {
          newContact.phoneNumbers =
            newContact.phoneNumbers === ''
              ? number
              : newContact.phoneNumbers + ' | ' + number;
        });

        this.contactsByPhonenumbers.push(newContact);
        this.contactsByPhonenumbers.slice();
      } else {
        this.contactsByPhonenumbers.push(contact);
      }
    });
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput
        .split(',')
        .map((str) => +str);
    }
  }
}
