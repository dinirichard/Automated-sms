import { AzureFunction, Context, HttpRequest } from '@azure/functions';

const httpTrigger: AzureFunction = async function (
	ctx: Context,
	req: HttpRequest
): Promise<void> {
	// ctx.res = {
	// 	// status: 200, /* Defaults to 200 */
	// 	body: responseMessage
	// };
};

export default httpTrigger;
