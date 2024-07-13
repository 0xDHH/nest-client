const fs = require('fs');
const path = require('path');
const express = require('express');
const Rcon = require('simple-rcon');

// Paths to monitor
const logFilePath = path.join(__dirname, '../PathOfTitans/Saved/Logs/PathOfTItans.log');
const characterDirPath = path.join(__dirname, '../PathOfTitans/Saved/DatabaseCache/Character');
const accountDirPath = path.join(__dirname, '../PathOfTitans/Saved/DatabaseCache/Account');

var client = new Rcon({
    host: '127.0.0.1',
    port: '7779',
    password: 'abc'
})


client.on('authenticated', function () {
    console.log('Authenticated!');
}).on('connected', function () {
    console.log('Connected!');
}).on('disconnected', function () {
    console.log('Disconnected!');
});


function handleNewData(newData) {
    // Working with the log file if we ever need it.
}


let lastSize = 0;
function checkForNewData(filePath) {
    fs.stat(filePath, (err, stats) => {
        if (err) {
            console.error('Error getting file stats:', err);
            return;
        }

        if (stats.size > lastSize) {
            const newSize = stats.size;
            const sizeDifference = newSize - lastSize;

            const readStream = fs.createReadStream(filePath, {
                start: lastSize,
                end: newSize - 1
            });

            let newData = '';
            readStream.on('data', chunk => {
                newData += chunk;
            });

            readStream.on('end', () => {
                lastSize = newSize;
                handleNewData(newData);
            });

            readStream.on('error', err => {
                console.error('Error reading new data:', err);
            });
        }
    });
}

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const debouncedCheckForNewData = debounce(() => checkForNewData(logFilePath), 100);
fs.watch(logFilePath, (eventType, filename) => {
    if (eventType === 'change') {
        debouncedCheckForNewData();
    }
});

fs.stat(logFilePath, (err, stats) => {
    if (err) {
        console.error('Error getting initial file stats:', err);
    } else {
        lastSize = stats.size;
    }
});

console.log(`Watching for changes in ${logFilePath}...`);

const fileRecords = {};

function watchDirectory(directoryPath) {
    const debouncedHandleEvent = debounce((eventType, filename) => {
        if (filename) {
            const filePath = path.join(directoryPath, filename);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        if (fileRecords[filePath]) {
                            console.log(`File deleted: ${filename}`);
                            delete fileRecords[filePath];
                        }
                    } else {
                        console.error('Error getting file stats:', err);
                    }
                } else {
                    if (stats.isFile()) {
                        if (!fileRecords[filePath]) {
                            console.log(`File added: ${filename}`);
                        } else if (fileRecords[filePath].mtime < stats.mtime) {
                            console.log(`File changed: ${filename}`);
                        }
                        fileRecords[filePath] = { mtime: stats.mtime };
                    }
                }
            });
        }
    }, 100);

    fs.watch(directoryPath, (eventType, filename) => {
        debouncedHandleEvent(eventType, filename);
    });

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
        } else {
            files.forEach(file => {
                const filePath = path.join(directoryPath, file);
                fs.stat(filePath, (err, stats) => {
                    if (err) {
                        console.error('Error getting file stats:', err);
                    } else {
                        if (stats.isFile()) {
                            fileRecords[filePath] = { mtime: stats.mtime };
                            console.log(`Initial file: ${file}`);
                        }
                    }
                });
            });
        }
    });

    console.log(`Watching for changes in ${directoryPath}...`);
}

watchDirectory(characterDirPath);
watchDirectory(accountDirPath);

const app = express();
app.use(express.json());

app.post('/PlayerReport/:serverId', (req, res) => {
    const serverId = req.params.serverId;
    const event = req.body;
    console.log('Received webhook for server', serverId, ':', event);
    res.sendStatus(200);
});

app.post('/PlayerLogin/:serverId', (req, res) => {
    const serverId = req.params.serverId;
    const event = req.body;
    console.log('Received webhook for server', serverId, ':', event);
    res.sendStatus(200);
});

app.post('/PlayerLogout/:serverId', (req, res) => {
    const serverId = req.params.serverId;
    const event = req.body;
    console.log('Received webhook for server', serverId, ':', event);
    res.sendStatus(200);
});

app.post('/PlayerLeave/:serverId', (req, res) => {
    const serverId = req.params.serverId;
    const event = req.body;
    console.log('Received webhook for server', serverId, ':', event);
    res.sendStatus(200);
});

