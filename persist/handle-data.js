const fs = require('fs');

const dataDir = './persist/data/';
const cFileName = 'cucdata.json';
const uFileName = 'umcdata.json';

const get = {
    // get the number of messages for a user
    msgNum: (user) => {
        const fileName = `${dataDir}${uFileName}`;
        try {
            fs.accessSync(fileName, fs.constants.F_OK);
            const dataString = fs.readFileSync(fileName, 'utf8');
            const data = JSON.parse(dataString);
            return data[user] || 0;
        } catch (err) {
            // file doesn't exist or is empty, return 0
            return 0;
        }
    },
    cmdNum: (command) => {
        const fileName = `${dataDir}${cFileName}`;
        try {
            fs.accessSync(fileName, fs.constants.F_OK);
            const dataString = fs.readFileSync(fileName, 'utf8');
            const data = JSON.parse(dataString);
            return data[command] || 0;
        } catch (err) {
            // file doesn't exist or is empty, return 0
            return 0;
        }
    },
    topCmds: () => {
        // get the top 3 most used commands and return them as an object that includes the number of uses
        const fileName = `${dataDir}${cFileName}`;
        try {
            fs.accessSync(fileName, fs.constants.F_OK);
            const dataString = fs.readFileSync(fileName, 'utf8');
            const data = JSON.parse(dataString);
            const sortedCommands = Object.entries(data).sort((a, b) => b[1] - a[1]);
            return sortedCommands.slice(0, 3).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {});
        } catch (err) {
            return {};
        }
    }
}

const set = {
    msgNum: (user) => {
        const fileName = `${dataDir}${uFileName}`;
        try {
            fs.accessSync(fileName, fs.constants.F_OK);
            const dataString = fs.readFileSync(fileName, 'utf8');
            const data = JSON.parse(dataString);
            if (data[user]) {
                data[user]++;
            } else {
                data[user] = 1;
            }
            fs.writeFileSync(fileName, JSON.stringify(data));
        } catch (err) {
            const data = { [user]: 1 };
            fs.writeFileSync(fileName, JSON.stringify(data));
        }
    },
    cmdNum: (command) => {
        //get the number of times a command has been used from the data file or create it if it doesn't exist
        const fileName = `${dataDir}${cFileName}`;
        try {
            fs.accessSync(fileName, fs.constants.F_OK);
            const dataString = fs.readFileSync(fileName, 'utf8');
            const data = JSON.parse(dataString);
            if (data[command]) {
                data[command]++;
            } else {
                data[command] = 1;
            }
            fs.writeFileSync(fileName, JSON.stringify(data));
            return data[command];
        } catch (err) {
            const data = { [command]: 1 };
            fs.writeFileSync(fileName, JSON.stringify(data));
            return data[command];
        }
    }
}

module.exports = {
    get: get, 
    set: set
}
