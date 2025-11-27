// 音乐数据
const musicData = [
    {
        title: "洛春赋",
        artist: "刘惠",
        audio: "./mp3/music0.mp3",
        video: "./mp4/video0.mp4",
        bg: "./img/bg0.png",
        record: "./img/record0.jpg",
        duration: "04:03"
    },
    {
        title: "江南烟雨",
        artist: "刘惠",
        audio: "./mp3/music1.mp3",
        video: "./mp4/video1.mp4",
        bg: "./img/bg1.png",
        record: "./img/record1.jpg",
        duration: "03:45"
    },
    {
        title: "花开彼岸",
        artist: "刘惠",
        audio: "./mp3/music2.mp3",
        video: "./mp4/video2.mp4",
        bg: "./img/bg2.png",
        record: "./img/record2.jpg",
        duration: "03:52"
    },
    {
        title: "月光下的思念",
        artist: "刘惠",
        audio: "./mp3/music3.mp3",
        video: "./mp4/video3.mp4",
        bg: "./img/bg3.png",
        record: "./img/record3.jpg",
        duration: "04:15"
    }
];

// DOM 元素
const audio = document.getElementById('audio');
const video = document.getElementById('video');
const videoPlayer = document.getElementById('videoPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const playPauseIcon = document.getElementById('playPauseIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const modeBtn = document.getElementById('modeBtn');
const listBtn = document.getElementById('listBtn');
const closeListBtn = document.getElementById('closeList');
const mvBtn = document.getElementById('mvBtn');
const closeVideoBtn = document.getElementById('closeVideo');
const muteBtn = document.getElementById('muteBtn');
const volumeIcon = document.getElementById('volumeIcon');
const playlist = document.getElementById('playlist');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const progressHandle = document.getElementById('progressHandle');
const volumeBar = document.getElementById('volumeBar');
const volumeLevel = document.getElementById('volumeLevel');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const playlistItems = document.querySelectorAll('.playlist-item');

// 播放器状态
let currentIndex = 0;
let isPlaying = false;
let isMuted = false;
let currentVolume = 0.7;
let playMode = 0; // 0:顺序播放, 1:随机播放, 2:单曲循环

// 初始化播放器
function initPlayer() {
    loadMusic(currentIndex);
    audio.volume = currentVolume;
    updateVolumeDisplay();
    
    // 设置事件监听器
    setupEventListeners();
}

// 加载音乐
function loadMusic(index) {
    const music = musicData[index];
    audio.src = music.audio;
    
    // 更新界面
    document.querySelector('.top-info h1').textContent = music.title;
    document.querySelector('.artist').textContent = `作者：${music.artist}`;
    
    // 更新背景和唱片
    updateBackground(index);
    updateRecord(index);
    
    // 更新播放列表激活状态
    updatePlaylistActive(index);
    
    // 更新总时长
    audio.addEventListener('loadedmetadata', function() {
        totalTimeEl.textContent = formatTime(audio.duration);
    });
}

// 更新背景
function updateBackground(index) {
    document.querySelectorAll('.bg').forEach((bg, i) => {
        bg.classList.toggle('active', i === index);
    });
}

// 更新唱片
function updateRecord(index) {
    document.querySelectorAll('.record').forEach((record, i) => {
        record.classList.toggle('active', i === index);
    });
}

// 更新播放列表激活状态
function updatePlaylistActive(index) {
    playlistItems.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

// 播放/暂停
function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
        video.pause();
        playPauseIcon.src = './img/继续播放.png';
    } else {
        audio.play();
        playPauseIcon.src = './img/暂停.png';
    }
    isPlaying = !isPlaying;
}

// 上一首
function playPrev() {
    currentIndex = (currentIndex - 1 + musicData.length) % musicData.length;
    loadMusic(currentIndex);
    if (isPlaying) {
        audio.play();
    }
}

// 下一首
function playNext() {
    if (playMode === 1) { // 随机播放
        currentIndex = Math.floor(Math.random() * musicData.length);
    } else { // 顺序播放
        currentIndex = (currentIndex + 1) % musicData.length;
    }
    loadMusic(currentIndex);
    if (isPlaying) {
        audio.play();
    }
}

// 切换播放模式
function togglePlayMode() {
    playMode = (playMode + 1) % 3;
    const modeIcons = ['./img/mode1.png', './img/mode2.png', './img/mode3.png'];
    modeBtn.querySelector('img').src = modeIcons[playMode];
}

// 切换静音
function toggleMute() {
    isMuted = !isMuted;
    audio.muted = isMuted;
    volumeIcon.src = isMuted ? './img/静音.png' : './img/音量.png';
    if (!isMuted) {
        audio.volume = currentVolume;
    }
}

// 设置音量
function setVolume(volume) {
    currentVolume = Math.max(0, Math.min(1, volume));
    audio.volume = currentVolume;
    volumeLevel.style.width = (currentVolume * 100) + '%';
    isMuted = false;
    audio.muted = false;
    volumeIcon.src = './img/音量.png';
}

// 更新音量显示
function updateVolumeDisplay() {
    volumeLevel.style.width = (currentVolume * 100) + '%';
}

// 设置进度
function setProgress(percent) {
    const time = percent * audio.duration;
    audio.currentTime = time;
}

// 时间格式化函数
function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

// 设置事件监听器
function setupEventListeners() {
    // 播放/暂停按钮
    playPauseBtn.addEventListener('click', togglePlayPause);
    
    // 上一首/下一首
    prevBtn.addEventListener('click', playPrev);
    nextBtn.addEventListener('click', playNext);
    
    // 播放模式
    modeBtn.addEventListener('click', togglePlayMode);
    
    // 播放列表
    listBtn.addEventListener('click', () => playlist.classList.add('show'));
    closeListBtn.addEventListener('click', () => playlist.classList.remove('show'));
    
    // MV播放
    mvBtn.addEventListener('click', () => {
        video.src = musicData[currentIndex].video;
        videoPlayer.classList.add('show');
        video.play();
    });
    closeVideoBtn.addEventListener('click', () => {
        videoPlayer.classList.remove('show');
        video.pause();
    });
    
    // 静音和音量控制
    muteBtn.addEventListener('click', toggleMute);
    volumeBar.addEventListener('click', (e) => {
        const rect = volumeBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        setVolume(percent);
    });
    
    // 进度条控制
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        setProgress(percent);
    });
    
    // 播放列表项点击
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            loadMusic(currentIndex);
            if (isPlaying) {
                audio.play();
            }
        });
    });
    
    // 音频时间更新
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const percent = (audio.currentTime / audio.duration) * 100;
            progress.style.width = percent + '%';
            progressHandle.style.left = percent + '%';
            currentTimeEl.textContent = formatTime(audio.currentTime);
        }
    });
    
    // 音频结束
    audio.addEventListener('ended', () => {
        if (playMode === 2) { // 单曲循环
            audio.currentTime = 0;
            audio.play();
        } else {
            playNext();
        }
    });
    
    // 视频结束
    video.addEventListener('ended', () => {
        videoPlayer.classList.remove('show');
    });
}

// 初始化播放器
document.addEventListener('DOMContentLoaded', initPlayer);