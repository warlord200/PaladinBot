const dotenv = require('dotenv');
const { MessageEmbed } = require('discord.js');
const Sagiri = require('sagiri');
const { channelMention } = require('@discordjs/builders');
const sagiriClient = Sagiri(process.env.SAUCE_TOKEN);




module.exports = {
    name:'saucenao',
    description: 'Retrieves sauce for images',
    async execute(message, args){
        const imageLink = `https://media.discordapp.net/attachments/933371160404578375/974333532333813760/IMG_0803.jpg?width=322&height=563`;
        const response = await sagiriClient(imageLink);
        console.log(response)
        for(let i = 0; i< 3; i++){
            if(response[i].similarity > 70){
            const passedEmbed = new MessageEmbed()
                    .setTitle(`Results ${i+1}: Good match`)
                    .setColor('#33AB5F')
                    .addFields(
                        { name: 'Link', value: response[i].url}
                    )
                    .addFields(
                        { name: 'Additional information', value: 
                        `Similarity: ${response[i].similarity}
                         Site: ${response[i].site}`}
                    )
                    .setThumbnail(response[i].thumbnail)

                message.channel.send({ embeds:[passedEmbed]})

                
            }else{
            const embed = new MessageEmbed()
                    .setTitle(`Results ${i+1}: Bad match`)
                    .setColor('#B8293D')
                    .addFields(
                        { name: 'Link', value: response[i].url}
                    )
                    .addFields(
                        { name: 'Additional information', value: 
                        `Similarity: ${response[i].similarity}
                         Site: ${response[i].site}`}
                    )
                    .setThumbnail(response[i].thumbnail)

                    message.channel.send({ embeds:[embed]})
            }
            
            
        }

        
}
}