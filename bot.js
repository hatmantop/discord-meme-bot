var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');
var os = require("os");
var http = require("http");
var querystring = require('querystring');

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
    console.log("Guild Message: " + message);
    
    var msgParts = message.split(' ');
    if(msgParts[0].trim() == '<@427211373924057088>'){
        console.log("Command Recieved");
        if(msgParts.length == 1) {
            bot.sendMessage({
                to: channelID,
                message: "**USAGE:** @meme-master **<command>**"
            });
        } else if(msgParts.length == 2){
            var cmd = msgParts[1].trim();
            switch(cmd){
                case 'help':
                    bot.sendMessage({
                        to: channelID,
                        message: "Hi " + user + "! I am currently storing your memes!"
                    });
                    break;
                default:
                    bot.sendMessage({
                        to: channelID,
                        message: "Command not supported yet. Use help for functionalities"
                    });
                    break;
            }
        }      
    }

    handleMemes(channelID, message);
});

function handleMemes(channel, msg){
    var parts = msg.split(' ');
    var memeCount = 0;
    for(var i = 0; i < parts.length; i++){
        var str = parts[i];
        if(str.includes('.com') || str.includes('.net') || str.includes('.org') || str.includes('.dog') || str.includes('.it')){
            memeCount++;
            if(str.includes('.jpg')){
                if(str.indexOf('.jpg') == str.length - 4){
                    logger.info("img: " + msg);
                    memeLog.write("img: " + msg + os.EOL);
                    postMemeInfo('img', msg);
                }
            } else if (str.includes(".gifv")) {
                if(str.indexOf('.gifv') == str.length - 5){
                    logger.info("gifv: " + msg);
                    memeLog.write("gifv: " + msg + os.EOL);
                }
            } 
            else if (str.includes(".gif")) {
                if(str.indexOf('.gif') == str.length - 4){
                    logger.info("gif: " + msg);
                    memeLog.write("gif: " + msg + os.EOL);
                }
            } else if (str.includes("imgur.com/gallery/")) {
                logger.info("gal: " + msg); 
                memeLog.write("gal: " + msg + os.EOL);
            } else if (str.includes("i.imgur.com/")){
                logger.info("img: " + msg);
                memeLog.write("img: " + msg + os.EOL);
            } else if(str.includes("imgur.com/")){
                var fixedURL = str.substring(0, str.indexOf("imgur.com/")) + "i." + str.substring(str.indexOf("imgur.com/")) + ".jpg";
                logger.info("img: " + fixedURL);
                memeLog.write("img: " + fixedURL + os.EOL); 
                //memeLog.write('');
            } else {
                memeCount--;
            }
            
        }   
    }
    if(memeCount > 0){
        var memeAlert = "Detected and saved " + memeCount + " meme" + (memeCount > 1 ? "s" : "");
        bot.sendMessage({
            to: channel,
            message: memeAlert
        });
    }
}

function postMemeInfo(type, url) {
    var postData = querystring.stringify({
        'type': type,
        'url': url
    });

    var options = {
        hostname: '192.168.1.111',
        port: 80,
        path: '/meme_master/memeServer.php',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, (res) => {
        console.log(`STATUS ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    });

    req.on('error', (e) => {
        console.error('problem with request: ${e.message}');
    });

    req.write(postData);
    req.end();
}


