const { MessageEmbed } = require('discord.js')
const embedConfig =  require('./embedConfig.js')


module.exports = ({ message }) => {
    const embed = new MessageEmbed()
        .setTitle( embedConfig.welcome.title)
        .setColor(embedConfig.welcome.color)
        .setThumbnail(embedConfig.welcome.thumbnail)
        .setDescription(embedConfig.welcome.description)
    message.channel.send(embed)
}