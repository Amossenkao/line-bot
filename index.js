require('dotenv').config();
const express = require('express');
const api = require('./api');
const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json()).use(express.urlencoded({ extended: true }));
app.use('/', api).all('*', (_, res, next) => {
	const error = new Error('Unauthorized route');
	error.status = 'Fail';
	error.statusCode = 404;
	next(error);
});

app.use(require('./api/middlewares/errorMiddleware'));
app.listen(PORT, () => {
	console.log(`App is listening to port: ${PORT}`);
});
