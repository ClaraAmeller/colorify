'use strict';

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

function result() {
    var color_containers = $('.color-container');
    console.log($(color_containers).is(':empty'));
}

function canvasBackground() {
    var granim = new Granim({
        element: '#canvas-background',
        name: 'background-animation',
        direction: 'left-right',
        opacity: [1, 1],
        isPausedWhenNotInView: true,
        states: {
            "default-state": {
                gradients: [
                    ['#e74c3c', '#ffffff'],
                    ['#ffffff', '#e74c3c']
                ]
            }
        }
    });
}

// --- Drag and drop
//
// function handleDragStop(event, ui) {
//     var offsetX = parseInt(ui.offset.left);
//     var offsetY = parseInt(ui.offset.top);
//     console.log(offsetX + " " + offsetY);
// }

// function hangleDragStart(event, ui) {
//     var offsetX = parseInt(ui.offset.left);
//     var offsetY = parseInt(ui.offset.top);
//     var element = document.elementFromPoint(offsetX, offsetY);
//     $(element).css('border', '2px solid pink');
// }

function handleDropEvent(event, ui) {
    // var draggable = ui.draggable;
    $(this).css('border', '5px solid yellow');
}

function main() {
    var colors_left = $('#colors-left');
    var board = $('#colors-board');

    var colors = generateRandomColors();
    for (var j in colors) {
        var colors_left_container = $('<div class="colors-left-container"></div>');
        var color_container = $('<div class="color-container"></div>');
        var color = $('<div class="color"></div>');
        $(colors_left_container).css('background-color', colors[j].hsl);

        colors_left.append(colors_left_container);
        colors_left_container.append(color);
        board.append(color_container);

        $(colors_left_container).draggable({
            cursor: 'move',
            // containment: '#colors-board',
            // drag: hangleDragStart,
            // stop: handleDragStop
        });

        $(color_container).droppable({
            drop: handleDropEvent,
            over: handleDropEvent
        });
    }

    var sortedColors = sortColors(colors);
    console.log(sortedColors);
    $('.color-container').last().css('background-color', sortedColors[sortedColors.length -1]);
    // $('.color-container').first().css('background-color', sortedColors[0]);

}


$(document).ready(function () {
    if ($('#canvas-background').length) {
        canvasBackground();
    }
    main();
});
