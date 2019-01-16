const amqp = require('amqplib');

module.exports = class Rabbitmq {
    constructor() {
        this.connection = {};
        this.chanell = {};
        this.queues = [];
    }

    async init() {
		await this.createChanell();
		await this.chanell.assertExchange('REST', 'direct', {
			durable: true,
			autoDelete: false,
			closeChannelOnUnsubscribe: true,
		});
		await this.bindQueue('REST');
    }

    async connect(host = 'amqp://localhost') {
        this.connection = await amqp.connect(host);
        return this;
    }

    async bindQueue(exchange) {
		for (let queue of ['get', 'post', 'response']) {
			this.queues.push(await this.chanell.assertQueue(queue));
		}

		this.chanell.bindQueue('get', 'REST', 'getIndex');
		this.chanell.bindQueue('get', 'REST', 'greeting');
		this.chanell.bindQueue('post', 'REST', 'addNew');
		this.chanell.bindQueue('response', 'REST', 'result');
    }

    async createChanell() {
        this.chanell = await this.connection.createChannel();
    }

    close() {
        this.connection.close();
    }
};
