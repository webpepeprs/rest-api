const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');
const Rabbitmq = require('./Rabbitmq');
const version = require('./package').version;

class WebServer {
	constructor() {
		this.rabbitmq = new Rabbitmq();
	}

    async start(port = config.port) {
        const app = express();
        const router = express.Router();

        app.use(bodyParser());
		app.use(cors());
		app.use((req, res, next) => {
			req.headers['api_key'] == config.secretKey ? next() : res.status(403).end()
		});
		app.use(`/api/v${version.split('.')[0]}`, router);

		config.routes.forEach((route) => router[route.verb](route.path, this[route.method].bind(this)));

		await this.rabbitmq.connect(config.rabbitUrl);
		await this.rabbitmq.init();

        app.listen(port, () => console.log(`Server listening on port ${port} (${process.env.NODE_ENV})`));
	}

    getIndex(req, res) {
        this.greeting(req, res);
    }

    greeting(req, res) {
		if (!req.params) throw new Error('required slug param');
        const slug = req.params.slug || '';
        this.transport(res, `Hello${slug ? ' ' + slug : ''}`);
    }

    addNew(req, res) {
		if (!req.body) throw new Error('required body');
        this.transport(res, JSON.stringify(req.body));
    }

    transport(res, data) {
		res
			? res.send(data)
			: this.rabbitmq.chanell.publish('REST', 'result', Buffer.from(data));

		return Promise.resolve();
    }

    async stop() {

    }
}

module.exports = WebServer;
const main = async () => {
	const webServer = new WebServer();
	await webServer.start().catch((e) => console.error(e));

	for (let queue of ['get', 'post']) {
		await webServer.rabbitmq.chanell
			.consume(queue, async (msg) => {
				let valid = false;
				config.routes.forEach((route) => valid = route.method == msg.fields.routingKey ? true : valid);

				valid && await webServer[msg.fields.routingKey]({ params: { slug: msg.content.toString() }, body: msg.content.toString() }, null, true), { noAck: true }
			}).catch((e) => console.error(e));
	}
}
!module.parent && main();
