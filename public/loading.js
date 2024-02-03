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