import { people_v1 } from 'googleapis';
import { ContactDoc } from './contact.model';
import { UserDoc } from './user.model';

export class Contact {
	id: string;
	name: string;
	emailAddresses: string[];
	phoneNumbers: string[];
	owner: UserDoc;

	constructor(data?: people_v1.Schema$Person, document?: ContactDoc) {
		if (data.hasOwnProperty('names')) {
			this.name = data.names[0].displayName;

			if (data.hasOwnProperty('emailAddresses')) {
				this.emailAddresses = data.emailAddresses.map((email) => email.value);
			}

			if (data.hasOwnProperty('phoneNumbers')) {
				this.phoneNumbers = data.phoneNumbers.map(
					(phoneNumber) => phoneNumber.canonicalForm
				);
			}
		}
	}
}

export function transformContactData(data: people_v1.Schema$Person[]): Contact[] {
	const val: Contact[] = data.map((person) => new Contact(person));
	return val.filter((value) => value.name !== undefined);
}
