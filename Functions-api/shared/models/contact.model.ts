import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const contactSchema = new Schema(
	{
		name: String,
		emailAddresses: [String],
		phoneNumbers: [String],
		owner: { type: Schema.Types.ObjectId, ref: 'User' }
	},
	{
		collection: 'Contact'
	}
);

export const ContactModel = mongoose.model('Contact', contactSchema);

export interface ContactDoc extends mongoose.Document {
	name: String;
	emailAddresses: string[];
	phoneNumbers: string[];
}
