'use strict';

// --- Object declaration
function Game() {
    this.state = "Landing";
    this.colors = generateRandomColors();
    this.sortedColors = sortColors(this.colors);
    this.startingColor = this.sortedColors[this.sortedColors.length -1]; // The darkest one
    this.level = null;
    this.timeRemaining = null;
    this.userSelection = null;
    // this.result = checkResult();
    this.moves = 0;

    function generateRandomColors() {
        var colors = [];
        var color_palette = Math.floor(Math.random() * 359);
        var color;
        for (var i = 0; i < 11; i++) {
            color = {'hsl': 'hsl(' + color_palette + ', 100%, '+  Math.floor(Math.random() * (95 - 25 + 1) + 25) + '%)'}; // Last parameter: the greater, the clearer
            if (!colors.includes(color)) {
                colors.push(color);
            }
        }

        return colors;
    }

    function sortColors(object) {
        var array = [];
        for (var i in object) {
            array.push(object[i].hsl);
        }

        return array.sort().reverse(); // Clears to darkers
    }
}


function checkResult() {
    var user_sort = [];
    $('.color-container').children().each(function() {
        user_sort.push($(this).attr('class'));
    });
    return user_sort;
}

// --- Instance of object
var game = new Game();

// --- Build landing page
function buildLanding() {
    var welcome_container = $('<div class="welcome-container"></div>');
    var html = `
        <div class="brand">
            <h1>Colorify</h1>
        </div>
        <div class="level-buttons">
            <button class="level-one">Level 1</button>
            <button class="level-two">Level 2</button>
            <button class="level-three">Level 3</button>
        </div>
    `;
    $('.container').append(welcome_container);
    welcome_container.html(html);

    // --- Click on level button
    $('.level-buttons button').on('click', function() {
        buildGamingScreen("Level 1");
    });
}

// --- Build gaming screen
function buildGamingScreen(level) {
    $('.welcome-container').remove(); // Reset
    var game_container = $('<div class="game-container"></div>');
    $(game_container).html('<div id="colors-left"></div><div id="colors-board"></div>');
    $('.container').append(game_container);

    var colors_left = $('#colors-left');
    var board = $('#colors-board');
    game.state = level;

    for (var i = 0; i < game.colors.length; i++) {
        var colors_left_container = $('<div class="colors-left-container"></div>');
        var color_container = $('<div class="color-container"></div>');

        if (game.colors[i].hsl != game.startingColor) {
            $(colors_left_container).css('background-color', game.colors[i].hsl);
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

    board.append($('<div class="color-container"></div>').css('background-color', game.startingColor));
    $('.game-container').show(); // Reset

}

// --- Drag & drop
function handleDropEvent(event, ui) {
    var draggable = ui.draggable;
    var bg_color = draggable.css('backgroundColor');
    var aux = $('<div class="' + bg_color + '"></div>').css({'background-color': 'bg_color', 'display': 'none'});
    aux.appendTo($(this));

    if ($('.color-container').has('div').length === 10) {
        // if (game.result) {
        //     console.log("Winner");
        // } else {
        //     console.log("Loser");
        // }

        console.log(checkResult());
    }

    // $(this).css('border', '5px solid yellow');
}

$(document).ready(function () {
    buildLanding();
});