app.post('/PlayerKilled/:serverId', (req, res) => {
    const serverId = req.params.serverId;
    const event = req.body;
    console.log('Received webhook for server', serverId, ':', event);
    res.sendStatus(200);
});

app.post('/PlayerQuestComplete/:serverId', (req, res) => {
    const serverId = req.params.serverId;
    const event = req.body;
    console.log('Received webhook for server', serverId, ':', event);
    res.sendStatus(200);
});

app.post('/PlayerQuestFailed/:serverId', (req, res) => {
    const serverId = req.params.serverId;
    const event = req.body;
    console.log('Received webhook for server', serverId, ':', event);
    res.sendStatus(200);
});

app.post('/PlayerRespawn/:serverId', (req, res) => {
    const serverId = req.params.serverId;
    const event = req.body;
    console.log('Received webhook for server', serverId, ':', event);
    res.sendStatus(200);
});

app.post('/PlayerWaystone/:serverId', (req, res) => {
    const serverId = req.params.serverId;
    const event = req.body;
    console.log('Received webhook for server', serverId, ':', event);
    res.sendStatus(200);
});

app.post('/PlayerChat/:serverId', (req, res) => {
    const serverId = req.params.serverId;
    const event = req.body;
    console.log('Received webhook for server', serverId, ':', event);
    res.sendStatus(200);
});

app.post('/PlayerProfanity/:serverId', (req, res) => {
    const serverId = req.params.serverId;
    const event = req.body;
    console.log('Received webhook for server', serverId, ':', event);
    res.sendStatus(200);
});

app.post('/PlayerHack/:serverId', (req, res) => {
    const serverId = req.params.serverId;
    const event = req.body;
    console.log('Received webhook for server', serverId, ':', event);
    res.sendStatus(200);
});

app.post('/PlayerDamagedPlayer/:serverId', (req, res) => {
    const serverId = req.params.serverId;
    const event = req.body;
    console.log('Received webhook for server', serverId, ':', event);
    res.sendStatus(200);
});

app.post('/PlayerJoinedGroup/:serverId', (req, res) => {
    const serverId = req.params.serverId;
    const event = req.body;
    console.log('Received webhook for server', serverId, ':', event);
    res.sendStatus(200);
});

app.post('/PlayerLeftGroup/:serverId', (req, res) => {
    const serverId = req.params.serverId;
    const event = req.body;
    console.log('Received webhook for server', serverId, ':', event);
    res.sendStatus(200);
});

app.post('/PlayerPurchase/:serverId', (req, res) => {
    const serverId = req.params.serverId;
    const event = req.body;
    console.log('Received webhook for server', serverId, ':', event);
    res.sendStatus(200);
});

app.post('/ServerRestart/:serverId', (req, res) => {
    const serverId = req.params.serverId;
    const event = req.body;
    console.log('Received webhook for server', serverId, ':', event);
    res.sendStatus(200);
});

app.post('/ServerRestartCountdown/:serverId', (req, res) => {
    const serverId = req.params.serverId;
    const event = req.body;
    console.log('Received webhook for server', serverId, ':', event);
    res.sendStatus(200);
});

app.post('/ServerModerate/:serverId', (req, res) => {
    const serverId = req.params.serverId;
    const event = req.body;
    console.log('Received webhook for server', serverId, ':', event);
    res.sendStatus(200);
});

app.post('/ServerError/:serverId', (req, res) => {
    const serverId = req.params.serverId;
    const event = req.body;
    console.log('Received webhook for server', serverId, ':', event);
    res.sendStatus(200);
});

app.post('/AdminSpectate/:serverId', (req, res) => {
    const serverId = req.params.serverId;
    const event = req.body;
    console.log('Received webhook for server', serverId, ':', event);
    res.sendStatus(200);
});

app.post('/AdminCommand/:serverId', (req, res) => {
    const serverId = req.params.serverId;
    const event = req.body;
    console.log('Received webhook for server', serverId, ':', event);
    res.sendStatus(200);
});

app.post('/BadAverageTick/:serverId', (req, res) => {
    const serverId = req.params.serverId;
    const event = req.body;
    console.log('Received webhook for server', serverId, ':', event);
    res.sendStatus(200);
});


const PORT = 7778;
app.listen(PORT, '127.0.0.1', () => {
    console.log(`Express server listening on 127.0.0.1:${PORT}`);
});
