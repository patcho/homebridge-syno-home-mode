'use strict'

var Service, Characteristic
const http = require('http')

module.exports = function (homebridge) {
	Service = homebridge.hap.Service
	Characteristic = homebridge.hap.Characteristic
	homebridge.registerAccessory('homebridge-syno-home-mode', 'HomeMode', HomeMode)
}

function HomeMode(log, config) {
	this.log = log
	this.name = config.name
	this.stateful = true

	this.username = config.username
	this.password = config.password
	this.syno_address = config.syno_address

	this._service = new Service.Switch(this.name)
	this._service.getCharacteristic(Characteristic.On).on('set', this._setOn.bind(this))
}

HomeMode.prototype.getServices = function () {
	return [this._service]
}

HomeMode.prototype._setOn = function (on, callback) {
	on = !on
	this.log('Setting HomeMode to ' + on)

	this.synoLogin((session) => {
		if (session.success) {
			this.switchHomeMode(on, session.data.sid)
		} else this.log('Can\'t connect to synology. Error code:', session.error.code)
	})

	callback()
}

HomeMode.prototype.synoLogin = function (callback) {
	http.get(
		'http://' +
		this.syno_address +
		':5000/webapi/auth.cgi?api=SYNO.API.Auth&method=Login&version=2&account=' +
		this.username +
		'&passwd=' +
		this.password +
		'&session=SurveillanceStation&format=sid',
		(response) => {
			var body = ''
			response.on('data', function (d) {
				body += d
			})
			response.on('end', () => {
				var parsed = JSON.parse(body)
				callback(parsed)
			})
		},
	)
}

HomeMode.prototype.switchHomeMode = function (on, sessionId) {
	http.get(
		'http://' +
		this.syno_address +
		':5000/webapi/entry.cgi?api="SYNO.SurveillanceStation.HomeMode"&version="1"&method="Switch"&on=' +
		(on ? 'true' : 'false') +
		'&_sid=' +
		sessionId,
	)
}
