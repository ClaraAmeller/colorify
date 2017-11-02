'use strict';

// --- Object declaration
function Game(level) {
    this.level = level;
    this.colors;
    this.sortedColors;
    this.startingColor;
    this.intervalId;
    this.startingTime = 30;
    this.timeRemaining = this.startingTime;
    this.clock;
    this.win = null;
    this.plays;
}

// --- Methods
Game.prototype.generateRandomColors = function() {
    var colors = [], color, found;
    var color_palette = Math.floor(Math.random() * 359);

    if (this.level === "1") { // Changing only the lightness of the same hue and with 100% saturation
        for (var i = 0; colors.length < 11; i++) {
            color = {
                'hsl': 'hsl(' + color_palette + ', 100%, ' + Math.floor(Math.random() * (90 - 25 + 2) + 25) + '%)'
            };
            found = false;
            for (var j = 0; j < colors.length && !found; j++) {
                if(this.utilsObjectEquals(colors[j], color)) {
                    found = true;
                }
            }
            if (!found) {
                colors.push(color);
            }
        }
    } else if (this.level === "2") { // Changing only the lightness of the same hue and with 50% saturation
        for (var k = 0; colors.length < 11; k++) {
            color = {
                'hsl': 'hsl(' + color_palette + ', ' +  Math.floor(Math.random() * (90 - 10 + 6) + 10) + '%, ' + '50%)'
            };
            found = false;
            for (var l = 0; l < colors.length && !found; l++) {
                if(this.utilsObjectEquals(colors[l], color)) {
                    found = true;
                }
            }
            if (!found) {
                colors.push(color);
            }
        }
    } else {
        for (var n = 0; colors.length < 11; n++) {
            color = {
                'hsl': 'hsl(' + Math.floor(Math.random() * (360 - 100) + 100) + ', 100%, 50%)'
            };
            found = false;
            for (var a = 0; a < colors.length && !found; a++) {
                if(this.utilsObjectEquals(colors[a], color)) {
                    found = true;
                }
            }
            if (!found) {
                colors.push(color);
            }
        }
    }

    return colors;
};

Game.prototype.sortColors = function() {
    var array = [];
    for (var i in this.colors) {
        array.push(this.colors[i].hsl);
    }
    return array.sort().reverse(); // Clears to darkers
};

Game.prototype.winner = function() {
    clearInterval(this.intervalId);
    this.clock.stop();
    this.win = true;
    $('#colors-left').css('background-image', 'url(./img/winner.gif)');
};

Game.prototype.loser = function() {
    $('#colors-left').children().remove(); // Remove the colors left to sort (if countdown runs out)
    clearInterval(this.intervalId);
    this.clock.stop();
    this.win = false;
    $('#colors-left').css('background-image', 'url(./img/loser.gif)');
};

Game.prototype.cutToParam = function(array) {
    var short = [];
    for (var i in array) {
        var index = array[i].split(',');
        index.shift();
        short.push(index);
    }

    return short;
};

// --- Compare user sorting to result
Game.prototype.checkResult = function() {
    var self = this;

    var user_sort = [], user_sort_short = [];
    var winner = true;
    var aux, aux_short = [];

    $('.color-container').children().each(function() {
        user_sort.push($(this).css('backgroundColor'));
    });

    user_sort = this.utilsRgbToHsl(user_sort); // Convert it back to HSL
    if (this.level !== "3") {
        aux = user_sort.slice();
        aux = this.cutToParam(aux);
        user_sort = this.cutToParam(user_sort);
    } else {
        aux = user_sort.slice().sort().reverse(); // Copy the user_sort and sort it
    }

    console.log("User");
    console.log(user_sort);
    console.log("Aux");
    console.log(aux);

    for (var i = 0; i < aux.length; i++) {
        console.log(typeof(user_sort[i].toString()) + " " + typeof(aux[i].toString()));
        if (user_sort[i].toString() != aux[i].toString()) { // If a single combination is not correctly sorted, then user loses
            winner = false;
            console.log("false");
        }
    }

    if (winner) {
        this.winner();
    } else {
        this.loser();
    }
};

// --- Utils
Game.prototype.utilsObjectEquals = function(obj1, obj2) {
    return obj1.hsl == obj2.hsl;
};

Game.prototype.utilsRgbToHslAlgorithm = function(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return [h, s, l];
};

Game.prototype.utilsRgbToHsl = function(array) {
    var conversion = [];
    for (var i in array) {
        var r = array[i].split(',')[0].substring(4);
        var g = array[i].split(',')[1];
        var b = array[i].split(',')[2].slice(0, -1);
        var aux = this.utilsRgbToHslAlgorithm(r, g, b);
        conversion.push("hsl(" + Math.round(aux[0] * 360) + ", " + Math.round(aux[1] * 100) + "%, " + Math.round(aux[2] * 100) + "%)");
    }

    return conversion;
};

// --- Get only the param that's changing
// Game.prototype.utilsGetParam = function(color, level) {
//     var lightness = color.split(',');
//     return lightness[level -1].slice(0, -1);
// };

// --- Detect if the user has finished the
Game.prototype.detectFinished = function() {
    if ($('.color-container').has('div').length === this.plays) { // All colors completed
        this.checkResult();
    }
};

// --- Drag & drop
Game.prototype.handleDrop = function(event, ui) {
    if ($(this).children().length > 1) { // Can't add more than one color in the same .color-container
        ui.sender.sortable("cancel");
    }

    if ($('.color-container').has('div').length === this.plays) { // All colors completed
        this.checkResult();
    }
};
