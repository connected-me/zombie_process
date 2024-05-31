//define message json object
bundleMsg = (channel, tags, message, self) => {
    var seconds = new Date().getTime()/1000;
    newJSONmsg = {
        displayName: tags['display-name'],
        userName: tags.username,
        channel: channel,
        text: message,
        timeStamp: seconds
    }
    return newJSONmsg;
}

module.exports = {
    bundleMsg: bundleMsg
}