'use strict';
var RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
let rtm = null;
let nlp = null;

function handleOnAuthenticated(rtmStartData) {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name} but not yet connected to a channel.`);
}

function handleOnMessage(message) {
    if (message.channel !== process.env.BOT_CHANNEL && 
        !message.text.toLowerCase().includes(process.env.BOT_NAME) &&
        !message.text.includes(process.env.BOT_REF)
        ) {
        return;
    }
    nlp.ask(message.text, (err, res) => {
        if (err) return console.log(err)

        try {
            if (!res.intent || !res.intent[0] || !res.intent[0].value) {
                throw new Error('Could not extract intent.')
            }

            const intent = require('./intents/'+res.intent[0].value+'Intent');
            return intent.process(res, (error, response) => {
                if (error) {return console.log(error.message)}
                return rtm.sendMessage(response, message.channel);
            })
        } catch(err) {
            console.log(err)
            console.log(res)
            rtm.sendMessage("Sorry, I don't what you mean.", message.channel);
        }
    })
}

function addAuthenticatedHandler(rtm, handler) {
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler);
}

module.exports.init = function(token, logLevel, nlpClient){
    nlp = nlpClient;
    rtm = new RtmClient(token, {logLevel: logLevel});
    addAuthenticatedHandler(rtm, handleOnAuthenticated);
    rtm.on(RTM_EVENTS.MESSAGE, handleOnMessage);
    return rtm;
}

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;