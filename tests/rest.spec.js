const request = require('request-promise');
const chai = require('chai');
const WebServer = require('../server');
const version = require('../package').version;
const config = require('../config');

const expect = chai.expect;

const path = `http://localhost:3000/api/v${version.split('.')[0]}`;
let webServer;

describe('CRUD Test for Bot', () => {
    before(async () => {
		webServer = new WebServer();
		await webServer.start(4000);
    });

    it('Get Index', async () => {
        const res = await request({
			method: 'get',
			headers: { 'api_key': config.secretKey },
            url: path
		});
		expect(res).to.equal('Hello');
    });

    it('Get Greeting with slug', async () => {
		const slug = 'test';
        const res = await request({
			method: 'get',
			headers: { 'api_key': config.secretKey },
            url: `${path}/hello/${slug}`
		});
		expect(res).to.equal(`Hello ${slug}`);
    });

	it('Add something new with post', async () => {
		let body = { title: 'Hello World' };
        const res = await request({
			method: 'post',
			headers: { 'api_key': config.secretKey },
			url: `${path}/post`,
			json: body
		});
		expect(res).deep.equal(body);
    });

    after(async () => webServer.stop());
});
