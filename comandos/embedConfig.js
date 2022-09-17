const question = require('./questionsConfig.json');

const embedColor = '#E74B3C';
const startCooldown = 1;
const serverName = "SOONFT Introduction";
const serverIcon = "";

module.exports = {
  color: embedColor,
  startCooldown: startCooldown,
  serverName: serverName,
  serverIcon: serverIcon,

  welcome: {
    title: "Introduce Yourself",
    color: embedColor,
    thumbnail: "https://cdn.discordapp.com/attachments/941805859636396093/945671266990448660/Frame_3_1.png",
    description: `
        Please take a minute, and complete the introduction process so everyone can get to know you
        
        To get started, type the command below:
        \`\`\`\!introduction \`\`\`\
    `,
  },
  questions:{
    color: embedColor,
    thumbnail: serverIcon,
    footer: `You have ${question.timer} minute(s) to answer that question.`,
    description: ""

  },
  start: {
    title: serverName,
    color: embedColor,
    serverIcon: serverIcon,
    description: `
      To get started, type the command below:     
         \`\`\`\start\`\`\`\
  `,
  },
  answers: {
    title: "New Member Introduction",
    color: embedColor,
    image: "https://cdn.discordapp.com/avatars/",
    size: ".webp?size=64"
  },
  failure: `Error`,
};
