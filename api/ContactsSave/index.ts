import { IOrchestrationFunctionContext } from 'durable-functions/lib/src/classes';
import { Contact } from '../shared/models/contact';

const httpTrigger = async function (ctx: IOrchestrationFunctionContext): Promise<any> {
	const contacts = ctx.bindings.contacts;

	ctx.log(JSON.stringify(contacts));

	ctx.bindings.contactDocument = JSON.stringify(contacts);

	ctx.done();
};

export default httpTrigger;
