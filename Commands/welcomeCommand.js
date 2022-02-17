const { MessageEmbed } = require('discord.js')

module.exports = ({ message }) => {
    const embed = new MessageEmbed()
        .setTitle('Whitelist')
        .setColor(0xEf2172)
        .setThumbnail('https://miro.medium.com/max/1400/1*iqFvVfidr3HOgupVbywvKA.png')
        .setDescription(`
            Eaí, tranquilo?
                Seja bem vindo a nossa comunidade de NFT!
            
            Para realizar whitelist, digite: 
            \`\`\`\!whitelist\`\`\`\
            E siga as minhas instruções.
        `)
    message.channel.send(embed)
}