import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { connect } from '../shared/mongo';
import { UserService } from '../shared/services/user.service';
const userService = new UserService();

const httpTrigger: AzureFunction = async function (
	context: Context,
	req: HttpRequest
): Promise<void> {
	context.log('HTTP trigger function processed a request.');
	// userService.getUsers(context);
	// const name = req.query.name || (req.body && req.body.name);
	// const responseMessage = name
	// 	? 'Hello, ' +
	// 	  name +
	// 	  '. This HTTP triggered function executed successfully.'
	// 	: 'This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.';
	const users = await userService.getUsers(context);
	context.res = {
		status: 200 /* Defaults to 200 */,
		body: users
	};
};

export default httpTrigger;
