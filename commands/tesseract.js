module.exports = {
    name:'Tesseract',
    description: 'Recognises image and converts to text',
    execute(message, reply){
        const { MessageEmbed } = require('discord.js');
        const { createWorker } = require('tesseract.js');
        const worker = createWorker();
        const imageLink = reply;
        const embed = new MessageEmbed();

        (async () => {
        await worker.load();
        await worker.loadLanguage('eng+jpn');
        await worker.initialize('eng+jpn');
        const { data: { text } } = await worker.recognize(imageLink);
        embed.addFields({name: 'Translation', value: `${text}`});
        message.channel.send({ embeds:[embed]});

        await worker.terminate();
        })();
    }
}