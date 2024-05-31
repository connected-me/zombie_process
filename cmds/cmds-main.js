const persist = require('../persist/handle-data');

const commands = {
    top: {
        response: (user) => {
            // Implement the code for the TODO comment
            const data = persist.get.topCmds();
            const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
            //const totalUsage = Object.values(commands.usageCount).reduce((total, count) => total + count, 0);
            //const topThree = sorted.slice(0, 3).map(([key, value]) => `${key} was used ${(value / totalUsage * 100).toFixed(2)}% of all commands`);
            return `Top 3 used commands are: ${sorted.join(', ')}`;
        }
    },
    test123: {
        response: (user) => {
            console.log(persist.get.topCmds());
            return `User ${user} was upvoted!`
        }
    },
    youtube: {
        response: 'https://www.youtube.com/@attentiontoodetail'
    },
    website: {
        response: 'https://connected-me.com'
    },
    upvote: {
        response: (user) => {
            return `User ${user} was upvoted!`
        }
    },
    dice: {
        response: (user) => {
            return `User ${user} rolled ${Math.floor(Math.random() * 6) + 1}`
        }
    }
}

module.exports = commands