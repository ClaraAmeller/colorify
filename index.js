'use strict';

// --- Object declaration
function Game(level) {
    // this.state = null;
    this.level = level;
    this.colors = this.generateRandomColors();
    this.sortedColors = this.sortColors();
    this.startingColor = this.sortedColors[this.sortedColors.length - 1]; // The darkest one
    this.intervalId;
    this.startingTime = 30;
    this.timeRemaining = this.startingTime;
    this.clock;
    this.win = null;
    this.plays = 10;
}

var game;

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
        console.log("3");
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
    console.log(array.sort().reverse());
    return array.sort().reverse(); // Clears to darkers
};

Game.prototype.winner = function() {
    // if (!(this instanceof Game)) {
    //     throw new Error("HERERERE!");
    // }
    clearInterval(game.intervalId);
    game.clock.stop();
    game.win = true;
    $('#colors-left').css('background-image', 'url(../confetti.gif)');
};

Game.prototype.loser = function() {
    $('#colors-left').children().remove(); // Remove the colors left to sort (if countdown runs out)
    clearInterval(game.intervalId);
    game.clock.stop();
    game.win = false;
    $('#colors-left').css('background-image', 'url(../loser.gif)');
};

// Game.prototype.getParam = function(color, level) {
//     var lightness = color.split(',');
//     return lightness[level -1].slice(0, -1);
// }; // No more needed

// --- Compare user sorting to result
Game.prototype.checkResult = function() {
    var user_sort = [];
    var winner = true;

    $('.color-container').children().each(function() {
        user_sort.push($(this).css('backgroundColor'));
    });

    user_sort = game.utilsRgbToHsl(user_sort); // Convert it back to HSL
    var aux = user_sort.slice().sort().reverse(); // Copy the user_sort and sort it

    console.log("User");
    console.log(user_sort);
    console.log("Aux");
    console.log(aux);

    for (var i = 0; i < aux.length - 1; i++) {
        if (user_sort[i] != aux[i]) { // If a single combination is not correctly sorted, then user loses
            winner = false;
        }
    }

    if (winner) {
        game.winner();
    } else {
        game.loser();
    }
};

// --- Utils
Game.prototype.utilsObjectEquals = function(obj1, obj2) {
    return obj1.hsl == obj2.hsl;
};

Game.prototype.utilsRgbToHslAlgorithm = function(r, g, b) {
    r /= 255, g /= 255, b /= 255;
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
        var aux = game.utilsRgbToHslAlgorithm(r, g, b);
        conversion.push("hsl(" + Math.round(aux[0] * 360) + ", " + Math.round(aux[1] * 100) + "%, " + Math.round(aux[2] * 100) + "%)");
    }

    return conversion;
};

// --- Build landing page
function buildLanding() {
    $('.game-container').remove(); // Reset
    var welcome_container = $('<div class="welcome-container"></div>');
    var html = `
        <canvas id="canvas-background"></canvas>
        <div class="main">
            <h1 class="brand">Colorify</h1>
            <div class="level-buttons">
                <button class="level-one" name="1">Level 1</button>
                <button class="level-two" name="2">Level 2</button>
                <button class="level-three" name="3">Level 3</button>
            </div>
        </div>
        <footer>
            <h3>Clara Ameller</h3>
            <p>How it's done</p>
        </footer>
    `;
    welcome_container.html(html);
    $('.container').append(welcome_container);

    // --- Canvas gradient background
    var granimInstance = new Granim({
        element: '#canvas-background',
        name: 'background-animation',
        direction: 'left-right',
        opacity: [1, 1],
        stateTransitionSpeed: 5000,
        isPausedWhenNotInView: true,
        states: {
            "default-state": {
                gradients: [
                    ['#ff9966', '#ff5e62'],
                    ['#ff5e62', '#ff9966']
                ]
            },
        },
    });

    // --- Click on level button
    $('.level-buttons button').on('click', function() {
        var level = $(this).attr('name');
        instanceGame(level);
    });
}

