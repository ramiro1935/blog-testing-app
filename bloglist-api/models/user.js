const uniqueValidator = require('mongoose-unique-validator');
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
	username: {
		type: String,
		unique: true,
		minLength: 3,
	},
	name: String,
	passwordHash: String,
	blogs: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Blog',
		},
	],
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id;
		delete returnedObject._id;
		delete returnedObject.__v;
		delete returnedObject.passwordHash;
	},
});

module.exports = model('User', userSchema);
