const Discord = require("discord.js")
const client = new Discord.Client()
const config = require('../Configs/whitelist.config')

const commands = {
	'wm': require('../Commands/welcome.command'),
	'whitelist': require('../Commands/whitelist.command')
}

