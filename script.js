var i = 1;

document.addEventListener('click', function (event) {
    launchArrowWithTrajectory(event.clientX, event.clientY);

    var tapScreen = document.getElementById(`tapScreen`)
    if (!tapScreen) return;

    var fadeOut = setInterval(fade, 10);
    function fade() {
        if (tapScreen.style.opacity <= 0) { clearInterval(fadeOut); tapScreen.style.display = 'none'; }
        tapScreen.style.opacity -= 0.01
    }
});

function rain() {
    setInterval(() => {
        launchArrowWithTrajectory(Math.random() * window.innerWidth, Math.random() * 700, window.innerHeight);
        const arrow = document.getElementById(`arrow${i === 1 ? 20 : i - 1}`);
        if (arrow) {
            arrow.style.width = '5vw';
            arrow.style.opacity = 0.25;
            arrow.style.zIndex = 0;
        }
    }, 500);
}

const musicTracks = [
    {
        title: 'Splintered',
        artist: 'Jgouken',
        desc: ['A textured, lo-fi beat for the opening track.', 'Some second thing.'],
        src: 'audio/splintered.mp3',
        bg: 'linear-gradient(180deg, rgba(12,14,30,0.9), rgba(12,14,30,0.45)), url("images/jam.jpg")'
    },
    // {
    //     title: 'TBG OST',
    //     artist: 'Jgouken',
    //     desc: ['A cinematic, moody palette of synths and percussion.', 'Another description for the second track.'],
    //     src: 'audio/TBG OST.mp3',
    //     bg: 'linear-gradient(180deg, rgba(6,8,18,0.9), rgba(6,8,18,0.45)), url("images/jam.png")'
    // }
];

