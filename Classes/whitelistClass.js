const questions = require("../Configs/questionsConfig.json");
const embedConfig = require("../Configs/embedConfig");
const channelConfig = require("../Configs/channelsConfig.json");
const { MessageEmbed } = require("discord.js");

const createdChannel = channelConfig.createdChannel;
const answersChannel = channelConfig.answersChannel;

const answersEmbed = embedConfig.answers;
const startEmbed = embedConfig.start;
const questionsEmbed = embedConfig.questions;

module.exports = class Whitelist {
  events = {};
  answers = [];
  description = [];

  constructor({ client, message }) {
    this.client = client;
    this.message = message;
    this.init();
  }

  async init() {
    try {
      // 
      await this.createChannel();
      await this.loopTroughQuestions();
      await this.sendAnswersAndQuestions();
    } catch (err) {
      console.error(err);
    }
    await this.destroy();
  }

  async createChannel() {
    try {
      this.channel = await this.message.guild.channels.create(
        `${createdChannel.name}${this.message.author.username}`,
        {
          type: `${createdChannel.text}`,
          parent: this.message.channel.parentID,
          permissionOverwrites: [
            {
              id: this.message.guild.roles.everyone,
              deny: "VIEW_CHANNEL",
            },
            {
              id: this.client.user,
              allow: "VIEW_CHANNEL",
            },
            {
              id: this.message.author,
              allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
            },
          ],
        }
      );
    } catch (err) {
      console.log(err)
      throw Error(err);
    }
  }

  async sendAnswersAndQuestions() {
    return new Promise((resolve, reject) => {
      const  answersChannelTarget = this.client.channels.cache.find(channel => channel.name === answersChannel.name)
      let resp = new MessageEmbed()
        .setTitle(answersEmbed.title)
        .setColor(answersEmbed.color)
        .setImage(`${answersEmbed.image}${this.message.author.id}/${this.message.author.avatar}${answersEmbed.size}`)
        .setDescription(this.description)
        .setAuthor(this.client.user.tag);

      try {
        
        answersChannelTarget.send({
          content: `<@${this.message.author.id}>`,
          embed: resp,
        });
        resolve();
      } catch (err) {
        console.log(err)
        reject(err);
      }
    });
   
  }

  sendWelcomeMessage() {
    return new Promise((resolve, reject) => {
      const embed = new MessageEmbed()
        .setTitle(`${startEmbed.title} - Whitelist`)
        .setColor(startEmbed.color)
        .setThumbnail(startEmbed.serverIcon)
        .setDescription(startEmbed.description)
        .setFooter(startEmbed.footer);

      this.channel.send({
        content: `<@${this.message.author.id}>`,
        embed,
      });

      const readMessage = async (message) => {
        if (
          message.content.toLowerCase() === "iniciar" &&
          message.channel.id === this.channel.id
        ) {
          try {
            await this.channel.bulkDelete(99);
            this.client.removeListener("message", readMessage);
            resolve();
          } catch (err) {
            reject(err);
          }
        }
      };

      this.client.on("message", readMessage);

      setTimeout(reject, embedConfig.startCooldown * 60000);
    });
  }

  async loopTroughQuestions() {
    try {
      await this.sendWelcomeMessage();

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];

        const embed = new MessageEmbed()
          .setTitle(question.title)
          .setColor(questionsEmbed.color)
          .setThumbnail(questionsEmbed.serverIcon)
          .setDescription(questionsEmbed.description)
          .setFooter(`Você tem ${question.timer} minuto(s) para responder essa pergunta.`);

         await this.channel.send(embed);


        this.answers[i] = await this.getTextQuestionAnswer(question);
        this.description.push(`**Pergunta: ** ${this.answers[i].question.title}`)
        this.description.push(`**Resposta: ** ${this.answers[i].answer}`)
        
      }
      this.addRoleToUser(channelConfig.roles.whitelisted);
    } catch {
      this.message.reply(
        "você demorou mais de 1 minuto para responder a pergunta!"
      );
    }
  }

  getTextQuestionAnswer(question) {
    return new Promise((resolve, reject) => {
      const readMessage = async (message) => {
        if (message.content && message.channel.id === this.channel.id) {
          try {
            await this.channel.bulkDelete(99);
            this.client.removeListener("message", readMessage);
            resolve({
              answer: message.content,
              question,
            });
          } catch (err) {
            reject(err);
          }
        }
      };

      this.client.on("message", readMessage);

      setTimeout(reject, question.timer * 60000);
    });
  }

  addRoleToUser(roleName) {
    const role = this.message.guild.roles.cache.find(
      (role) => role.name === roleName
    );
    if (role) {
      return this.message.member.roles.add(role);
    }
  }

  removeRoleToUser(roleName) {
    const role = this.message.guild.roles.cache.find(
      (role) => role.name === roleName
    );
    if (role) {
      return this.message.member.roles.remove(role);
    }
  }

  async destroy() {
    console.log("[MELB] APAGANDO CANAL");
    await this.channel.delete();
  }

  on(eventName, eventMethod) {
    if (typeof this.events[eventName] === "undefined") {
      this.events[eventName] = [];
    }
    this.events[eventName].push(eventMethod);
  }
};
