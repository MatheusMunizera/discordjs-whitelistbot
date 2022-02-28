
// Imports
const Discord = require("discord.js")
const client = new Discord.Client()
const auth = require('../Configs/Auth/discordAuth.json');
const config = require("../Configs/channelsConfig.json")
const commands = require("../Configs/commandsConfig")


// Client initialization

client.on("ready", () => {
    console.log(`${client.user.username} ON`)
    console.log('Desenvolvido por: Felipe & Muniz')
})


/* 
Get the command (Actually: welcome, whitelist), execute the respective funciton and at finish delete the author message
Configs are in channelConfig and commandsConfig 
*/ 

client.on("message", message => {
	const channel = message.guild.channels.cache.find(channel => channel.name === config.workChannel)
	if(channel && channel.id === message.channel.id && message.author.id !== client.user.id) { 
        const content = message.content 
        if(content.charAt(0) === `${config.prefix}`) {
            const command = content.substr(1).toLowerCase()
            if(typeof commands[command] === 'function') {
                commands[command]({ message, client })
            } 
        }
        message.delete()
    }
})



// Token Bot
client.login(auth.discordClientId);