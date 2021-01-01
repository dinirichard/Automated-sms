import * as mongoose from 'mongoose';
import { ContactDoc } from './contact.model';

const Schema = mongoose.Schema;
// const types = mongoose.;

const userSchema = new Schema(
	{
		email: String,
		firstName: String,
		lastName: String,
		name: String,
		photoUrl: String,
		contacts: [{ type: Schema.Types.ObjectId, ref: 'Contact' }]
	},
	{
		collection: 'User'
	}
);

export const User = mongoose.model('User', userSchema);

export interface UserDoc extends mongoose.Document {
	email: string;
	firstName: string;
	lastName: string;
	name: string;
	photoUrl: string;
	contacts: ContactDoc[];
}
