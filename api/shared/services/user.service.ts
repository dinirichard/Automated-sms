import { Context } from '@azure/functions';
import { User } from '../models/user.model';
import { connect } from '../mongo';

export class UserService {
	constructor() {}

	async getUsers(context: Context) {
		context.log('PORT === ', process.env.PORT);
		await connect()
			.then(() => context.log('Connection to CosmosDB successful'))
			.catch((err) =>
				context.log(err, 'Connection to CosmosDB NOT successful')
			);
		const docquery = User.find({});
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
		const existingUser = this.getUser(context);

		if (!existingUser) {
			const originalUser = {
				uid: context.req.body.uid,
				email: context.req.body.email,
				name: context.req.body.name,
				firstName: context.req.body.firstName,
				lastName: context.req.body.lastName,
				photoUrl: context.req.body.photoUrl
			};
			const hero = new User(originalUser);
			await hero.save((error) => {
				if (this.checkServerError(context, error)) return;
				context.res.status(201).json(hero);
				context.log('User created successfully!');
			});
		} else {
			context.log('User is already registered!');
		}
	}

	async putUser(context: Context) {
		const originalHero = {
			uid: parseInt(context.req.params.uid, 10),
			name: context.req.body.name,
			saying: context.req.body.saying
		};
		await User.findOne({ uid: originalHero.uid }, async (error, hero) => {
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
		const uid = parseInt(context.req.params.uid, 10);
		await User.findOneAndRemove({ uid: uid })
			.then((hero) => {
				if (!this.checkFound(context, hero)) return;
				context.res.status(200).json(hero);
				context.log('Hero deleted successfully!');
			})
			.catch((error) => {
				if (this.checkServerError(context, error)) return;
			});
	}

	async getUser(context: Context) {
		const docquery = User.findOne({ email: context.req.body.email });

		await docquery
			.exec()
			.then((user) => {
				return user;
			})
			.catch((error) => {
				context.res.status(500).send(error);
				return;
			});
		return null;
	}

	checkServerError(context: Context, error) {
		if (error) {
			context.res.status(500).send(error);
			return error;
		}
	}

	checkFound(context: Context, hero) {
		if (!hero) {
			context.res.status(404).send('Hero not found.');
			return;
		}
		return hero;
	}
}
