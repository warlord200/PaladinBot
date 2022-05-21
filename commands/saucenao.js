const dotenv = require('dotenv');
const { MessageEmbed } = require('discord.js');
const Sagiri = require('sagiri');
const { channelMention, EmbedBuilder } = require('@discordjs/builders');
const sagiriClient = Sagiri(process.env.SAUCE_TOKEN);




module.exports = {
    name:'saucenao',
    description: 'Retrieves sauce for images',
    async execute(message, reply){
        const twitterURL = /https:\/\/twitter\.com\/([a-zA-Z0-9_]+)\/status\/\d+/gi;
        const pixivURL = /(?:https?:\/\/)?(?:www\.)?pixiv\.net\/member_illust\.php\?mode=.+&illust_id=\d+/i;
        const imageLink = reply;
        const response = await sagiriClient(imageLink);
        console.log(response)
        const embed = new MessageEmbed();
        embed.addFields(
            { name: 'Similarity', value: `Reference image is ${response[0].similarity}% similar to the original image `}
        )
        embed.setThumbnail(response[0].thumbnail);
        if (typeof response[0].authorName === 'string' || response[0].authorName instanceof String){
            embed.setFooter({ text: `Author: ${response[0].authorName}`})
        }

        // check for twitter or pixiv link 

        if(response[0].similarity > 70){
            embed.setTitle('Good Results found!')
            embed.setColor('#33AB5F')
            
            if(twitterURL.test(response[0].source)){
                embed.addFields(
                    { name:'Link', value: response[0].source}
                )

            }else if(pixivURL.test(response[0].url)){
                embed.addFields(
                    { name: 'Link', value: response[0].url}
                )
            }
            for(let i = 0;i < 5;i++){
                if(twitterURL.test(response[0].source)||pixivURL.test(response[0].url)){continue}
                if(response[i].similarity > 70){
                    embed.addFields(
                        { name: `Additional Results ${i+1}:`, value: response[i].url}
                    )
                }else{continue}
            }


        }else{
            embed.setTitle('No Good Results found \:\(');
            embed.setColor('#B8293D');
            embed.addFields(
                { name: 'Link', value: response[0].url}
            )
            
        }


        message.channel.send({ embeds:[embed]});




            // const embed = new MessageEmbed()
            //         .addFields(
            //             { name: 'Similarity', value: `Reference image is ${response[i].similarity}% similar to the original image `},
            //             { name: 'Link', value: response[i].url}
            //         )
            //         .addFields(
            //             { name: 'Site', value: `${response[i].site}`, inline: true},
            //             { name: 'Source', value: `${response[i].source}`, inline: true}
            //         )
            //         .setThumbnail(response[i].thumbnail);
            //     if(response[i].similarity > 70){
            //         embed.setTitle(`Results ${i+1}: Good match`)
            //         embed.setColor('#33AB5F')
            //     }else{
            //         embed.setTitle(`Results ${i+1}: Bad match`)
            //         embed.setColor('#B8293D')
            //     }

                // if (typeof response[i].authorName === 'string' || response[i].authorName instanceof String){
                //     embed.setFooter({ text: `Author: ${response[i].authorName}`})
            //     }


            //     message.channel.send({ embeds:[embed]})

            
            

        
}
}