import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { UserService } from '../shared/services/user.service';
import { of } from 'rxjs';

const userService = new UserService();

const httpTrigger: AzureFunction = async function (
	context: Context,
	req: HttpRequest
): Promise<any> {
	if (req.body && req.body.email) {
		const userResponse = await userService.postUser(context);
		context.res = {
			status: 200,
			body: userResponse
		};
		return userResponse;
	} else {
		context.res = {
			status: 400,
			body: 'Please pass a User in the request body'
		};
		return context.res;
	}
};

export default httpTrigger;
