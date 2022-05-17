const {SauceNao} = require('saucenao.js');
const sauce = new SauceNao({api_key: process.env.SAUCE_TOKEN})

module.exports = {
    name:'saucenao2',
    description: 'this is a ping command!',
    async execute(message, reply){
        
        const imageLink = reply;
        const response = await sauce.find({url: imageLink},{numres: 4}).then((data) => {
            
        })
        
    }
}