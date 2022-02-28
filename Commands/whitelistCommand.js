const Whitelist = require('../Classes/whitelistClass');
const moment = require('moment-timezone');

const config = require('../Configs/channelsConfig.json');

const usersCooldown = {}
const whitelists = {}

const userItsNotOnCooldown = (userId) => {
	if(Array.isArray(usersCooldown[userId])) {
		if(usersCooldown[userId].length >= config.maximumTries) {
			const firstTryDate = usersCooldown[userId][0].date
			if(Math.floor((Math.abs(new Date() - firstTryDate) / 1000) / 60) <= config.cooldown) {
				return false
			}
			delete usersCooldown[userId]
		}
	}
	return true
 }

module.exports = ({ client, message }) => {
	const userId = message.author.id
	if(typeof whitelists[userId] === 'undefined') {
		if(userItsNotOnCooldown(userId)) {
			console.log(`CRIANDO CANAL NO DISCORD ${message.author.username}`)
			const whitelist = new Whitelist({
				message,
				client
			})
			
			whitelist.on('finished', (whitelist) => {
				delete whitelists[userId]
				const data = {
					whitelist,
					date: new Date
				}
	
				
				if(!data.passed) {
	
					if(typeof usersCooldown[userId] === 'undefined') {
						usersCooldown[userId] = [data]
						return
					}
	
					usersCooldown[userId].push(data)
				}
			})
			
			whitelists[userId] = whitelist
		} else {
			message.reply(`você atingiu o número máximo de tentativas, tente depois das: **${moment(usersCooldown[userId][0].date).add(config.cooldown, 'minutes').tz('America/Sao_Paulo').format(`DD/MM/YYYY [-] HH:mm`)}**`)
		}
	} else {
		message.reply("você só pode fazer uma whitelist por vez!")
	}
}