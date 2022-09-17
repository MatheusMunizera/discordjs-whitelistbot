const questions = require("./questionsConfig.json");
const embedConfig = require("./embedConfig");
const channelConfig = require("./channelsConfig.json");
const { MessageEmbed } = require("discord.js");

const createdChannel = channelConfig.createdChannel;
const answersChannel = channelConfig.answersChannel;
const failureChannel = channelConfig.failureChannel;

const answersEmbed = embedConfig.answers;
const startEmbed = embedConfig.start;
const questionsEmbed = embedConfig.questions;
module.exports = class Whitelist {
  events = {};
  answers = [];
  description = [];
  isCompleted = true;

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
      console.log(err);
      throw Error(err);
    }
  }

  async sendAnswersAndQuestions() {
    if(this.isCompleted == true){
    return new Promise((resolve, reject) => {
      const answersChannelTarget = this.client.channels.cache.find(
        (channel) => channel.name === answersChannel.name
      );
      let resp = new MessageEmbed()
        .setTitle(answersEmbed.title)
        .setColor(answersEmbed.color)
        .setThumbnail(
          `${answersEmbed.image}${this.message.author.id}/${this.message.author.avatar}${answersEmbed.size}`
        )
        .setDescription(this.description)
        .setAuthor(this.client.user.tag)
        .setFooter(
          "SOONFT",
          "https://media.discordapp.net/attachments/941805859636396093/945671266990448660/Frame_3_1.png?width=676&height=676"
        );
         
      try {
        answersChannelTarget.send({
          content: `<@${this.message.author.id}>`,
          embed: resp,
        });
        resolve();
      } catch(err) {
          reject();
      }
      }
  
    );
  }
}

  sendWelcomeMessage() {
    return new Promise((resolve, reject) => {
      const embed = new MessageEmbed()
        .setTitle(`${startEmbed.title}`)
        .setColor(startEmbed.color)
        .setThumbnail(startEmbed.serverIcon)
        .setDescription(startEmbed.description)
        // .setFooter(startEmbed.footer);

      this.channel.send({
        content: `<@${this.message.author.id}>`,
        embed,
      });

      const readMessage = async (message) => {
        if (
          message.content.toLowerCase() === "start" &&
          message.channel.id === this.channel.id
        ) {
          try {
            await this.channel.bulkDelete(99);
            this.client.removeListener("message", readMessage);
            resolve();
          } catch (err) {
            this.failureAnswers();
          }
        }
      };

      this.client.on("message", readMessage);

      setTimeout(reject, embedConfig.startCooldown * 60000);
    });
  }

  failureAnswers(){
    const embed = new MessageEmbed()
    .setTitle(`Timeout...`)
    .setDescription(`The questions were not answered in the estimated time.
    Please start again on the #✨・step-2-intro.`)
    .setColor(startEmbed.color)
    .setThumbnail(
      `${answersEmbed.image}${this.message.author.id}/${this.message.author.avatar}${answersEmbed.size}`
      )
      .setFooter(
        "SOONFT",
        "https://media.discordapp.net/attachments/941805859636396093/945671266990448660/Frame_3_1.png?width=676&height=676"
      )


    const failureChannelTarget = this.client.channels.cache.find(
      (channel) => channel.name === failureChannel.name);

      failureChannelTarget.send({
        
        content: `<@${this.message.author.id}>`,
        embed
        
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
          .setFooter(
            `You have ${question.timer}  minute(s) to answer that question.`
          );

        await this.channel.send(embed);

        this.answers[i] = await this.getTextQuestionAnswer(question);
        this.description.push(
          `**Question: ** ${this.answers[i].question.title}`
        );
        this.description.push(`**Answer: ** ${this.answers[i].answer}`);
      }
      this.addRoleToUser(channelConfig.roles.whitelisted);
      this.removeRoleToUser(channelConfig.roles.noWhitelisted);

    } catch {
      this.failureAnswers();
        
      this.isCompleted = false;
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
