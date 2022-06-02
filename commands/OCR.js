const { MessageEmbed } = require('discord.js');
const request = require('request');
const { v4: uuidv4 } = require('uuid');
const subscriptionKey = process.env.TRANS_KEY;
const endpoint = "https://api.cognitive.microsofttranslator.com";
const location = process.env.LOCATION;
const keyOCR = process.env.OCR_KEY;
const endpointOCR = 'https://jekyllvision.cognitiveservices.azure.com/';
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;
const async = require('async');
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient
const sleep = require('util').promisify(setTimeout);



module.exports = {
    name:'OCR',
    description: 'Recognises image and converts to text',
    execute(message, reply){
        const embed = new MessageEmbed();

        (async () => {
            async.series([
                async function () {
                    const computerVisionClient = new ComputerVisionClient(new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': keyOCR } }), endpointOCR);
                let arrJoin = [];
            
                  /**
                   * OCR: READ PRINTED & HANDWRITTEN TEXT WITH THE READ API
                   * Extracts text from images using OCR (optical character recognition).
                   */
                  console.log('-------------------------------------------------');
                  console.log('READ PRINTED, HANDWRITTEN TEXT AND PDF');
                  console.log();
            
                  // URL images containing printed and/or handwritten text. 
                  // The URL can point to image files (.jpg/.png/.bmp) or multi-page files (.pdf, .tiff).
                  const imageLink = reply;
            
                  // Recognize text in printed image from a URL
                  console.log('Read printed text from URL...', imageLink.split('/').pop());
                  const printedResult = await readTextFromURL(computerVisionClient, imageLink);
                  printRecText(printedResult);
            
                  // Perform read and await the result from URL
                  async function readTextFromURL(client, url) {
                    // To recognize text in a local image, replace client.read() with readTextInStream() as shown:
                    let result = await client.read(url);
                    // Operation ID is last path segment of operationLocation (a URL)
                    let operation = result.operationLocation.split('/').slice(-1)[0];
            
                    // Wait for read recognition to complete
                    // result.status is initially undefined, since it's the result of read
                    while (result.status !== "succeeded") { await sleep(1000); result = await client.getReadResult(operation); }
                    return result.analyzeResult.readResults; // Return the first page of result. Replace [0] with the desired page if this is a multi-page file such as .pdf or .tiff.
                  }

            
                  // Prints all text from Read result
                  function printRecText(readResults) {
                    console.log('Recognized text:');
                    for (const page in readResults) {
                      const result = readResults[page];
                      if (result.lines.length) {
                          for(const line of result.lines){
                              arrJoin.push(line.text);

                          }}
                      else { console.log('No recognized text.'); }
                    }}
                  console.log(arrJoin)
                  const arrJoined = arrJoin.join('\n')

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
                          'text': arrJoined
                    }],
                    json: true,
                };
        
        
                request(options, function(err, res, body){
                    console.log(body)
                    const result = body[0].translations[0].text;
                    console.log('Translated Results:',result);
               
                    embed.addFields({name: 'Sire this the translation', value: result });
                   message.channel.send({ embeds:[embed]});
                });
                console.log();
                console.log('-------------------------------------------------');
                console.log('End of quickstart.');
            
                },
                function () {
                  return new Promise((resolve) => {
                    resolve();
                  })
                }
              ], (err) => {
                throw (err);
              });


        })();
    }
}
