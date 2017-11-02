'use strict';

function Screen() {
    this.game = new Game();
}

// --- Build landing page
Screen.prototype.buildLanding = function() {
    var self = this;

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
            <a class="instructions" href="#"><h3>How it works</h3></a>
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
        self.createGame(level);
    });

    // --- Click on `How it works` link
    $('.instructions').click(function(e) {
        e.stopPropagation();
        self.buildInstructionsModal();
        $('#modal-instructions').show();

        $(document).click(function() {
            $('#modal-instructions').hide();
        });
    });
};

Screen.prototype.buildInstructionsModal = function() {
    var modal = `
        <div id="modal-instructions" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="flex">
                        <h3>How it works</h3>
                        <h3>It's a game about sorting colors</h3>
                    </div>
                    <p>Drag and drop the randomized colors to sort them</p>
                </div>
                <div class="modal-body">
                    <h3><i class="fa fa-paint-brush" aria-hidden="true"></i> Level 1</h3>
                    <p>Same color palette. It's all about sorting the colors by\
                    lightness, so darkers to lighters.<br /><br />You have 30 seconds!</p>
                    <h3><i class="fa fa-paint-brush" aria-hidden="true"></i> Level 2</h3>
                    <p>Same color palette. It's all about sorting the colors by\
                    saturation, so muted to brighter.<br /><br />You have 45 seconds!</p>
                    <h3><i class="fa fa-paint-brush" aria-hidden="true"></i> Level 3</h3>
                    <p>Different color palette. It's all about sorting the colors by\
                    hue, so 'rainbowy'.<br /><br />You have an entire minute!</p>
                </div>
            </div>
        </div>
    `;

    $('.main').append(modal);
};

// --- Create game set up
Screen.prototype.createGame = function(level) {
        if (level === undefined) { // Function called from 'Next' button
            level = this.game.level; // The level will be the same as previous game
        }
        this.game.level = level;
        this.game.colors = this.game.generateRandomColors();
        this.game.sortedColors = this.game.sortColors();
        this.game.startingColor = this.game.sortedColors[this.game.sortedColors.length - 1]; // The darkest one
        this.game.plays = 10;
        this.game.startingTime = 30;
        this.buildGamingScreen();
};

// --- Build gaming screen
Screen.prototype.buildGamingScreen = function() {
    var self = this;

    $('.welcome-container').remove(); // Reset
    var game_container = $('<div class="game-container"></div>');
    $(game_container).html(`
        <header class="font-red"><h3 class="font-red">Colorify</h3><h3>Clara Ameller</h3></header>
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

    for (var i = 0; i < this.game.colors.length; i++) {
        var colors_left_container = $('<div class="colors-left-container"></div>'); // Colors to sort
        var color_container = $('<div class="color-container"></div>'); // Individual container where they'll be dropped

        if (this.game.colors[i].hsl != this.game.startingColor) { // The starting color won't be on "colors to sort"
            $(colors_left_container).css('background', this.game.colors[i].hsl);
            colors_left.append(colors_left_container);
            board.append(color_container);
        }
    }

    $('.color-container, #colors-left').sortable({
        connectWith: '.color-container',
        receive: function(){ self.game.handleDrop(); },
        tolerance: "pointer"
    });

    $('#colors-board').sortable({
        tolerance: "pointer",
    });

    board.append($('<div class="color-container"></div>').css('background', this.game.startingColor)); // Positioning the starting color

    $('.game-container').show();

    // --- Count down
    if (this.game.level === "2") {
        this.game.startingTime = 45;
    } else if (this.game.level === "3") {
        this.game.startingTime = 60;
    }

    this.game.timeRemaining = this.game.startingTime;

    this.game.clock = $('.count-down').FlipClock(this.game.startingTime, {
        countdown: true,
        clockFace: 'MinuteCounter',
    });

    function countDown() {
        self.game.timeRemaining--;
        if (self.game.timeRemaining < 0) {
            clearInterval(self.game.intervalId);
            if (!self.game.win) {
                self.game.loser();
            }
            return;
        }
    }

    this.game.intervalId = setInterval(countDown, 1000);

    // --- Event listeners
    $('.btn-back').on('click', function() {
        self.buildLanding();
    });

    $('.btn-next').on('click', function() {
        $('.game-container').remove(); // Reset
        clearInterval(self.game.intervalId); // Reset countdown
        self.createGame();
    });

    $('.btn-reset').on('click', function() {
        self.resetGamingScreen();
        self.game.clock.stop(); // Restart countdown
        self.game.clock.start();
    });
};

// --- Reset gaming screen
Screen.prototype.resetGamingScreen = function() {
    $('.game-container').remove(); // Reset
    clearInterval(this.game.intervalId);
    this.buildGamingScreen();
};
