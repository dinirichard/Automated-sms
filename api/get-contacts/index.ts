import { AzureFunction, Context, HttpRequest } from '@azure/functions';

import * as path from 'path';
import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import { of } from 'rxjs';

const people = google.people('v1');

const httpTrigger: AzureFunction = async function (
	context: Context,
	req: HttpRequest
): Promise<any> {
	context.log('Get Contacts from Google');
	// Obtain user credentials to use for the request
	context.log(path.join(__dirname, '..', '..', 'shared', 'oauth2.keys.json'));
	const auth = await authenticate({
		keyfilePath: path.join(
			__dirname,
			'..',
			'..',
			'shared',
			'oauth2.keys.json'
		),
		scopes: ['https://www.googleapis.com/auth/contacts.readonly']
	});
	// context.res {
	//     body: google.options({ auth });
	// };
	google.options({ auth });

	// List all user connections / contacts
	// https://developers.google.com/people/api/rest/v1/people.connections
	let totalPeople;
	const connections = await people.people.connections
		.list({
			pageSize: 1000,
			resourceName: 'people/me',
			personFields: 'names,emailAddresses,phoneNumbers',
			requestSyncToken: false,
			sortOrder: 'FIRST_NAME_ASCENDING'
		})
		.then((response) => {
			totalPeople = response.data.totalPeople;
			return response.data.connections;
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

	context.res = {
		status: 200 /* Defaults to 200 */,
		body: connections
	};

	context.log("\n\nUser's Connections:\n", connections);
	// connections.b.forEach((c) => context.log(c));
	return of(connections);
};

export default httpTrigger;
