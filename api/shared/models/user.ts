import { Contact } from './contact';
import { ContactDoc } from './contact.model';
import { UserDoc } from './user.model';

export class User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	name: string;
	photoUrl: string;
	setupComplete: boolean;
	contacts: Contact[];

	constructor(doc: UserDoc) {
		this.id = doc.id;
		this.email = doc.email;
		this.firstName = doc.firstName;
		this.lastName = doc.lastName;
		this.name = doc.name;
		this.photoUrl = doc.photoUrl;
		this.setupComplete = this.setupComplete;

		if (doc.contacts.length > 0 && typeof doc.contacts[0] !== 'string') {
			this.contacts = doc.contacts.map((x) => {
				return {
					id: x.id,
					name: x.name,
					emailAddresses: x.emailAddresses,
					phoneNumbers: x.phoneNumbers,
					owner: doc.id
				} as Contact;
			});
		}
	}
}
