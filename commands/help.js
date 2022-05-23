module.exports = {
    name:'help',
    description: 'Help command',
    execute(message, args){
        message.channel.send(`
*Thy requesteth is mine own order.*
        
    --help        - literally the title
    --sauce / s   - reply to image with command to return sauce
    --ping        - reply with pong
        `);
    }
}