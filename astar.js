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
        for (var x = 0; x < (self.width / self.block_size); x++) {
            for (var y = 0; y < (self.height / self.block_size); y++) {
                self.cursor.rect((x * self.block_size), (y * self.block_size),
                                 self.block_size, self.block_size);
            }
        }
        self.cursor.stroke();
    };

    self.fillCell = function(x, y, color) {
        self.cursor.fillStyle = color;
        self.cursor.fillRect((x * self.block_size) + 1, (y * self.block_size) + 1,
                             self.block_size - 2, self.block_size - 2);
    }

    self.setCell = function(x, y, contents) {
        self.cells[y][x] = contents;

        var color = "#ffffff";
        if (contents === "block") {
            color = "#aaaaaa";
        } else if (contents === "exit") {
            color = "#ff0000";
        } else if (contents === "player") {
            color = "#00ff00";
        } else if (contents === "path") {
            color = "#ffff00";
        }

        self.fillCell(x, y, color);
    }

    self.getCell = function(x, y) {
        return self.cells[y][x];
    }

    self.isClear = function(x, y) {
        return (self.cells[y][x] === "empty" || self.cells[y][x] === "exit")
    }

    self.toggleBlock = function(x, y) {
        if (self.getCell(x, y) === "empty") {
            self.setCell(x, y, "block");
        } else if (self.getCell(x, y) === "block") {
            self.setCell(x, y, "empty");
        }
    }

    self.canvas.onclick = function(evt) {
        var x = evt.clientX - self.canvas.getBoundingClientRect().left;
        var y = evt.clientY - self.canvas.getBoundingClientRect().top;
        x = x - (x % self.block_size);
        y = y - (y % self.block_size);
        x = x / self.block_size;
        y = y / self.block_size;

        self.toggleBlock(x, y);
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
