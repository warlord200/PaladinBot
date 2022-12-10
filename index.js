// check if connected to internet
// must start with
// pm2 start index.js --restart-delay=10000 --watch --wait-ready

const DiscordJS = require("discord.js");
const { Intents, Client, Events, GatewayIntentBits } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();
const prefix = ",";
const fs = require("fs");
const { setInterval } = require("timers/promises");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.on("ready", (client) => {
  console.log("Bot is ready");
});

client.commands = new DiscordJS.Collection();
const commandFiles = fs
  .readdirSync("./commands/")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    client.commands.get("ping").execute(message, args);
  } else if (command === "sauce" || command === "s") {
    if (message.reference === null) return;

    // check if it is a reply
    await message.fetchReference().then((msg) => {
      if (
        msg.attachments.size !== 0 ||
        msg.content.includes("jpg", "jpeg", "png")
      ) {
        const reply =
          msg.attachments.size !== 0
            ? msg.attachments.first().url
            : msg.content;
        console.log(reply);
        client.commands.get("saucenao").execute(message, reply);
      }
    });
  } else if (command === "help") {
    client.commands.get("help").execute(message, args);
  } else if (command === "ocr" || command === "jp" || command === "manga") {
    if (message.reference === null) {
      message.channel.send("Thou shall reply to an image so I can work with");
      return;
    }

    // check if it is a reply
    await message.fetchReference().then((msg) => {
      if (
        msg.attachments.size !== 0 ||
        msg.content.includes("jpg", "jpeg", "png")
      ) {
        const reply =
          msg.attachments.size !== 0
            ? msg.attachments.first().url
            : msg.content;
        console.log(reply);
        console.log(command);
        client.commands.get("OCR").execute(message, reply, command);
      }
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
