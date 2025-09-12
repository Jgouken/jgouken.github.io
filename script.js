var i = 1;

document.addEventListener('click', function (event) {
    launchArrow(event.clientX, event.clientY)
});

setInterval(() => {launchArrow(Math.random() * window.innerWidth, Math.random() * 700)}, Math.random() * 2000)

function launchArrow(clientX, clientY) {
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
    elem.style.opacity = 1;

    var land = setInterval(frame, 10); // Call 'frame' every 10 milliseconds

    function frame() {
        if (y >= window.innerHeight * .75) clearInterval(land)
        elem.style.top = (y + speed) + 'px';
        elem.style.left = (x - speed) + 'px';
        y += speed * 2
        x -= speed
    }
}