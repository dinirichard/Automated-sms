import { IOrchestrationFunctionContext } from 'durable-functions/lib/src/classes';

import * as path from 'path';
import { google, people_v1 } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import { of } from 'rxjs';
import { Contact, transformContactData } from '../shared/models/contact';

const people = google.people('v1');

let contacts: Contact[];

const httpTrigger = async function (
	context: IOrchestrationFunctionContext
): Promise<Contact[]> {
	context.log('Get Contacts from Google');
	// Obtain user credentials to use for the request
	context.log(path.join(__dirname, '..', '..', 'shared', 'oauth2.keys.json'));
	const auth = await authenticate({
		keyfilePath: path.join(__dirname, '..', '..', 'shared', 'oauth2.keys.json'),
		scopes: ['https://www.googleapis.com/auth/contacts.readonly']
	});

	google.options({ auth });

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
			return connections;
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

	// context.log("\n\nUser's Connections:\n", connections);
	// contacts.forEach((c) => context.log(c));
	return contacts;
};

export default httpTrigger;
