let idleTimer;
const idleDuration = 7 * 60 * 1000; // 7 minutes in milliseconds

function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
        if(socket)
            socket.disconnect();

            showDisconnected();
    }, idleDuration);
}

resetIdleTimer();