const dotenv = require('dotenv');
const { MessageEmbed } = require('discord.js');
const Sagiri = require('sagiri');
const { channelMention } = require('@discordjs/builders');
const sagiriClient = Sagiri(process.env.SAUCE_TOKEN);




module.exports = {
    name:'saucenao',
    description: 'Retrieves sauce for images',
    async execute(message, reply){
        const imageLink = reply;
        const response = await sagiriClient(imageLink);
        console.log(response)
        for(let i = 0; i< 3; i++){
            const embed = new MessageEmbed()
                    .addFields(
                        { name: 'Similarity', value: `Reference image is ${response[i].similarity}% similar to the original image `},
                        { name: 'Link', value: response[i].url}
                    )
                    .addFields(
                        { name: 'Site', value: `${response[i].site}`, inline: true},
                        { name: 'Source', value: `${response[i].source}`, inline: true}
                    )
                    .setThumbnail(response[i].thumbnail);
                if(response[i].similarity > 70){
                    embed.setTitle(`Results ${i+1}: Good match`)
                    embed.setColor('#33AB5F')
                }else{
                    embed.setTitle(`Results ${i+1}: Bad match`)
                    embed.setColor('#B8293D')
                }

                if (typeof response[i].authorName === 'string' || response[i].authorName instanceof String){
                    embed.setFooter({ text: `Author: ${response[i].authorName}`})
                }
                console.log(response.source[i])


                message.channel.send({ embeds:[embed]})

            // else{
            // const embed = new MessageEmbed()
            //         .setTitle(`Results ${i+1}: Bad match`)
            //         .setColor('#B8293D')
            //         .addFields(
            //             { name: 'Similarity', value: `Reference image is ${response[i].similarity}% similar to the original image `},
            //             { name: 'Link', value: response[i].url}
            //         )
            //         .addFields(
            //             { name: '\u200B', value: '\u200B'},
            //             { name: 'Site', value: `${response[i].site}`, inline: true},
            //             { name: 'Index', value: `${response[i].index}`, inline: true}
            //         )
            //         .setThumbnail(response[i].thumbnail)

            //         message.channel.send({ embeds:[embed]})
            // }
            
            
        }

        
}
}