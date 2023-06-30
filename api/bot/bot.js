const line = require('@line/bot-sdk');
const prompt = require('../helpers/prompt');
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
class Bot {
	#event;
	#lineClient;
	#userName;
	#userPrompt;
	#shouldDelete;
	#user;
	constructor(lineConfig, event) {
		this.#lineClient = new line.Client(lineConfig);
		this.#event = event;
		this.userId = this.#event.source.userId;

		return (async () => {
			this.#userName = (
				await this.#lineClient.getProfile(this.userId)
			).displayName;
			this.#userPrompt = this.#event.message.text.toLowerCase();
			this.#shouldDelete = /delete/gi.test(this.#userPrompt);
			this.#user = await require('../controllers/userController');
			if (!(await this.#user.getUser(this.userId))) {
				await this.#user.createUser({
					userName: this.#userName,
					userId: this.userId,
					messages: [],
				});
			}
			return this;
		})();
	}

	// Make a request to the openai api
	#fetchAiResponse = async () => {
		if (this.#shouldDelete) {
			this.#user.clearMessages(this.userId);
			return 'past conversations has been deleted...';
		}
		await this.#user.updateMessages(this.userId, {
			role: 'user',
			content: this.#userPrompt.trim(),
			name: this.#userName,
		});

		const response = await openai.createChatCompletion(
			prompt(await this.#user.getMessages(this.userId))
		);
		return response.data.choices[0].message.content.trim();
	};

	// Make a request to the line api to reply to the message
	#sendReply = async () => {
		const responseText = await this.#fetchAiResponse();
		const replyObject = { type: 'text', text: responseText };
		if (!this.#shouldDelete) {
			this.#user.updateMessages(this.userId, {
				role: 'assistant',
				content: responseText,
				name: 'Tomodachi',
			});
		}
		const reply = await this.#lineClient.replyMessage(
			this.#event.replyToken,
			replyObject
		);
		return reply;
	};

	handleMessages = async () => {
		const event = this.#event;
		if (event.type !== 'message' || event.message.type !== 'text') {
			return null;
		}
		const output = await this.#sendReply();
		return output;
	};
}

module.exports = Bot;
