var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');

var memeLog = fs.createWriteStream('meme_log.txt', {
    flags: 'a'
});
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    console.log(message);
    
    
    var parts = message.split(' ');
    var memeCount = 0;
    for(var i = 0; i < parts.length; i++){
        var str = parts[i];
        if(str.includes('.com') || str.includes('.net') || str.includes('.org')){
            memeCount++;
            if(str.includes('.jpg')){
                if(str.indexOf('.jpg') == str.length - 4){
                    logger.info("img: " + message);
                    memeLog.write("img: " + message);
                }
            } else if (str.includes(".gifv")) {
                if(str.indexOf('.gifv') == str.length - 5){
                    logger.info("gifv: " + message);
                    memeLog.write("gifv: " + message);
                }
            } 
            else if (str.includes(".gif")) {
                if(str.indexOf('.gif') == str.length - 4){
                    logger.info("gif: " + message);
                    memeLog.write("gif: " + message);
                }
            } else if (str.includes("imgur.com/gallery/")) {
                logger.info("gal: " + message); 
                memeLog.write("gal: " + message);
            } else if (str.includes("i.imgur.com/")){
                logger.info("img: " + message);
                memeLog.write("img: " + message);
            } else if(str.includes("imgur.com/")){
                var fixedURL = str.substring(0, str.indexOf("imgur.com/")) + "i." + str.substring(str.indexOf("imgur.com/")) + ".jpg";
                logger.info("img: " + fixedURL);
                memeLog.write("img: " + fixedURL); 
            } else {
                memeCount--;
            }
            if(memeCount > 0){
                var memeAlert = "Detected and saved " + memeCount + " meme" + (memeCount > 1 ? "s" : "");
                bot.sendMessage({
                    to: channelID,
                    message: memeAlert
                });
            }
        }
        

        
    }
     
     
});


