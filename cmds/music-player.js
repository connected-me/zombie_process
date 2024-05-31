plcHolder = 0;
const fs = require('fs');
const path = require('path');
const MusicMetadata = require('music-metadata');

PATH = '/home/chronoglass/Music';

const getMusicFiles = (dir) => {
    const musicFiles = [];
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            musicFiles.push(...getMusicFiles(filePath));
        } else if (stat.isFile() && ['.mp3', '.m4a', '.flac'].includes(path.extname(filePath))) {
            MusicMetadata.parseFile(filePath, { native: true })
                .then(metadata => {
                    musicFiles.push({
                        filename: file,
                        filePath: filePath,
                        fileType: path.extname(filePath).slice(1),
                        title: metadata.common.title,
                        artist: metadata.common.artist,
                        album: metadata.common.album,
                        track: metadata.common.track.no,
                        year: metadata.common.year,
                        genre: metadata.common.genre,
                        duration: metadata.format.duration
                    });
                });
        } else if (stat.isFile() && ['.wav'].includes(path.extname(filePath))) {
            musicFiles.push({
                filename: file,
                filePath: filePath,
                fileType: path.extname(filePath).slice(1)
            });
        }
    });
    return musicFiles;
}

const io = require('socket.io');
const socket = io('http://localhost:3000');

socket.on('connect', () => {
    socket.emit('initialMusicList', getMusicFiles(PATH));
});

socket.on('playMusic', (music) => {
    socket.emit('newSong', music);
    const spawn = require('child_process').spawn;
    const player = spawn('mpg123', [music.filePath]);
    player.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    player.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    player.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
});

socket.on('playNext', () => {
    const musicFiles = getMusicFiles('music/');
    const currentMusic = musicFiles[plcHolder];
    plcHolder += 1;
    if (plcHolder >= musicFiles.length) {
        plcHolder = 0;
    }
    socket.emit('newSong', musicFiles[plcHolder]);
    const spawn = require('child_process').spawn;
    const player = spawn('mpg123', [currentMusic.filePath]);
    player.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    player.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    player.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
});




module.exports = {
    getMusicFiles: getMusicFiles
};