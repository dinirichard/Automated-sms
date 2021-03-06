import { Context } from '@azure/functions';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { UserDoc, UserModel } from '../models/user.model';
import { connect } from '../mongo';

export class UserService {
	constructor() {}

	async getAllUsers(context: Context) {
		context.log('PORT === ', process.env.PORT);
		await connect()
			.then(() => context.log('Connection to CosmosDB successful'))
			.catch((err) => context.log(err, 'Connection to CosmosDB NOT successful'));
		const docquery = UserModel.find({});
		await docquery
			.exec()
			.then((user) => {
				context.log('Users: ', user);
				context.res.status(200).json(user);
				return user;
			})
			.catch((error) => {
				return (context.res = {
					status: 500,
					body: error
				});
				return;
			});
	}

	async postUser(context: Context) {
		context.log('Env: ', process.env.accountName);
		await connect()
			.then(() => context.log('Connection to CosmosDB successful'))
			.catch((err) => context.log(err, 'Connection to CosmosDB NOT successful'));
		const existingUser = await this.getUser(context);

		if (existingUser === null) {
			const newUser = new UserModel({
				email: context.req.body.email,
				name: context.req.body.name,
				firstName: context.req.body.firstName,
				lastName: context.req.body.lastName,
				photoUrl: context.req.body.photoUrl,
				setupComplete: false
			});

			const response = await newUser
				.save()
				.then((user) => {
					context.res = {
						status: 201,
						data: user
					};
					context.log('User created successfully!', user);
					return user;
				})
				.catch((err) => {
					return this.checkServerError(context, err);
				});
		} else {
			context.log('User is already registered!');
			return new User(existingUser);
		}
	}

	async putUser(context: Context) {
		await connect()
			.then(() => context.log('Connection to CosmosDB successful'))
			.catch((err) => context.log(err, 'Connection to CosmosDB NOT successful'));
		const originalHero = {
			uid: parseInt(context.req.params.uid, 10),
			name: context.req.body.name,
			saying: context.req.body.saying
		};
		await UserModel.findOne({ uid: originalHero.uid }, async (error, hero) => {
			if (this.checkServerError(context, error)) return;
			if (!this.checkFound(context, hero)) return;

			hero.name = originalHero.name;
			hero.saying = originalHero.saying;
			await hero.save((error) => {
				if (this.checkServerError(context, error)) return;
				context.res.status(200).json(hero);
				context.log('Hero updated successfully!');
			});
		});
	}

	async deleteUser(context: Context) {
		await connect()
			.then(() => context.log('Connection to CosmosDB successful'))
			.catch((err) => context.log(err, 'Connection to CosmosDB NOT successful'));
		const uid = parseInt(context.req.params.uid, 10);
		await UserModel.findOneAndRemove({ uid: uid })
			.then((hero) => {
				if (!this.checkFound(context, hero)) return;
				context.res.status(200).json(hero);
				context.log('Hero deleted successfully!');
			})
			.catch((error) => {
				if (this.checkServerError(context, error)) return;
			});
	}

	async getUser(context: Context): Promise<UserDoc> {
		const docquery = UserModel.findOne({ email: context.req.body.email });

		const response = await docquery
			.exec()
			.then((user: UserDoc) => {
				return user;
			})
			.catch((error) => {
				context.res = {
					status: 500,
					body: { error, message: 'User does not exists' }
				};
				return null;
			});
		return response;
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

	checkFound(context: Context, user) {
		if (!user) {
			context.res = {
				status: 404,
				body: 'User not found.'
			};
			return;
		}
		return user;
	}
}
