
// var level1 = [
//     [   {'hex': '#f8f9fa', 'pos': 1},
//         {'hex': '#dfe0e1', 'pos': 2},
//         {'hex': '#c6c7c8', 'pos': 3},
//         {'hex': '#adaeaf', 'pos': 4},
//         {'hex': '#949596', 'pos': 5},
//         {'hex': '#7c7c7d', 'pos': 6},
//         {'hex': '#636364', 'pos': 7},
//         {'hex': '#4a4a4b', 'pos': 8},
//         {'hex': '#313132', 'pos': 9},
//         {'hex': '#181819', 'pos': 10},
//         {'hex': '#000000', 'pos': 11}
//     ],
//
//     [   {'hex': '#f8f9fa', 'pos': 1},
//         {'hex': '#dfe0e1', 'pos': 2},
//         {'hex': '#c6c7c8', 'pos': 3},
//         {'hex': '#adaeaf', 'pos': 4},
//         {'hex': '#949596', 'pos': 5},
//         {'hex': '#7c7c7d', 'pos': 6},
//         {'hex': '#636364', 'pos': 7},
//         {'hex': '#4a4a4b', 'pos': 8},
//         {'hex': '#313132', 'pos': 9},
//         {'hex': '#181819', 'pos': 10},
//         {'hex': '#000000', 'pos': 11}
//     ]
//
// ];
//
// var colors = [
//     {'hex': '#f8f9fa', 'pos': 1},
//     {'hex': '#dfe0e1', 'pos': 2},
//     {'hex': '#c6c7c8', 'pos': 3},
//     {'hex': '#adaeaf', 'pos': 4},
//     {'hex': '#949596', 'pos': 5},
//     {'hex': '#7c7c7d', 'pos': 6},
//     {'hex': '#636364', 'pos': 7},
//     {'hex': '#4a4a4b', 'pos': 8},
//     {'hex': '#313132', 'pos': 9},
//     {'hex': '#181819', 'pos': 10},
//     {'hex': '#000000', 'pos': 11},
// ];

// var pastel = [
//     "#ffcccc", "#ffe0cc", "#ffeacc", "#fff4cc", "#fffecc",
//     "#effac8", "#c7f5c4", "#c4f0f4", "#c4daf4", "#c9c4f4",
//     "#e1c4f4", "#f6c6e6"];
//
// var rainbow = [
//     "#fbb735", "#e98931", "#eb403b", "#b32E37", "#6c2a6a",
//     "#5c4399", "#274389", "#1f5ea8", "#227FB0", "#2ab0c5",
//     "#39c0b3"
// ];
//
// var diff = [
//         https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Colors/Color_picker_tool
//
// ];

// function shuffleColors(array) {
//     var n = array.length, t, i;
//
//     while (n) {
//         i = Math.floor(Math.random() * n--);
//         t = array[n];
//         array[n] = array[i];
//         array[i] = t;
//     }
//
//     return array;
// }
// for (var i in shuffleColors(colors)) {
//     var color_container = $('<div class="color-container"></div>');
//     var color = $('<div class="color" position="' + colors[i].pos + '"></div>');
//     $(color).css('background-color', colors[i].hex).draggable();
//     $(color_container).droppable({
//         drop: handleDropEvent,
//         over:handleDropEvent
//     });
//     board.append(color_container);
//     color_container.append(color);
// }

// function canvasBackground() {
//     var granim = new Granim({
//         element: '#canvas-background',
//         name: 'background-animation',
//         direction: 'left-right',
//         opacity: [1, 1],
//         isPausedWhenNotInView: true,
//         states: {
//             "default-state": {
//                 gradients: [
//                     ['#e74c3c', '#ffffff'],
//                     ['#ffffff', '#e74c3c']
//                 ]
//             }
//         }
//     });
// }

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



        // $('.color-container').sortable({containment: 'document', tolerance: 'pointer', cursor: 'pointer',
        //     revert: 'true', opacity: 0.6, connectWith: '#colors-left',
        //     items: '.colors-left-container'
        // });

        // $('.colors-continer').sortable();
        // $('.colors-continer').disableSelection();
        // $('#colors-left').sortable();
        // $('#colors-left').disableSelection();

        //
        // for (var i in user_sort) {
        //     console.log(user_sort[i]);
        //     var r = user_sort[i].split(',')[0].substring(4);
        //     var g = user_sort[i].split(',')[1];
        //     var b = user_sort[i].split(',')[2].slice(0, -1);
        //     console.log("R: " + r + "G: " + g + "B: " + b);
        //     console.log(rgbToHsl(r, g, b));
        // }


        // var element = object[i].hsl;
        // var values = element.split(',');
        // values[0] = parseInt(values[0].substring(4, values[0].length));
        // values[1] = parseInt(values[1].slice(0, -1));
        // values[2] = parseInt(values[2].slice(0, -2));
        // // console.log(values);
        // console.log(hslToRgb(values[0], values[1], values[2]));

        // function utilsRemoveDuplicates(array) {
        //     array.filter(function(item, index, self) {
        //         return self.indexOf(item) == index;
        //     });
        //
        //     return array;
        // }
