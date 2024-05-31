// external modules
const express = require('express');
const tmi = require('tmi.js');
const http = require('http');
const {Server} = require('socket.io');
var fs          = require('fs');
require('dotenv').config();

//internal modules
//main commands module
const cmds = require('./cmds/cmds-main');
const msgHandler = require('./cmds/msg-handler');
const persist = require('./persist/handle-data');

//regex to gather commands
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)+(?:\W+)?(.*)?/)

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const opts = {
    delay: 1000
}

const client = new tmi.Client({
    connection:{
        reconnect: true
    },
    options: {
        debug: true,
        messagesLogLevel: "info"
    },
    identity: {
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_BOT_TOKEN
    },
    channels: ['attentiontoodetail']
});

//connect client
client.connect();

//gather messages to do stuff
client.on('message', (channel, tags, message, self) => {
    //create timestamp
    newJSONmsg = msgHandler.bundleMsg(channel, tags, message, self);
    persist.set.msgNum(tags['display-name']);
    //emits message to front end
    io.emit("newMessage", newJSONmsg);
    //if message is not a command, exit
    if(self || !message.startsWith('!')) return;

    //if message is a command check for response
    const [raw, command, argument] = message.match(regexpCommand);
    const { response } = cmds[command] || {};

    //if there is no response, exit
    if(!response) return;
    persist.set.cmdNum(command);
    //if there is a response send it
    if(typeof response === 'function'){
        client.say(channel, response(tags['display-name'], argument));
        
    } else if (typeof response === 'string'){
        client.say(channel, response);
    }
});

//front end requests

app.get("/chat/", (req, res) => { 
    res.sendFile(__dirname + "/views/chat.html") 
});

app.get("/messages", (req, res) => {
    res.contentType('application/json');
    var messages = [];
    messages.push(JSONmsg);
    res.send(messages);
});

app.get('/music/:key', (req, res) => {
    //res.sendFile(__dirname + "/views/music.html")
    //console.log(musicPlayer.getMusicFiles('/home/chronoglass/Music/stream'));
    var key = req.params.key;

    var music = 'music/1.wav';

    var stat = fs.statSync(music);
    range = req.headers.range;
    var readStream;

    if (range !== undefined) {
        var parts = range.replace(/bytes=/, "").split("-");

        var partial_start = parts[0];
        var partial_end = parts[1];

        if ((isNaN(partial_start) && partial_start.length > 1) || (isNaN(partial_end) && partial_end.length > 1)) {
            return res.sendStatus(500); //ERR_INCOMPLETE_CHUNKED_ENCODING
        }

        var start = parseInt(partial_start, 10);
        var end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
        var content_length = (end - start) + 1;

        res.status(206).header({
            'Content-Type': 'audio/mpeg',
            'Content-Length': content_length,
            'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
        });

        readStream = fs.createReadStream(music, {start: start, end: end});
    } else {
        res.header({
            'Content-Type': 'audio/mpeg',
            'Content-Length': stat.size
        });
        readStream = fs.createReadStream(music);
    }
    readStream.pipe(res);
});

server.listen(3000, () => console.log('Listening on port 3000'))