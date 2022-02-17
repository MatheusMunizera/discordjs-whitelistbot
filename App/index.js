const Discord = require("discord.js")
const client = new Discord.Client()
const config = require('../Configs/whitelistConfig')

const commands = {
	'welcome': require('../Commands/welcomeCommand.js'),
	'whitelist': require('../Commands/whitelistCommand')
}

client.on("ready", () => {
    console.log(` O PAI ESTÁ ON! COM O NOME: ${client.user.tag}!`)
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



// client.on("ready", () => {
//     client.user.setStatus("online");n
// });

// const prefix = "."

// client.on("message", message =>{
//     // Não respondendo mensagem de bot e mensagem sem o prefix
//     if (message.author.bot) return;
//     if(!message.content.startsWith(prefix)) return;
   
//     const commandBody = message.content.slice(prefix.length);

//     const args = commandBody.split(' ');
//     const command = args.shift().toLocaleLowerCase();

    
//     if(command === "whitelist"){
//         message.reply(`Seja bem vindo a Whitelist do nosso servidor!`)
//     }
//  })

