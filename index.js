const DiscordJS = require('discord.js');
const { Intents } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const prefix ='|';
const fs = require('fs');


const client = new DiscordJS.Client({
intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
]}) 


client.on('ready',()=>{
    console.log('Bot is ready')
});



client.commands = new DiscordJS.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}



client.on('messageCreate',message =>{
    if(!message.content.startsWith(prefix) || message.author.bot)return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === 'ping'){
        client.commands.get('ping').execute(message, args);
    }
})


client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }
});
    
    

    client.login(process.env.TOKEN)