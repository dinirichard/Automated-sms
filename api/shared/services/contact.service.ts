import { Context } from '@azure/functions';
import { ContactModel, ContactDoc } from '../models/contact.model';
import { UserService } from '../services/user.service';
import { User, UserDoc } from '../models/user.model';
import { connect } from '../mongo';
import * as mongoose from 'mongoose';
import { Contact } from '../models/contact';

export class ContactService {
	user: UserDoc;
	userService: UserService;
	contacts: Contact[];
	contactModel;

	constructor(context: Context) {
		this.userService = new UserService();
		async () =>
			await this.userService
				.getUser(context)
				.then(async (res) => (this.user = await res))
				.catch((err) => {});

		this.contacts = context.req.body.contact;
		// this.contactModel = res :mongoose.Model<ContactDoc>;
		this.mongoRun(async (context: Context, next) => {
			await connect()
				.then(() => context.log('Connection to CosmosDB successful'))
				.catch((err) => context.log(err, 'Connection to CosmosDB NOT successful'));

			await next();
		});
	}

	mongoRun(context) {}

	async getContacts(context: Context) {
		await this.user.populate('contacts').execPopulate();

		context.res = {
			status: 200,
			body: this.user.contacts.map((x) => {
				return {
					name: x.name,
					emailAddresses: x.emailAddresses,
					phoneNumbers: x.phoneNumbers
				} as Contact;
			})
		};
	}

	async saveContact(context: Context) {
		const contactsModels: ContactDoc[] = await this.contacts.map((contact) => {
			let result: ContactDoc = null;
			const newContact = new ContactModel({
				name: contact.name,
				emailAddresses: contact.emailAddresses,
				phoneNumbers: contact.phoneNumbers,
				owners: this.user
			});

			newContact
				.save()
				.then((res) => {
					result = res as ContactDoc;
					return res;
				})
				.catch((err) => {
					this.checkServerError(context, err);
				});

			if (result) {
				this.user.contacts.push(result);
				this.user
					.save()
					.then((res) => (this.user = res as UserDoc))
					.catch((err) => this.checkServerError(context, err));
			}

			return result;
		});

		context.res = {
			status: 200,
			body: contactsModels.map((x) => {
				return {
					name: x.name,
					emailAddresses: x.emailAddresses,
					phoneNumbers: x.phoneNumbers
				} as Contact;
			})
		};
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
