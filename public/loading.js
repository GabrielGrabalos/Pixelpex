function showLoading() {
    document.getElementById("loading-gif").style.display = "block";
}

function hideLoading() {
    const loading = document.getElementById("loading-gif");

    /* fade out */
    loading.style.animation = "fade-out 0.55s ease";

    /* hide */
    setTimeout(() => {
        loading.style.display = "none";
    }, 500);
}

function showLogo() {
    /* fade in */
    document.getElementById("animated-logo").style.animation = "fade-in 1s ease";
    document.getElementById("animated-logo").style.display = "block";
}

function hideIntro() {
    /* fade out */
    document.getElementById("loading").style.animation = "fade-out 1.05s ease";

    /* hide */
    setTimeout(() => {
        document.getElementById("loading").style.display = "none";
    }, 950);
}

function showDisconnected() {
    const disconnected = document.getElementById("disconnected");

    /* fade in */
    disconnected.style.animation = "fade-in 0.55s ease";
    disconnected.style.display = "flex";
}

function hideDisconnected() {
    const disconnected = document.getElementById("disconnected");

    /* fade out */
    disconnected.style.animation = "fade-out 0.55s ease";

    /* hide */
    setTimeout(() => {
        disconnected.style.display = "none";
    }, 500);
}

function reconnect() {
    // refresh the page
    location.reload();
}

let isControlsOpen = false;

function closeControls() {
    const controls = document.getElementById("controls-container");
    controls.style.left = "-61vh";

    const arrow = document.getElementById("arrow");
    arrow.style.transform = "rotate(180deg)";
}

function openControls() {
    const controls = document.getElementById("controls-container");
    controls.style.left = "0";

    const arrow = document.getElementById("arrow");
    arrow.style.transform = "rotate(0deg)";
}

function openCloseControls() {
    if (isControlsOpen) {
        closeControls();
    } else {
        openControls();
    }

    isControlsOpen = !isControlsOpen;
}

let currentSlideIndex = 0;

function showSlides(n) {
    const slides = document.getElementsByClassName("slide");

    if (n > slides.length - 1) {
        currentSlideIndex = 0;
    } else if (n < 0) {
        currentSlideIndex = slides.length - 1;
    } else {
        currentSlideIndex = n;
    }

    const carrousel = document.getElementsByClassName("carrousel")[0];

    carrousel.style.transform = `translateX(-${currentSlideIndex * 48}vh)`;

    const dots = document.getElementsByClassName("dot");

    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    dots[currentSlideIndex].className += " active";
}

function currentSlide(n) {
    showSlides(n);
}

function nextSlide() {
    showSlides(currentSlideIndex + 1);
}

function previousSlide() {
    showSlides(currentSlideIndex - 1);
}