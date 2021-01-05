import { AzureFunction, Context, HttpRequest } from '@azure/functions';

import * as path from 'path';
import { google, people_v1 } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import { of } from 'rxjs';
import { Contact, transformContactData } from '../shared/models/contact';
import { ContactService } from '../shared/services/contact.service';

const people = google.people('v1');
let contacts: Contact[];
const contactService = new ContactService();

const httpTrigger: AzureFunction = async function (
	context: Context,
	req: HttpRequest
): Promise<any> {
	context.log('Get Contacts from Google');

	// Obtain user credentials to use for the request
	context.log(path.join(__dirname, '..', '..', 'shared', 'oauth2.keys.json'));
	const auth = await authenticate({
		keyfilePath: path.join(__dirname, '..', '..', 'shared', 'oauth2.keys.json'),
		scopes: ['https://www.googleapis.com/auth/contacts.readonly']
	});

	google.options({ auth });

	let email;
	if (req.body) {
		email = req.body.email;
		context.log('Email is: ', email);
	} else {
		return (context.res = {
			status: 400,
			body: 'User email was not provided'
		});
	}

	// List all user connections / contacts
	// https://developers.google.com/people/api/rest/v1/people.connections
	let totalPeople;
	let connections;
	await people.people.connections
		.list({
			pageSize: 1000,
			resourceName: 'people/me',
			personFields: 'names,emailAddresses,phoneNumbers',
			requestSyncToken: false,
			sortOrder: 'FIRST_NAME_ASCENDING'
		})
		.then((response) => {
			totalPeople = response.data.totalPeople;
			connections = response.data.connections as people_v1.Schema$Person[];
		})
		.catch((err) => {
			context.res = {
				status: 500,
				body: err
			};
			return (context.res = {
				status: 500,
				body: err
			});
		});

	contacts = transformContactData(connections);
	context.res = {
		status: 200 /* Defaults to 200 */,
		body: contacts
	};

	const res = await contactService.saveContact(context);

	// context.log("\n\nUser's Connections:\n", connections);
	// contacts.forEach((c) => context.log(c));
	return res;
};

export default httpTrigger;
