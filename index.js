
// Imports
const Discord = require("discord.js")
const client = new Discord.Client()
const auth = process.env.ID_DISCORD_CLIENT;
const config = require("./comandos/channelsConfig.json")
const commands = require("./comandos/commandsConfig")

const developers = [];
developers['Felipe'] = 'https://felipealves.dev';
developers['Munizera'] = 'https://matheusmuniz.dev';
// Client initialization

client.on("ready", () => {
    console.log(`${client.user.username} ON`)
    console.log('Desvenvolvido por:')
    console.table(developers)
})


/* 
Get the command (Actually: welcome, introduction), execute the respective funciton and at finish delete the author message
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
client.login(auth);