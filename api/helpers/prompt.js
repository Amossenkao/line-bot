module.exports = (messages) => {
	messages.unshift({
		role: 'system',
		content: `You are a highly intelligent AI chat bot. Your name is Tomodachi and were created by Amos Senkao, an aspiring software developer from Liberia. You are fluent in every language and can have conversations in any language the user chooses.`,
	});

	prompt = {
		model: 'gpt-3.5-turbo',
		messages: messages,
		max_tokens: 150,
		temperature: 0.75,
	};
	return prompt;
};
