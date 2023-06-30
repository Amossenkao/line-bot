module.exports = (err, req, res, next) => {
	err.statusCode ??= 500;
	err.status ??= 'error';
	console.error(`Error: ${err.message}`);
	res
		.status(err.statusCode)
		.json({ status: err.statusCode, message: err.message });
};
