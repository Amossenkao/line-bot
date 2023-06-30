const api = require('express').Router();
const { env } = process;
const Bot = require('./bot/bot');
const lineConfig = {
	channelAccessToken: env.CHANNEL_ACCESS_TOKEN,
	channelSecret: env.CHANNEL_SECRET,
};

api.post('/', async (req, res, next) => {
	try {
		const events = req.body.events;
		if (Array.isArray(events) && !events.length) {
			res.sendStatus(200);
			return;
		}
		let bot = await new Bot(lineConfig, events[0]);
		const result = await events.map(bot.handleMessages);
		result && Promise.all(result).then((response) => res.json(response));
	} catch (err) {
		const error = new Error(err.message);
		error.status = 'Fail';
		error.statusCode = 500;
		next(error);
	}
});

module.exports = api;
