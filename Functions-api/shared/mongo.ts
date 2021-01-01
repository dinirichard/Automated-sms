import * as mongoose from 'mongoose';

const mongoUri = `mongodb://${process.env.accountName}:${process.env.key}@${process.env.accountName}.documents.azure.com:${process.env.port}/${process.env.databaseName}?ssl=true`;

export function connect() {
	mongoose.set('debug', true);
	return mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
}
