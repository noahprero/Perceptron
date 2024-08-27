function map(value, inputBegin, inputEnd, outputBegin, outputEnd) {
    const r = (value - inputBegin) / (inputEnd - inputBegin);
    return outputBegin + r * (outputEnd - outputBegin);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}