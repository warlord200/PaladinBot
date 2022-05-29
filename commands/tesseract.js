const { MessageEmbed } = require('discord.js');
const { createWorker } = require('tesseract.js');
const request = require('request');
const { v4: uuidv4 } = require('uuid');
const subscriptionKey = process.env.TRANS_KEY;
const endpoint = "https://api.cognitive.microsofttranslator.com";
const location = process.env.TRANS_LOCATION;



module.exports = {
    name:'Tesseract',
    description: 'Recognises image and converts to text',
    execute(message, reply){
        const worker = createWorker();
        const imageLink = reply;
        const embed = new MessageEmbed();

        (async () => {
            await worker.load();
            await worker.loadLanguage('eng+jpn');
            await worker.initialize('eng+jpn');
            const { data: { text } } = await worker.recognize(imageLink);

            let options = {
                method: 'POST',
                baseUrl: endpoint,
                url: 'translate',
                qs: {
                  'api-version': '3.0',
                  'to': 'en'
                },
                headers: {
                  'Ocp-Apim-Subscription-Key': subscriptionKey,
                  'Ocp-Apim-Subscription-Region': location,
                  'Content-type': 'application/json',
                  'X-ClientTraceId': uuidv4().toString()
                },
                body: [{
                      'text': text
                }],
                json: true,
            };
    
    
            request(options, function(err, res, body){
                const result = body[0].translations[0].text;
                console.log(typeof(result),result);
           
                embed.addFields({name: 'Sire this the translation', value: result });
               message.channel.send({ embeds:[embed]});
            });

    
            await worker.terminate();

        })();
    }
}
