const questions = require('../Configs/questionsConfig.js')
const config = require('../Configs/whitelistConfig.js')
const { MessageEmbed, DiscordAPIError } = require('discord.js')
const questionsConfig = require('../Configs/questionsConfig.js')

module.exports = class Whitelist {
    events = {}
    answers = []
    description = [];

    constructor({ client, message }) {
        this.client = client
        this.message = message
        this.init()
    }

    async init() {
        try {
            await this.createChannel()
            await this.loopTroughQuestions()
            await this.setDescriptionAnswer()
            await this.sendAnswersAndQuestions()

        } catch (err) {
            console.error(err)
        }
        await this.destroy()
    }

    async createChannel() {
        try {
            
            this.channel = await this.message.guild.channels.create(`📋│whitelist-${this.message.author.username}`, 
            {
                type: "text",
                parent: this.message.channel.parentID,
                permissionOverwrites: [
                    {
                        id: this.message.guild.roles.everyone,
                        deny: 'VIEW_CHANNEL'
                    }, 
                    {
                        id: this.client.user,
                        allow: 'VIEW_CHANNEL'
                    }, 
                    {
                        id: this.message.author,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                    },
                ]
            })
           
        } catch (err) {
            throw Error(err)
        }
    }

    async setDescriptionAnswer(){
       
        this.answers.forEach(e => {
            this.description.push(`**Pergunta: **
            ${e.question.title}
            `)
            
            this.description.push(`**Resposta: **
            ${e.answer}
            `)
        })
             
    }

    async sendAnswersAndQuestions()
    {
        return new Promise((resolve,reject) => {
            
            let canal = this.client.channels.cache.get("942948335080341565")
            
            console.log("Users", this.message.author)
        
            
            //let avatar = this.message.author.user.avatarURL({ dynamic: true, format: "png", size: 1024 });
            
           
            let resp =  new MessageEmbed()
                .setTitle("Aqui está suas perguntas e respostas de seu questionario")
                .setColor(config.embedColor)
                .setImage(`https://cdn.discordapp.com/avatars/${this.message.author.id}/${this.message.author.avatar}.webp?size=128`)
                // size=64
                .setDescription( this.description )

            
                .setAuthor(this.client.user.tag)

                    canal.send({ 
                        content: `<@${this.message.author.id}>`,
                        embed: resp
                    });

                

            //.setTitle(`${this.message.reply} - Whitelist`)
           // .setColor(config.embedColor)
            // .setDescription(`Aqui está suas perguntas e respostas de seu questionario:
            // **Pergunta:** ${e.question.title}
            // **Resposta:** ${e.answer}`)
            // .setThumbnail(this.client.user.avatarURL)

            // setInterval(() => {
            //     canal.send({content: `{client.message.author.username}`, embeds: [embed]})
            // }, interval);
        })

            // this.answers.forEach(e => {
            //     this.message.reply(
                    
            //     `Aqui está suas perguntas e respostas de seu questionario:
            //     **Pergunta:** ${e.question.title}
            //     **Pergunta:** ${e.question.title}


            // });
           

        }
        
        
    

    sendWelcomeMessage() {
        return new Promise((resolve, reject) => {
            const embed = this.getEmbed()
                .setDescription(`

                    Olá <@${this.message.author.id}> ! Como vai?
                    
                   Espero que esteja bem. Para começar a whitelist, digite:                    
                    ${config.messages.welcome}

                    Para dar inicio ao questionário!

                `)
                .setFooter(`Você tem ${config.startCooldown} minuto(s) para iniciar a whitelist.`)

            this.channel.send({
                content: `<@${this.message.author.id}>`,
                embed
            })

            const readMessage = async message => {
                if(message.content.toLowerCase() === 'iniciar' && message.channel.id === this.channel.id) {
                    try {
                        await this.channel.bulkDelete(99)
                        this.client.removeListener('message', readMessage)
                        resolve()
                    } catch (err) {
                        reject(err)
                    }
                } 
            }
    
            this.client.on('message', readMessage)

            setTimeout(reject, config.startCooldown * 60000)
        })
    }

    async loopTroughQuestions() {
        try {
            await this.sendWelcomeMessage()
            
            for(let i = 0; i < questions.length; i++) {
                const question = questions[i]
                
                const embed = this.getEmbed().
                    setDescription(`
                        ${config.serverName}
        
                        ${question.title}

                        ${question.answers ? `${question.answers.map(answer => `${answer.reaction} - ${answer.title}`).join('\n\n')} \n\n **Obs: espere todas as reações aparecerem antes de responder.**` : ``}
                    `)
                    .setFooter(`Você tem ${question.timer} minuto(s) para responder essa pergunta.`)

     
                const embedMessage = await this.channel.send(embed)

                if(question.answers) {
                    await Promise.all(question.answers.map(async answer => embedMessage.react(answer.reaction)))
                }

                this.answers[i] = await this.getTextQuestionAnswer(question)

                

            }
          
            this.removeRoleToUser(config.roles.noWhitelisted)
            this.addRoleToUser(config.roles.whitelisted)   
        } catch {
            this.message.reply("você demorou mais de 1 minuto para responder a pergunta!")
            this.emit('finished', false)
        }
    }

    /**
     * @todo improve this code to make it dynamic
     */
    getTextQuestionAnswer(question) {
        return new Promise((resolve, reject) => {
            const readMessage = async message => {
                if(message.content && message.channel.id === this.channel.id) {
                    try {
                        await this.channel.bulkDelete(99)
                        this.client.removeListener('message', readMessage)
                        //CONTEUDO DAS RESPOSTAS
                       // console.log(message.content)
                        

                        resolve({ 
                            answer: message.content,
                            question,
                        })
                    } catch (err) {
                        reject(err)
                    }
                } 
            }
    
            this.client.on('message', readMessage)

            setTimeout(reject, question.timer * 60000)
        })
    }

    // async getReactionQuestionAnswer(question, message) {
    //     const timer = question.timer * 60000
        
    //     const reactionsFilter = (reaction, user) => question.answers.map(answer => answer.reaction).includes(reaction.emoji.name) && user.id === this.message.author.id
    //     const collected = await message.awaitReactions(reactionsFilter, { max: 1, time: timer, errors: ['time'] })
        
    //     await this.channel.bulkDelete(99)
    //     const reaction = collected.first()
        
    //     return { 
    //         ...question.answers.find(answer => answer.reaction === reaction.emoji.name),
    //         question,
    //     }
    // }


    addRoleToUser(roleName) {
        const role = this.message.guild.roles.cache.find(role => role.name === roleName)
        if(role) {
            return this.message.member.roles.add(role)
        }
    }

    removeRoleToUser(roleName) {
        const role = this.message.guild.roles.cache.find(role => role.name === roleName)
        if(role) {
            return this.message.member.roles.remove(role)
        }
    }



    async destroy() {
        console.log('[MELB] APAGANDO CANAL')
        await this.channel.delete()
        this.emit('finished', {
            answers: this.answers,
            grade: this.grade,
            passed: this.passedWhitelist
        })
    }

    getEmbed() {
        return new MessageEmbed()
            .setTitle(`${config.serverName} - Whitelist`)
            .setColor(config.embedColor)
            .setThumbnail(config.serverIcon)
    }

    

    on(eventName, eventMethod) {
        if(typeof this.events[eventName] === 'undefined') {
            this.events[eventName] = []
        }
        this.events[eventName].push(eventMethod)
    }

    emit(eventName, data) {
        if(Array.isArray(this.events[eventName])) {
            this.events[eventName].forEach(eventMethod => eventMethod(data))
        }
    }
}

