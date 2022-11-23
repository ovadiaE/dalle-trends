require("dotenv").config();
const { IgApiClient } = require('instagram-private-api');
const { get } = require('request-promise');
const sharp = require('sharp')

const postToInsta = async (caption, image) => {
    const ig = new IgApiClient();
   
    ig.state.generateDevice(process.env.IG_USERNAME);
   
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
   
    let imageBuffer = await get({
        url: image,
        encoding: null, 
    });
    
    imageBuffer = await sharp(imageBuffer).jpeg().toBuffer();

    await ig.publish.photo({
        file: imageBuffer,
        caption: `Image produced by following trends:\n ${caption}`
    });
}

exports.postToInsta = postToInsta