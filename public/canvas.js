const pz = new PanZoom();

const pixelSize = 50;

let pixels = {}

let pixelsToBeAdded = {};
let pixelsToBeDeleted = {};

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { alpha: false });

let canvasWidth = canvas.width = window.innerWidth;
let canvasHeight = canvas.height = window.innerHeight;

// Create an offscreen canvas
const offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = canvasWidth;
offscreenCanvas.height = canvasHeight;
const offscreenCtx = offscreenCanvas.getContext('2d', { alpha: false });

// Disable anti-aliasing
ctx.imageSmoothingEnabled = false;

// Disable anti-aliasing
offscreenCtx.imageSmoothingEnabled = false;

const colorPicker = document.getElementById('color-picker');

configCanvas();

function draw() {
    drawBackground();
    drawGrid();
    drawPixels();

    ctx.drawImage(offscreenCanvas, 0, 0);
}

function drawBackground() {
    offscreenCtx.fillStyle = "#fff6f9";
    offscreenCtx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawLine(x1, y1, x2, y2) {
    offscreenCtx.beginPath();
    offscreenCtx.moveTo(x1, y1);
    offscreenCtx.lineTo(x2, y2);
    offscreenCtx.stroke();
}

function drawGrid() {
    if (pz.Scale >= 1) {
        offscreenCtx.lineWidth = pz.Scale;
    }
    else {
        offscreenCtx.lineWidth = pz.Scale ** 2;
    }

    if (offscreenCtx.lineWidth < 0.05)
        return;

    for (let i = -pz.OffsetX % pixelSize * pz.Scale; i < canvasWidth; i += pixelSize * pz.Scale) {
        drawLine(i, 0, i, canvasHeight);
    }

    for (let i = -pz.OffsetY % pixelSize * pz.Scale; i < canvasHeight; i += pixelSize * pz.Scale) {
        drawLine(0, i, canvasWidth, i);
    }
}

function drawPixels() {
    const xStart = Math.floor(pz.OffsetX / pixelSize);
    const yStart = Math.floor(pz.OffsetY / pixelSize);
    const xEnd = Math.ceil(pz.ScreenToWorldX(canvasWidth) / pixelSize);
    const yEnd = Math.ceil(pz.ScreenToWorldY(canvasHeight) / pixelSize);
    const pixelSizeScaled = pixelSize * pz.Scale;

    const screenX = pz.WorldToScreenX(xStart * pixelSize);
    const screenY = pz.WorldToScreenY(yStart * pixelSize);

    for (let x = xStart; x < xEnd; x++) {
        const pixelsX = pixels[x];
        if (!pixelsX) continue;

        for (let y = yStart; y < yEnd; y++) {
            const pixel = pixelsX[y];
            if (!pixel || (pixelsToBeDeleted[x] && pixelsToBeDeleted[x][y])) continue;

            offscreenCtx.fillStyle = typeof pixel === "string" ? pixel : "#000000";

            offscreenCtx.fillRect(
                screenX + (x - xStart) * pixelSizeScaled,
                screenY + (y - yStart) * pixelSizeScaled,
                pixelSizeScaled,
                pixelSizeScaled
            );
        }
    }

    for (let x in pixelsToBeAdded) {
        const pixelsToBeAddedX = pixelsToBeAdded[x];

        const worldToScreenX = pz.WorldToScreenX(x * pixelSize);

        for (let y in pixelsToBeAddedX) {
            offscreenCtx.fillStyle = pixelsToBeAddedX[y];

            offscreenCtx.fillRect(
                worldToScreenX,
                pz.WorldToScreenY(y * pixelSize),
                pixelSizeScaled,
                pixelSizeScaled
            );
        }
    }
}

function configCanvas() {
    canvas.addEventListener('mousedown', (e) => {
        pz.MouseDown(e.clientX, e.clientY);
        draw();
    });

    canvas.addEventListener('mouseup', (e) => {
        resetIdleTimer();

        pz.MouseUp();

        if (pz.Click)
            return;

        if (Object.keys(pixelsToBeAdded).length > 0) {
            addPixelsToBeAdded();
        }

        if (Object.keys(pixelsToBeDeleted).length > 0) {
            deletePixelsToBeDeleted();
        }

        draw();
    });

    canvas.addEventListener('mouseleave', (e) => {

        if (Object.keys(pixelsToBeDeleted).length > 0) {
            deletePixelsToBeDeleted();
        }

        if (Object.keys(pixelsToBeAdded).length > 0) {
            addPixelsToBeAdded();
        }

        pz.MouseUp();
        draw();
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!pz.Dragging)
            return;

        if (pz.Click)
            pz.Click = false;

        const x = Math.floor(pz.ScreenToWorldX(e.clientX) / pixelSize);
        const y = Math.floor(pz.ScreenToWorldY(e.clientY) / pixelSize);

        const color = colorPicker.value;

        let lock = false;

        if (e.ctrlKey && e.shiftKey) {
            addPixel(x, y, color);
            lock = true;
        }
        else if (e.ctrlKey) {

            deletePixel(x, y);

            lock = true;
        }
        else if (e.shiftKey) {
            if (!(pixels[x] && pixels[x][y]))
                addPixel(x, y, color);
            lock = true;
        }

        if (!lock)
            pz.MouseMove(e.clientX, e.clientY);

        draw();
    });

    canvas.addEventListener('click', mouseClick);

    canvas.addEventListener('wheel', (e) => {

        if (e.ctrlKey) {
            e.preventDefault();
        }

        pz.MouseWheel(e.clientX, e.clientY, e.deltaY);
        draw();
    });

    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();

        const x = Math.floor(pz.ScreenToWorldX(e.clientX) / pixelSize);
        const y = Math.floor(pz.ScreenToWorldY(e.clientY) / pixelSize);

        if (pixels[x] && pixels[x][y])
            if (typeof pixels[x][y] === "string")
                colorPicker.value = pixels[x][y];
            else
                colorPicker.value = "#000000";
    });

    window.onresize = () => {
        canvasWidth = offscreenCanvas.width = canvas.width = window.innerWidth;
        canvasHeight = offscreenCanvas.height = canvas.height = window.innerHeight;

        ctx.imageSmoothingEnabled = false;
        offscreenCtx.imageSmoothingEnabled = false;
        draw();
    };

    window.addEventListener('keydown', (e) => {
        // if ctrl + q is pressed:
        if (e.ctrlKey && e.key === "q") {
            if (saving)
                return;
            sendSaveRequest();

            return;
        }

        // if alt + shift + q is pressed:
        if (e.altKey && e.shiftKey && e.key === "Q") {
            if (saving)
                return;
            sendSaveRequest(true);

            return;
        }
    });
}

