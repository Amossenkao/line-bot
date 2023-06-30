module.exports = (async () => {
	const User = await require('../model/userModel');

	return {
		getUser: async function (userId) {
			return await User.findOne({ userId: userId });
		},
		createUser: async function (userDetails) {
			return await new User(userDetails).save();
		},

		updateMessages: async function (userId, messageObject) {
			const messages = await this.getMessages(userId);
			if (messages.length >= 10) {
				await User.findOneAndUpdate(
					{ userId: userId },
					{ $pop: { messages: -1 } }
				);
			}
			await User.findOneAndUpdate(
				{ userId: userId },
				{ $push: { messages: messageObject } }
			);
		},

		clearMessages: async function (userId) {
			await User.findOneAndUpdate({ userId: userId }, { messages: [] });
		},

		getMessages: async function (userId) {
			let user = await User.findOne({ userId: userId });
			return user.messages;
		},
	};
})();
