var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
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
    
    //Stupid command stuff
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            // Just add any case commands if you want to..
         }
     }
     
     // Mega Pranks, ID is michaels 
     if (message.substring(0, 20) == '<@95212457940754432>') {
        console.log("mikey recieved");
        var msg = message.substring(20).trim();
        console.log(msg);

        switch(msg) {
            case 'pub?':
                bot.sendMessage({
                    to: channelID,
                    message: 'yes'
                });
            break;
            case 'pubg?':
                bot.sendMessage({
                    to: channelID,
                    message: 'yes'
                });
            break;
            // Just add any case commands if you want to..
         }
     }
     
     if (message.substring(0, 21) == '<@427023974996901899>') {
        var msg = message.substring(21).trim();
        logger.info('Command sent: ' + msg);
        var args = msg.split(' ');
        var cmd = args[0];
        args = args.splice(1);
        
        switch(cmd) {
            case 'test':
                bot.sendMessage({
                    to: channelID,
                    message: 'What?'
                });
            break;
            case 'break':
                bot.sendMessage({
                    to: channelID,
                    message: '<@427023974996901899> break'
                });
            break;
            case 'bother':
                if(args.length != 2){
                    bot.sendMessage({
                        to: channelID,
                        message: 'Usage of **bother** command: bother @<user> <times>'
                    });
                } else {
                    var user = args[0];
                    var times = parseInt(args[1]);
                    setTimeout(botherFunction, 1000, user, times, channelID);
                }       
            break;
            
        }
     }
     
     
});

function botherFunction(user, times, channel) {
    bot.sendMessage({
        to: channel,
        message: "" + user + " hey"
    });
    if (times > 0){
        setTimeout(botherFunction, 1000, user, times - 1, channel);
    }
}
