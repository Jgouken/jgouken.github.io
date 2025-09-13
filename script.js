var i = 1;

document.addEventListener('click', function (event) {
    const ground = document.getElementById('groundLine');
    const groundRect = ground.getBoundingClientRect();

    const arr = document.getElementById(`arrow${i}`);
    const arrowRect = arr.getBoundingClientRect();

    const yDocument = groundRect.top + window.scrollY - (arrowRect.height / 1.65);

    launchArrow(event.clientX, event.clientY, yDocument)
});

function rain() {
    setInterval(() => { launchArrow(Math.random() * window.innerWidth, Math.random() * 700, window.innerHeight) }, 500)
}

function launchArrow(clientX, clientY, bottomY) {
    if (i > 10) i = 1

    if (i > 5) var oldArrow = document.getElementById(`arrow${i - 5}`)
    else var oldArrow = document.getElementById(`arrow${i + 5}`)
    if (!oldArrow) return;
    var fadeOut = setInterval(fade, 10);

    function fade() {
        if (oldArrow.style.opacity <= 0) clearInterval(fadeOut)
        oldArrow.style.opacity -= .02
    }

    const elem = document.getElementById(`arrow${i++}`)

    var speed = Math.random() * (10 - 5) + 5;
    var x = clientX + (clientY / 2.75);
    var y = 0;

    elem.style.left = x + 'px';
    elem.style.top = y + 'px';
    elem.style.opacity = bottomY == window.innerHeight ? .25 : 1;
    elem.style.width = bottomY == window.innerHeight ? '5vw' : '10vw'
    elem.style.zIndex = bottomY == window.innerHeight ? 0 : 1

    var land = setInterval(frame, 10);

    function frame() {
        elem.style.top = (y + speed) + 'px';
        elem.style.left = (x - speed) + 'px';
        if (y >= bottomY) clearInterval(land)
        y += speed * 2
        x -= speed
    }
}

rain()