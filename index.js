'use strict';

// --- Object declaration
function Game() {
    this.state = null;
    this.colors = generateRandomColors();
    this.sortedColors = sortColors(this.colors);
    this.startingColor = this.sortedColors[this.sortedColors.length - 1]; // The darkest one
    this.level = null;
    this.startingTime = 5;
    this.timeRemaining = this.startingTime;
    this.userSelection = null;
    this.moves = 0;

    function generateRandomColors() {
        var colors = [];
        var color_palette = Math.floor(Math.random() * 359);
        var color;
        for (var i = 0; colors.length < 11; i++) {
            color = {
                'hsl': 'hsl(' + color_palette + ', 100%, ' + Math.floor(Math.random() * (94 - 25 + 5) + 25) + '%)'
            }; // Last parameter: the greater, the clearer
            var found = false;
            for (var j = 0; j < colors.length && !found; j++) {
                if(utilsObjectEquals(colors[j], color)) {
                    found = true;
                }
            }
            if (!found) {
                colors.push(color);
            }
        }

        return colors;
    }
}

var game;

// --- Methods
function sortColors(object) {
    var array = [];
    for (var i in object) {
        array.push(object[i].hsl);
    }

    return array.sort().reverse(); // Clears to darkers
}

// --- Compare user sorting to result
function checkResult() {
    var user_sort = [];
    $('.color-container').children().each(function() {
        user_sort.push($(this).attr('class'));
    });
    user_sort = utilsRgbToHsl(user_sort);
    console.log("User");
    console.log(user_sort);
    console.log("Game");
    console.log(game);

    var winner = true;
    for (var i = 0; i < game.sortedColors.length - 1; i++) {
        if (user_sort[i] !== game.sortedColors[i]) {
            winner = false;
            // $('#colors-left').css('background-image', 'url(../lose.gif)');
        }
    }
    console.log(winner);
    if (winner) {
        $('#colors-left').css('background-image', 'url(../confetti.gif)');
    } else {
        alert("sfs");
    }
}

// --- Utils
function utilsObjectEquals(obj1, obj2) {
    return obj1.hsl == obj2.hsl;
}

function utilsRgbToHslAlgorithm(r, g, b) {
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
}

function utilsRgbToHsl(array) {
    var conversion = [];
    for (var i in array) {
        var r = array[i].split(',')[0].substring(4);
        var g = array[i].split(',')[1];
        var b = array[i].split(',')[2].slice(0, -1);
        var aux = utilsRgbToHslAlgorithm(r, g, b);
        conversion.push("hsl(" + Math.round(aux[0] * 360) + ", " + Math.round(aux[1] * 100) + "%, " + Math.round(aux[2] * 100) + "%)");
    }

    return conversion;
}

// --- Build landing page
function buildLanding() {
    $('.game-container').remove(); // Reset
    var welcome_container = $('<div class="welcome-container"></div>');
    var html = `
        <canvas id="canvas-background"></canvas>
        <div class="main">
            <h1 class="brand">Colorify</h1>
            <div class="level-buttons">
                <button class="level-one">Level 1</button>
                <button class="level-two">Level 2</button>
                <button class="level-three">Level 3</button>
            </div>
        </div>
        <footer>
            <h3>Clara Ameller</h3>
            <p>How it's done</p>
        </footer>
    `;
    welcome_container.html(html);
    $('.container').append(welcome_container);
    // $('.container').append(gradient);

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
        createGamingScreen();
    });
}

// --- Create gaming screen
function createGamingScreen() {
    // --- Instance of object
    game = new Game();
    buildGamingScreen(game);
}

// --- Reset gaming screen
function resetGamingScreen(game) {
    $('.game-container').remove(); // Reset
    buildGamingScreen(game);
}

// --- Build gaming screen
function buildGamingScreen(game) {
    // --- Build screen
    $('.welcome-container').remove(); // Reset
    var game_container = $('<div class="game-container"></div>');
    $(game_container).html(`
        <header  class="font-red"><h3 class="font-red">Colorify</h3><h3>Clara Ameller</h3></header>
        <canvas id="canvas-game"></canvas>
        <div id="colors-left"></div>
        <div id="colors-board"></div>
        <footer>
            <div><button class="btn-back">Back</button></div>
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
    // game.state = level;

    for (var i = 0; i < game.colors.length; i++) {
        var colors_left_container = $('<div class="colors-left-container"></div>');
        var color_container = $('<div class="color-container"></div>');

        if (game.colors[i].hsl != game.startingColor) {
            $(colors_left_container).css('background', game.colors[i].hsl);
            colors_left.append(colors_left_container);
            board.append(color_container);
        }

        $(colors_left_container).draggable({
            cursor: 'move',
            snap: '#colors-board .color-container',
            // containment: '#colors-board',
            // drag: hangleDragStart,
            // stop: handleDragStop
        });

        $(color_container).droppable({
            drop: handleDropEvent,
        });
    }

    board.append($('<div class="color-container"></div>').css('background', game.startingColor));
    $('.game-container').show(); // Reset

    // --- Count down
    var clock = $('.count-down').FlipClock(game.startingTime, {
        countdown: true,
        clockFace: 'MinuteCounter',
    });

    var timer = setInterval(countDown, 1000);

    function countDown() {
        var time = clock.getTime().time;
        game.timeRemaining--;
        if (game.timeRemaining < 0) {
            clearInterval(timer);
            checkResult();
            return;
        }
    }

    // --- Event listeners
    $('.btn-back').on('click', function() {
        buildLanding();
    });

    $('.btn-next').on('click', function() {
        $('.game-container').remove(); // Reset
        createGamingScreen();
    });

    $('.btn-reset').on('click', function() {
        resetGamingScreen(game);
        clock.stop();
        clock.reset();
        clock.start();
    });
}

// --- Drag & drop
function handleDropEvent(event, ui) {
    var draggable = ui.draggable;
    var bg_color = draggable.css('backgroundColor');
    var aux = $('<div class="' + bg_color + '"></div>').css({
        'background': 'bg_color',
        'display': 'none'
    });
    aux.appendTo($(this));

    console.log(game.timeRemaining);
    if ($('.color-container').has('div').length === 10) { // All colors completed
        console.log("completed");
        checkResult();
    }


    // $(this).css('border', '5px solid yellow');
}

$(document).ready(function() {
    buildLanding();
});