function mouseClick(e) {
    if (!pz.Click)
        return;

    const x = Math.floor(pz.ScreenToWorldX(e.clientX) / pixelSize);
    const y = Math.floor(pz.ScreenToWorldY(e.clientY) / pixelSize);

    const color = colorPicker.value;

    if (e.ctrlKey && e.shiftKey) {
        addPixel(x, y, color);
    }
    else if (e.ctrlKey) {
        deletePixel(x, y);
    }
    else {
        addPixel(x, y, color);
    }

    if (Object.keys(pixelsToBeDeleted).length > 0) {
        deletePixelsToBeDeleted();
    }

    if (Object.keys(pixelsToBeAdded).length > 0) {
        addPixelsToBeAdded();
    }

    draw();
}

function addPixel(x, y, color) {
    if (!pixelsToBeAdded[x])
        pixelsToBeAdded[x] = {};

    pixelsToBeAdded[x][y] = color || colorPicker.value;
}

function deletePixel(x, y) {
    if (!pixelsToBeDeleted[x])
        pixelsToBeDeleted[x] = {};

    if (!pixelsToBeDeleted[x][y])
        pixelsToBeDeleted[x][y] = true;
}

function addPixelsToBeAdded() {

    socket.emit("add_pixels", pixelsToBeAdded);

    for (let x in pixelsToBeAdded) {
        const pixelsToBeAddedX = pixelsToBeAdded[x];

        for (let y in pixelsToBeAddedX) {
            pixels[x][y] = pixelsToBeAddedX[y];
        }
    }

    pixelsToBeAdded = {};
}

function deletePixelsToBeDeleted() {

    socket.emit("delete_pixels", pixelsToBeDeleted);

    for (let x in pixelsToBeDeleted) {
        if (!pixels[x])
            continue;

        const pixelsX = pixelsToBeDeleted[x];

        for (let y in pixelsX) {
            delete pixels[x][y];
        }

        if (Object.keys(pixels[x]).length === 0)
            delete pixels[x];
    }

    pixelsToBeDeleted = {};
}

draw();