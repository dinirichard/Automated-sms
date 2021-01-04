import { ContactDoc } from './contact.model';
import { UserDoc } from './user.model';

export class User {
	id: string;
	firstName: string;
	lastName: string;
	name: string;
	photoUrl: string;
	contacts: ContactDoc[];

	constructor(doc: UserDoc) {
		this.id = doc.id;
		this.firstName = doc.firstName;
		this.lastName = doc.lastName;
		this.name = doc.photoUrl;
		this.contacts = doc.contacts;
	}
}
