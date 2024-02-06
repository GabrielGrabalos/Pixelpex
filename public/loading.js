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
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");

    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";

    currentSlideIndex = slideIndex;
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function nextSlide() {
    showSlides(currentSlideIndex + 1);
}

function previousSlide() {
    showSlides(currentSlideIndex - 1);
}