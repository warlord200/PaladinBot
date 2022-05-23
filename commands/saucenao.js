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

        // check if authorname is string 

        if (typeof response[0].authorName === 'string' || response[0].authorName instanceof String){
            embed.setFooter({ text: `Author: ${response[0].authorName}`})
        }

        // check for twitter or pixiv link 

        if(response[0].similarity > 70){
            embed.setTitle('Sir, this is thy did request sauce.');
            embed.setColor('#33AB5F');
            embed.setImage
            ('https://images-ext-1.discordapp.net/external/EKDKQAsSwImLlUTKDvugutKCH1qcpbYMfzofsKmI2io/https/1.bp.blogspot.com/-iMhL9T7K8N0/XbujvmbiKDI/AAAAAAABr14/9F9TNWb3j5wMe9f4mjnFaVgcW9Ses6rfwCKgBGAsYHg/s1600/Azur%252BLane%252B-%252BEpisode%252B5%252B-%252BBelfast%252BElegant%252BCurtsie.gif');
            
            if(twitterURL.test(response[0].source)){
                embed.addFields(
                    { name:'Link', value: response[0].source}
                )
            
            }else if(pixivURL.test(response[0].url)){
                embed.addFields(
                    { name: 'Link', value: response[0].url}
                )
            
            }else{
                embed.addFields(
                    { name: 'Link', value: response[0].url}
                )
            }


        }else{
            embed.setTitle(`Deepest apologies, can't findeth thy sauce, this is the nearest one D:`);
            embed.setColor('#B8293D');
            embed.setImage('https://giffiles.alphacoders.com/938/93869.gif')
            embed.addFields(
                { name: 'Link', value: response[0].url}
            )
            
        }


        message.channel.send({ embeds:[embed]});




            

        // for(let i = 0;i < 5;i++){
        //     if(twitterURL.test(response[0].source)||pixivURL.test(response[0].url)){continue}
        //     if(response[i].similarity > 70){
        //         embed.addFields(
        //             { name: `Additional Results ${i+1}:`, value: response[i].url}
        //         )
        //     }else{continue}
        // }
        

            
            

        
}
}