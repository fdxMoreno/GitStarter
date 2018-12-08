'use strict';

const login = require('../controllers/index');
const proxyAPI = require(libShared + '/lib/proxy-api');

module.exports = app => {
	app.post('/post/testAjax', (req, res) => res.status(204).end());
	app.get('/change-tenant', login.changeTenant);
	app.get('/', login.controller);
	app.get('/change-tenant', login.changeTenant);
	app.get('/user', (req, res, next) => {
		if (req.session && req.session.agent) {
			res.json({
				id: req.session.agent.userId,
				agentId: req.session.agent.id,
				firstName: req.session.agent.firstName,
				lastName: req.session.agent.lastName,
				email: req.session.agent.userEmail,
				scopes: req.session.agent.scopes,
				phoneExtension: req.session.agent.phoneExtension
			});
		} else {
			next();
		}
	});
	app.get('/agent', (req, res, next) => {
		if (req.session && req.session.agent) {
			res.json({
				userId: req.session.agent.userId,
				id: req.session.agent.id,
				firstName: req.session.agent.firstName,
				lastName: req.session.agent.lastName,
				email: req.session.agent.userEmail,
				phoneExtension: req.session.agent.phoneExtension
			});
		} else {
			next();
		}
	});
	app.all(['/proxy/api/*', '/stream/api/*'], proxyAPI);

	app.get(
		'/message',
		(req, res) => {
			req.flash('message', 'This is a Flash Message');
			res.redirect('/');
		},
		login.controller
	);

	app.get('/session-key', (req, res) => {
		let { agent } = req.session;
		let scopes = '<ul>';
		if (agent && agent.scopes && agent.scopes.length > 0) {
			for (let i = 0; i < agent.scopes.length; i++) {
				scopes += '<li>' + agent.scopes[i] + '</li>';
			}
		}

		scopes += '</ul>';
		res.send(`<div>authorization: bearer ${agent.token}</div>${scopes}`);
	});

	app.use('/inferno-test', (req, res) => {
		let view = 'inferno-view';
		res.render(view, {});
	});

	app.use('/angular-views/:section/:culture/:view.html', (req, res) => {
		let view = 'angular/views/' + req.params.section + '/' + req.params.view;
		res.render(view, {});
	});
};
