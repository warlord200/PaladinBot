const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "help",
  description: "Help command",
  execute(message, args) {
    const embed = new MessageEmbed();
    embed.setColor("#F0F8FF");
    embed.setFooter({
      text: "Jekyll",
      icon_url:
        "https://pbs.twimg.com/media/FSK1woJagAIZNbC?format=jpg&name=4096x4096",
    });
    embed.addFields({
      name: "*Thy requesteth is mine own order.*",
      value: `
 
 
**--help**        - literally the title
**--sauce / s**   - reply to image with command to return sauce
**--ping**        - replies with pong!
**--jp / j**      - translate image to text (currently only japanese)

More features coming soon (hopefully)
`,
    });
    message.channel.send({ embeds: [embed] });
  },
};
