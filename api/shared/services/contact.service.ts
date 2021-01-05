import { Context } from '@azure/functions';
import { ContactModel, ContactDoc } from '../models/contact.model';
import { UserService } from '../services/user.service';
import { UserDoc } from '../models/user.model';
import { connect } from '../mongo';
import * as mongoose from 'mongoose';
import { Contact } from '../models/contact';

export class ContactService {
	user: UserDoc;
	userService: UserService;
	contacts: Contact[];

	constructor() {
		this.userService = new UserService();
	}

	mongoRun(context) {}

	async getContacts(context: Context): Promise<Contact[]> {
		await connect()
			.then(() => context.log('Connection to CosmosDB successful'))
			.catch((err) => context.log(err, 'Connection to CosmosDB NOT successful'));

		await this.userService
			.getUser(context)
			.then(async (res) => (this.user = await res))
			.catch((err) => {
				this.checkServerError(context, err);
			});

		await this.user.populate('contacts').execPopulate();

		const contacts = this.user.contacts.map((x) => {
			return {
				id: x.id,
				name: x.name,
				emailAddresses: x.emailAddresses,
				phoneNumbers: x.phoneNumbers,
				owner: this.user.id
			} as Contact;
		});

		context.res = {
			status: 200,
			body: contacts
		};

		return this.contacts;
	}

	async saveContact(context: Context) {
		context.log('Env: ', process.env.accountName);

		await connect()
			.then(() => context.log('Connection to CosmosDB successful'))
			.catch((err) => context.log(err, 'Connection to CosmosDB NOT successful'));

		await this.userService
			.getUser(context)
			.then((res) => {
				this.user = res;
			})
			.catch((err) => {
				this.checkServerError(context, err);
			});

		this.contacts = context.res.body;

		let contactsModels: ContactDoc[] = [];
		let result: ContactDoc;

		const newContactDocs: Contact[] = this.contacts.map((contact) => {
			contact.owner = this.user;
			return contact;
		});

		await ContactModel.insertMany(newContactDocs, { ordered: false })
			.then((res) => {
				contactsModels = res as ContactDoc[];
			})
			.catch((err) => this.checkServerError(context, err));

		contactsModels.forEach((doc) => this.user.contacts.push(doc));

		await this.user
			.save()
			.then((res) => (this.user = res as UserDoc))
			.catch((err) => this.checkServerError(context, err));

		const contactRes: Contact[] = contactsModels.map((x) => {
			return {
				id: x.id,
				name: x.name,
				emailAddresses: x.emailAddresses,
				phoneNumbers: x.phoneNumbers,
				owner: this.user.id
			} as Contact;
		});

		context.res = {
			status: 200,
			body: contactRes
		};

		return contactRes;
	}

	checkServerError(context: Context, error) {
		if (error) {
			context.res = {
				status: 500,
				body: error
			};
			return error;
		}
	}
}

export const ContactServ = async (context: Context) => {
	const userService = new UserService();
	const user = await userService.getUser(context);

	await connect()
		.then(() => context.log('Connection to CosmosDB successful'))
		.catch((err) => context.log(err, 'Connection to CosmosDB NOT successful'));
};
