// 播放器核心功能类
class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audio');
        this.currentIndex = 0;
        this.isPlaying = false;
        this.playMode = 0; // 0:顺序, 1:随机, 2:单曲循环
        this.volume = 0.7;
        this.isMuted = false;
    }

    // 播放指定索引的音乐
    play(index) {
        this.currentIndex = index;
        this.audio.src = musicData[index].audio;
        this.audio.load();
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updatePlayState();
        }).catch(error => {
            console.error('播放失败:', error);
        });
    }

    // 暂停播放
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayState();
    }

    // 继续播放
    resume() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updatePlayState();
        });
    }

    // 切换播放/暂停
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.resume();
        }
    }

    // 播放上一首
    playPrevious() {
        let newIndex;
        if (this.playMode === 1) { // 随机播放
            newIndex = this.getRandomIndex();
        } else { // 顺序播放
            newIndex = (this.currentIndex - 1 + musicData.length) % musicData.length;
        }
        this.play(newIndex);
    }

    // 播放下一首
    playNext() {
        let newIndex;
        if (this.playMode === 1) { // 随机播放
            newIndex = this.getRandomIndex();
        } else { // 顺序播放
            newIndex = (this.currentIndex + 1) % musicData.length;
        }
        this.play(newIndex);
    }

    // 获取随机索引（确保不与当前相同）
    getRandomIndex() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * musicData.length);
        } while (newIndex === this.currentIndex && musicData.length > 1);
        return newIndex;
    }

    // 切换播放模式
    togglePlayMode() {
        this.playMode = (this.playMode + 1) % 3;
        this.updateModeDisplay();
    }

    // 设置音量
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.audio.volume = this.volume;
        this.isMuted = false;
        this.audio.muted = false;
        this.updateVolumeDisplay();
    }

    // 切换静音
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.audio.muted = this.isMuted;
        this.updateVolumeDisplay();
    }

    // 跳转到指定时间
    seekTo(time) {
        this.audio.currentTime = time;
    }

    // 跳转到百分比位置
    seekToPercentage(percentage) {
        const time = percentage * this.audio.duration;
        this.seekTo(time);
    }

    // 更新播放状态显示
    updatePlayState() {
        const icon = document.getElementById('playPauseIcon');
        if (icon) {
            icon.src = this.isPlaying ? '暂停.png' : '继续播放.png';
        }
    }

    // 更新播放模式显示
    updateModeDisplay() {
        const modeIcons = ['model.png', 'mode2.png', 'mode3.png'];
        const modeBtn = document.getElementById('modeBtn');
        if (modeBtn) {
            modeBtn.querySelector('img').src = modeIcons[this.playMode];
        }
    }

    // 更新音量显示
    updateVolumeDisplay() {
        const volumeIcon = document.getElementById('volumeIcon');
        const volumeLevel = document.getElementById('volumeLevel');
        
        if (volumeIcon) {
            volumeIcon.src = this.isMuted ? '静音.png' : '音量.png';
        }
        
        if (volumeLevel) {
            volumeLevel.style.width = (this.volume * 100) + '%';
        }
    }

    // 获取当前播放时间
    getCurrentTime() {
        return this.audio.currentTime;
    }

    // 获取总时长
    getDuration() {
        return this.audio.duration;
    }

    // 获取播放进度百分比
    getProgressPercentage() {
        return this.audio.currentTime / this.audio.duration;
    }

    // 销毁播放器
    destroy() {
        this.audio.pause();
        this.audio.src = '';
        this.isPlaying = false;
    }
}

// 创建全局播放器实例
const musicPlayer = new MusicPlayer();

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}