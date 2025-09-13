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
        const arrow = document.getElementById(`arrow${i === 1 ? 10 : i - 1}`);
        if (arrow) {
            arrow.style.width = '5vw';
            arrow.style.opacity = 0.25;
            arrow.style.zIndex = 0;
        }
    }, 500);
}

function launchArrowWithTrajectory(clickX, clickY, bottomY) {
    if (i > 5) var oldArrow = document.getElementById(`arrow${i - 5}`)
    else var oldArrow = document.getElementById(`arrow${i + 5}`)
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

    i = i >= 10 ? 1 : i + 1;
}

setInterval(() => {
    const name = document.getElementById(`fullName`);

    name.style.opacity = 1 - window.scrollY / (window.innerHeight / 1.75);
}, 10);

rain()