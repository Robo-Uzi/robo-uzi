const Discord = require('discord.js');
const bot = new Discord.Client(); 
const TOKEN = 'MzI3NTc2NTE3MzcyODA1MTIw.DC3j_Q.ee4YUcacCfbEJFZBStKyJT3kV1E'
const PREFIX = '~';
const YTDL = require('ytdl-core');

//kinda disorganized

var servers = {};

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: 'audioonly'}));

    server.queue.shift();

    server.dispatcher.on('end', function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect(); 
    });
}

bot.on('ready', function() {
    console.log('Ready');

});

bot.on('message', (message) => {
    
    if (message.content == ('lil')) {
        message.channel.sendMessage('uzi vert');
    }
    
});

bot.on('message', (message) => {
    
    if (message.content.toLowerCase() == ('I love')) {
        message.channel.sendMessage('Lil Uzi Vert');
    }
    
});

bot.on('message', function(message) {
    if (message.author.equals(bot.user)) return; 

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case 'lil':
            message.channel.sendMessage('Uzi Vert');
            break;
        case 'play':
            if (!args[1]) {
                message.channel.sendMessage('Please provide a link.');
                return;
            }

            if (!message.member.voiceChannel) {
                message.channel.sendMessage('You must be in a voice channel.');
                return;
            }
            
            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
               play (connection, message);
            }); 
            break;
        case 'skip':
            var server = servers[message.guild.id];

            if (server.dispatcher) server.dispatcher.end();
            break;
        case 'stop':
        var server = servers[message.guild.id];

        if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
        break; 
        default:
            message.channel.sendMessage('Invalid command');
    }
}); 

bot.login(TOKEN);