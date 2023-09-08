// Chooses a random int between min and max, inclusively.
exports.randomInt = function(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
};

exports.timeSinceEpoch = function() {
    return Math.round(Date.now() / 1000);
};