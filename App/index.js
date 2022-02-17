const Discord = require("discord.js")
const client = new Discord.Client()
const config = require('../Configs/whitelistConfig')

const commands = {
	'welcome': require('../Commands/welcomeCommand.js'),
	'whitelist': require('../Commands/whitelistCommand')
}

client.on("ready", () => {
    console.log(` [MELB] O PAI ESTÁ ON! COM O NOME: ${client.user.tag}!`)
    console.log('Desenvolvido por: Felipe & Muniz')
})

client.on("message", message => {
	const channel = message.guild.channels.cache.find(channel => channel.name === config.workChannel)
	if(channel && channel.id === message.channel.id && message.author.id !== client.user.id) { 
        const content = message.content 
        if(content.charAt(0) === "!") {
            const command = content.substr(1).toLowerCase()
            if(typeof commands[command] === 'function') {
                commands[command]({ message, client })
            } 
        }
        message.delete()
    }
})

client.login(config.discordClientId);