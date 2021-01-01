import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { orchestrator, EntityId } from 'durable-functions';
import {
	IOrchestrationFunctionContext,
	DurableEntityContext
} from 'durable-functions/lib/src/classes';
import { Contact } from '../shared/models/contact';

const httpTrigger = orchestrator(function* (ctx: IOrchestrationFunctionContext) {
	try {
		const email = ctx.df.getInput();
		ctx.log('Email: ', email);
		const contacts: Contact[] = yield ctx.df.callActivity('GetGoogleContacts', email);
		ctx.log('Contacts: ', contacts);
		const y = yield ctx.df.callActivity('ContactsSave', contacts);

		ctx.log('Y : ', y);
		ctx.log('Contact Get Ended');
	} catch (error) {}
});

export default httpTrigger;
