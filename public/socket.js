let socket = null;

let pixelsLoaded = false;

function connectSocket() {
    socket = io("https://pixelpex-api.glitch.me");

    socket.on("connect", () => {
        console.log("Connected to server");
        hideLoading();

        setTimeout(() => {
            showLogo();
        }, 500);

        getPixels();
    });

    socket.on("add_pixels", (pixelsToAdd) => {
        for (let x in pixelsToAdd) {
            if (!pixels[x])
                pixels[x] = {};

            for (let y in pixelsToAdd[x]) {
                pixels[x][y] = pixelsToAdd[x][y];
            }
        }

        draw();
    });

    socket.on("delete_pixels", (pixelsToDelete) => {
        for (let x in pixelsToDelete) {
            if (!pixels[x])
                continue;

            for (let y in pixelsToDelete[x]) {
                delete pixels[x][y];

                if (Object.keys(pixels[x]).length === 0)
                    delete pixels[x];
            }
        }

        draw();
    });

    socket.on("disconnect", () => {
        console.log("Disconnected from server");
    });
}

function getPixels() {
    socket.emit("get_pixels");

    socket.on("get_pixels", (pixelsToAdd) => {
        pixels = pixelsToAdd;
        draw();

        // Waits at least 4 seconds before hiding the intro
        // If the pixels are still being loaded, it will keep
        // checking every 300ms until the pixels are loaded.
        setTimeout(() => {
            if (pixelsLoaded) {
                hideIntro();
                return;
            }

            setInterval(() => {
                if (pixelsLoaded) {
                    hideIntro();
                    return;
                }
            }, 300);
        }, 4000);

        pixelsLoaded = true;
    });
}

window.onload = () => {
    connectSocket();
};