// --- Create gaming screen
function instanceGame(level) {
    // --- Instance of object
    if (level === undefined) { // Function called from 'Next' button
        level = game.level; // The level will be the same as previous game
    }
    game = new Game(level); // Function called from Landing page or 'Restart' button
    game.buildGamingScreen(game);
}

// --- Reset gaming screen
Game.prototype.resetGamingScreen = function(game) {
    $('.game-container').remove(); // Reset
    clearInterval(game.intervalId);
    game.buildGamingScreen(game);
};

Game.prototype.detectSolved = function() {
    if ($('.color-container').has('div').length === game.plays) { // All colors completed
        console.log("check");
        this.checkResult();
    }
};

// --- Build gaming screen
Game.prototype.buildGamingScreen = function(game) {
    $('.welcome-container').remove(); // Reset
    var game_container = $('<div class="game-container"></div>');
    $(game_container).html(`
        <header  class="font-red"><h3 class="font-red">Colorify</h3><h3>Clara Ameller</h3></header>
        <canvas id="canvas-game"></canvas>
        <div id="colors-left"></div>
        <div id="colors-board"></div>
        <footer>
            <div><button class="btn-back">Home</button></div>
            <div class="count-down"></div>
            <div>
                <button class="btn-reset">Reset</button>
                <button class="btn-next">Next</button>
            </div>
        </footer>
    `);
    $('.container').append(game_container);

    var colors_left = $('#colors-left');
    var board = $('#colors-board');

    for (var i = 0; i < this.colors.length; i++) {
        var colors_left_container = $('<div class="colors-left-container"></div>'); // Colors to sort
        var color_container = $('<div class="color-container"></div>'); // Individual container where they'll be dropped

        if (this.colors[i].hsl != this.startingColor) { // The starting color won't be on "colors to sort"
            $(colors_left_container).css('background', this.colors[i].hsl);
            colors_left.append(colors_left_container);
            board.append(color_container);
        }
    }

    $('.color-container, #colors-left').sortable({
        connectWith: '.color-container',
        receive: game.handleDrop,
        tolerance: "pointer"
    });

    $('#colors-board').sortable({
        tolerance: "pointer",
        receive: game.handleReorder,
        tolerance: "pointer"
    });

    board.append($('<div class="color-container"></div>').css('background', this.startingColor)); // Positioning the starting color

    $('.game-container').show();

    // --- Count down
    if (this.level === "2") {
        this.startingTime = 45;
    } else if (this.level === "3") {
        this.startingTime = 60;
    }

    this.timeRemaining = this.startingTime;

    this.clock = $('.count-down').FlipClock(this.startingTime, {
        countdown: true,
        clockFace: 'MinuteCounter',
    });

    function countDown() {
        game.timeRemaining--;
        if (game.timeRemaining < 0) {
            clearInterval(game.intervalId);
            if (!game.win) {
                game.loser();
            }
            return;
        }
    }

    game.intervalId = setInterval(countDown, 1000);

    // --- Event listeners
    $('.btn-back').on('click', function() {
        buildLanding();
    });

    $('.btn-next').on('click', function() {
        $('.game-container').remove(); // Reset
        clearInterval(game.intervalId); // Reset countdown
        instanceGame();
    });

    $('.btn-reset').on('click', function() {
        game.resetGamingScreen(game);
        game.clock.stop(); // Restart countdown
        game.clock.start();
    });
};

// --- Drag & drop
Game.prototype.handleDrop = function(event, ui) {
    // console.log($(this), $(ui.item));
    if ($(this).children().length > 1) {
        ui.sender.sortable("cancel");
    }
    game.detectSolved();

    // if ($('.color-container').has('div').length === game.plays) { // All colors completed
    //     console.log("check");
    //     game.checkResult();
    // }
};

$(document).ready(function() {
    buildLanding();
});
