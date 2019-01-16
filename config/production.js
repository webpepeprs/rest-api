module.exports = {
	port: 3000,
	routes: [
		{ path: '/', method: 'getIndex', verb: 'get'},
		{ path: '/hello/:slug', method: 'greeting', verb: 'get'},
		{ path: '/post', method: 'addNew', verb: 'post'},
	],
	secretKey: 'a67689cb-be85-493b-829c-5b0b663a992f',
	rabbitUrl: 'amqp://rabbitmq:rabbitmq@rabbitmq'
};
