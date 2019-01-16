const request = require('request-promise');
const chai = require('chai');
const WebServer = require('../server');
const version = require('../package').version;
const config = require('../config');

const expect = chai.expect;

const path = `http://localhost:3000/api/v${version.split('.')[0]}`;
let webServer;
const slug = 'test';

describe('CRUD Test for Bot', () => {
    before(async () => {
		webServer = new WebServer();
		await webServer.start(5000);

		for (let queue of ['response']) {
			await webServer.rabbitmq.chanell
				.consume(queue, async (msg) => {
					switch (msg.fields.routingKey) {
						case 'getIndex':
							expect(msg.content.toString()).to.equal('Hello');
							break;
						case 'greeting':
							expect(msg.content.toString()).to.equal(`Hello ${slug}`);
							break;
						case 'addNew':
							expect(msg.content.toString()).to.equal(`Fake body`);
							break;
						default:
					}
				}, { noAck: true });
		}
	});

    it('Get Index', async () => {
		webServer.rabbitmq.chanell.publish('REST', 'getIndex', Buffer.from(''));
    });

    it('Get Greeting with slug', async () => {
		webServer.rabbitmq.chanell.publish('REST', 'greeting', Buffer.from(slug));
	});

	it('Add something new with post', async () => {
		let body = { title: 'Hello World' };
		webServer.rabbitmq.chanell.publish('REST', 'addNew', Buffer.from(JSON.stringify(body)));
    });

    after(async () => webServer.stop());
});