(function musicPortfolio() {
    const section = document.getElementById('musicPortfolio');
    const audio = document.getElementById('musicPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const seekBar = document.getElementById('seekBar');
    const playerTime = document.getElementById('playerTime');
    const prevTrack = document.getElementById('prevTrack');
    const nextTrack = document.getElementById('nextTrack');
    const trackTitle = document.getElementById('trackTitle');
    const trackArtist = document.getElementById('trackArtist');
    const trackDesc = document.getElementById('trackDesc');
    const trackBadge = document.getElementById('trackBadge');
    const playerBar = document.getElementById('musicPlayerBar');

    if (!section || !audio) return;

    let currentIndex = 0;
    let isUserSeeking = false;
    let wasPlayingDuringSeek = false;
    let audioCtx, analyser, dataArray, timeArray, canvas, canvasCtx;

    function initAudioVisualizer() {
        if (audioCtx) return;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createMediaElementSource(audio);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        canvas = document.getElementById('oscilloscopeCanvas');
        if (!canvas) return;
        canvasCtx = canvas.getContext('2d');
        timeArray = new Uint8Array(analyser.fftSize);
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        const resizeCanvas = () => {
            const ratio = window.devicePixelRatio || 1;
            canvas.width = canvas.clientWidth * ratio;
            canvas.height = canvas.clientHeight * ratio;
            canvasCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const draw = () => {
            requestAnimationFrame(draw);
            analyser.getByteTimeDomainData(timeArray);
            analyser.getByteFrequencyData(dataArray);
            const low = dataArray.slice(0, 10);

            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            canvasCtx.clearRect(0, 0, width, height);
            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = 'rgba(255,150,80,0.75)';
            canvasCtx.beginPath();
            const slice = width / timeArray.length;
            for (let i = 0; i < timeArray.length; i++) {
                const x = i * slice;
                const y = height * 0.5 + (timeArray[i] / 255 - 0.5) * height * 0.65;
                if (i === 0) canvasCtx.moveTo(x, y);
                else canvasCtx.lineTo(x, y);
            }
            canvasCtx.stroke();
        };
        draw();
    }

    function formatTime(value) {
        if (isNaN(value)) return '0:00';
        const minutes = Math.floor(value / 60);
        const seconds = Math.floor(value % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    function updateSeekFill() {
        const percent = seekBar.value || 0;
        seekBar.style.background = `linear-gradient(90deg, rgb(255, 51, 0), rgb(255, 136, 0) ${percent}%, rgba(255,255,255,0.15) ${percent}%, rgba(255,255,255,0.15) 100%)`;
    }

    function updateUI() {
        const track = musicTracks[currentIndex];
        section.style.backgroundImage = track.bg;
        trackTitle.textContent = track.title;
        trackArtist.textContent = track.artist;
        trackDesc.textContent = track.desc[0];
        trackBadge.textContent = `TRACK ${currentIndex + 1}`;
        audio.src = encodeURI(track.src);
        audio.load();
        playerTime.textContent = `0:00 / 0:00`;
        seekBar.value = 0;
        updateSeekFill();
        playPauseBtn.textContent = 'Play';
        playerBar.classList.remove('playing');
    }

    function togglePlay() {
        if (!audioCtx) initAudioVisualizer();
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => { });
        }
        if (audio.paused) {
            audio.play().catch(() => { });
        } else {
            audio.pause();
        }
    }

    function applyPlayingState() {
        if (audio.paused) {
            playPauseBtn.textContent = 'Play';
            playerBar.classList.remove('playing');
        } else {
            playPauseBtn.textContent = 'Pause';
            playerBar.classList.add('playing');
        }
    }

    function setTrack(index, autoPlay = false) {
        currentIndex = (index + musicTracks.length) % musicTracks.length;
        updateUI();
        if (autoPlay) {
            audio.play().catch(() => { });
        }
    }

    function playNext(autoPlay = false) {
        setTrack(currentIndex + 1, autoPlay);
    }

    prevTrack.addEventListener('click', () => {
        const keepPlaying = !audio.paused;
        setTrack(currentIndex - 1, keepPlaying);
    });
    nextTrack.addEventListener('click', () => {
        const keepPlaying = !audio.paused;
        setTrack(currentIndex + 1, keepPlaying);
    });
    playPauseBtn.addEventListener('click', togglePlay);

    audio.addEventListener('loadedmetadata', () => {
        playerTime.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    });

    audio.addEventListener('timeupdate', () => {
        if (!isUserSeeking && audio.duration) {
            const value = (audio.currentTime / audio.duration) * 100;
            seekBar.value = value;
            updateSeekFill();
        }
        playerTime.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    });

    audio.addEventListener('play', applyPlayingState);
    audio.addEventListener('pause', applyPlayingState);
    audio.addEventListener('ended', () => playNext(true));

    seekBar.addEventListener('input', () => {
        if (!isUserSeeking) {
            wasPlayingDuringSeek = !audio.paused;
            if (!audio.paused) {
                audio.pause();
            }
        }
        isUserSeeking = true;
        const newTime = (seekBar.value / 100) * audio.duration;
        playerTime.textContent = `${formatTime(newTime)} / ${formatTime(audio.duration)}`;
        updateSeekFill();
    });

    seekBar.addEventListener('change', () => {
        if (!audio.duration) return;
        audio.currentTime = (seekBar.value / 100) * audio.duration;
        isUserSeeking = false;
        if (wasPlayingDuringSeek) {
            audio.play().catch(() => { });
        }
        wasPlayingDuringSeek = false;
    });

    setTrack(0, false);
})();

function launchArrowWithTrajectory(clickX, clickY, bottomY) {
    if (i > 10) var oldArrow = document.getElementById(`arrow${i - 10}`)
    else var oldArrow = document.getElementById(`arrow${i + 10}`)
    if (!oldArrow) return;
    var fadeOut = setInterval(fade, 10);

    function fade() {
        if (oldArrow.style.opacity <= 0) clearInterval(fadeOut)
        oldArrow.style.opacity -= .02
    }

    const ground = document.getElementById('groundbg');
    const arrow = document.getElementById(`arrow${i}`);

    const startX = clickX + (Math.random() * 100) - (Math.random() * 100);
    const startY = -100;
    const throughX = clickX - 80;
    const throughY = clickY;

    const groundRect = ground.getBoundingClientRect();
    const arrowWidth = arrow.offsetWidth || 0;
    const endY = bottomY !== undefined ? bottomY : (groundRect.top + window.scrollY - (arrowWidth / 2.2));

    // Calculate the direction vector from start to through point
    const dx = throughX - startX;
    const dy = throughY - startY;

    // Calculate the total distance to the through point
    const distanceToThrough = Math.sqrt(dx * dx + dy * dy);

    // Calculate the direction unit vector
    const dirX = dx / distanceToThrough;
    const dirY = dy / distanceToThrough;

    // Calculate how far to go from start to ground along the same direction
    const totalDy = endY - startY;
    const totalDx = dirX * totalDy / dirY; // maintain the same slope

    const endX = startX + totalDx;

    let speed = Math.random() * (10 - 5) + 5;
    let x = startX;
    let y = startY;

    arrow.style.left = x + 'px';
    arrow.style.top = y + 'px';
    arrow.style.opacity = 1;
    arrow.style.width = '10vw';
    arrow.style.zIndex = 1;

    // Calculate total distance and steps to ground
    const totalDistance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
    const steps = Math.ceil(totalDistance / speed);
    let step = 0;

    let land = setInterval(() => {
        step++;
        x = startX + ((endX - startX) * step / steps);
        y = startY + ((endY - startY) * step / steps);

        arrow.style.left = x + 'px';
        arrow.style.top = y + 'px';

        // Calculate angle to target
        let angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
        arrow.style.transform = `rotate(${angle}deg)`;

        if (step >= steps) {
            clearInterval(land);
            arrow.style.left = endX + 'px';
            arrow.style.top = endY + 'px';
        }
    }, 10);

    i = i >= 20 ? 1 : i + 1;
}

setInterval(() => {
    const name = document.getElementById(`fullName`);

    name.style.opacity = 1 - window.scrollY / (window.innerHeight / 1.75);
}, 10);

rain();