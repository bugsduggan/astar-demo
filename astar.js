var maze;

function Maze() {
    var self = this;

    self.width = 600;
    self.height = 400;
    self.block_size = 20;
    self.canvas = document.createElement("canvas");

    self.canvas.width = self.width;
    self.canvas.height = self.height;
    self.canvas.setAttribute("style", "border: 1px solid #000000");

    self.cursor = self.canvas.getContext("2d");

    $("body").append(self.canvas);

    self.reset = function() {
        // clear grid
        self.cursor.fillStyle = "#ffffff";
        self.cursor.fillRect(0, 0, self.width, self.height);

        // clear cells
        self.cells = Array();
        for (var y = 0; y < (self.height / self.block_size); y++) {
            self.cells.push(Array());
            for (var x = 0; x < (self.width / self.block_size); x++) {
                self.cells[y].push("empty");
            }
        }

        // draw cells
        self.drawCells();
    };

    self.fillCell = function(x, y, color) {
        self.cursor.fillStyle = color;
        self.cursor.fillRect((x * self.block_size) + 1, (y * self.block_size) + 1,
                             self.block_size - 2, self.block_size - 2);
    }

    self.drawCells = function() {
        for (var x = 0; x < (self.width / self.block_size); x++) {
            for (var y = 0; y < (self.height / self.block_size); y++) {
                self.cursor.rect((x * self.block_size), (y * self.block_size),
                                 self.block_size, self.block_size);
            }
        }
        self.cursor.stroke();

        for (var y = 0; y < self.cells.length; y++) {
            for (var x = 0; x < self.cells[y].length; x++) {
                if (self.cells[y][x] === "player") {
                    self.fillCell(x, y, "#00ff00");
                }
                if (self.cells[y][x] === "block") {
                    self.fillCell(x, y, "#aaaaaa");
                }
                if (self.cells[y][x] === "exit") {
                    self.fillCell(x, y, "#ff0000");
                }
            }
        }
    };

    self.setCell = function(x, y, contents) {
        self.cells[y][x] = contents;
        self.drawCells();
    }

    self.getCell = function(x, y) {
        return self.cells[y][x];
    }

    self.isClear = function(x, y) {
        return (self.cells[y][x] === "empty" || self.cells[y][x] === "exit")
    }

    self.reset();

    return {
        width: (self.width / self.block_size),
        height: (self.height / self.block_size),
        reset: self.reset,
        setCell: self.setCell,
        getCell: self.getCell,
        isClear: self.isClear,
    };
}

$(function() {
    maze = Maze()
    maze.setCell(0, 0, "player");
    maze.setCell(maze.width - 1, maze.height - 1, "exit");
});
