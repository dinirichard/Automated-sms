import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { orchestrator, EntityId } from 'durable-functions';
import {
	IOrchestrationFunctionContext,
	DurableEntityContext
} from 'durable-functions/lib/src/classes';
import { Contact } from '../shared/models/contact';

const httpTrigger = orchestrator(function* (ctx: IOrchestrationFunctionContext) {
	try {
		const contacts: Contact[] = yield ctx.df.callActivity('contact-get');
		const y = yield ctx.df.callActivity('ContactsSave', contacts);

		ctx.log('Contact Get Ended');
	} catch (error) {}
});

export default httpTrigger;
