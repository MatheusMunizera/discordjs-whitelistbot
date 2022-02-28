const question = ("./questionsConfig.json")

const embedColor = 0xef2172;
const startCooldown = 1;
const serverName = "Servidor de NFTs";
const serverIcon = "";

module.exports = {
  color: embedColor,
  startCooldown: startCooldown,
  serverName: serverName,
  serverIcon: serverIcon,

  welcome: {
    title: "Whitelist",
    color: embedColor,
    thumbnail: "https://miro.medium.com/max/1400/1*iqFvVfidr3HOgupVbywvKA.png",
    description: `
        Eaí, tranquilo?
            Seja bem vindo a nossa comunidade de NFT!
        
        Para realizar whitelist, digite: 
        \`\`\`\!whitelist\`\`\`\
        E siga as minhas instruções.
    `,
  },
  questions:{
    color: embedColor,
    thumbnail: serverIcon,
    footer: `Você tem ${question.timer} minuto(s) para responder essa pergunta.`,
    description: ""

  },
  start: {
    title: serverName,
    color: embedColor,
    serverIcon: serverIcon,
    description: `
        Para começar a whitelist, digite:                    
       \`\`\`\iniciar\`\`\`\
    
       Responda todas as perguntas cuidadosamente e sem pressa.
       Para dar inicio ao questionário!`,
    footer: `Você tem ${startCooldown} minuto(s) para iniciar a whitelist.`,
  },
  answers: {
    title: "Aqui está suas perguntas e respostas de seu questionario",
    color: embedColor,
    image: "https://cdn.discordapp.com/avatars/",
    size: ".webp?size=64"
  },
  failure: `Cringe né miga kk`,
};
