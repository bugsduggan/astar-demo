var width;
var height;
var canvas;
var cursor;

var BLOCK_SIZE = 20;

var drawCells = function(c) {
    for (var x = 0; x < (width / BLOCK_SIZE); x++) {
        for (var y = 0; y < (height / BLOCK_SIZE); y++) {
            c.rect((x * BLOCK_SIZE), (y * BLOCK_SIZE),
                   BLOCK_SIZE, BLOCK_SIZE);
        }
    }
    c.stroke();
};

var fillCell = function(c, x, y, color) {
    var xo = (x * BLOCK_SIZE) + 1;
    var yo = (y * BLOCK_SIZE) + 1;
    c.fillStyle = color;
    c.fillRect(xo, yo, (BLOCK_SIZE - 2), (BLOCK_SIZE - 2));
}

$(function() {
    canvas = $("#maze")[0];
    cursor = canvas.getContext("2d");
    width = canvas.width;
    height = canvas.height;

    drawCells(cursor);
});
