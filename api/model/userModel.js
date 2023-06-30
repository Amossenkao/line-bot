const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	userName: String,
	userId: String,
	messages: Array,
});

module.exports = (async () => {
	await mongoose.connect(process.env.MONGODB_URI);

	const User = mongoose.model('User', userSchema);
	return User;
})();
