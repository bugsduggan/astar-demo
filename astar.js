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
        return (self.getCell(x, y) === "empty" || self.getCell(x, y) === "exit" || self.getCell(x, y) === "path")
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

function findNext(openSet, fScore) {
    var bestFScore = 32000;
    var bestCell;
    openSet.keys().forEach(function(entry) {
        if (fScore[entry] < bestFScore) {
            bestFScore = fScore[entry];
            bestCell = entry;
        }
    });
    return bestCell;
}

function getNeighbours(cell) {
    var x = parseInt(cell.split(",")[0]);
    var y = parseInt(cell.split(",")[1]);
    var n = Array();

    if (x > 0 && y > 0) {
        n.push((x - 1) + "," + (y - 1));
    }
    if (y > 0) {
        n.push( x      + "," + (y - 1));
    }
    if (x < (maze.width - 1) && y > 0) {
        n.push((x + 1) + "," + (y - 1));
    }
    if (x < (maze.width - 1)) {
        n.push((x + 1) + "," +  y     );
    }
    if (x < (maze.width - 1) && y < (maze.height - 1)) {
        n.push((x + 1) + "," + (y + 1));
    }
    if (y < (maze.height - 1)) {
        n.push( x      + "," + (y + 1));
    }
    if (x > 0 && y < (maze.height - 1)) {
        n.push((x - 1) + "," + (y + 1));
    }
    if (x > 0) {
        n.push((x - 1) + "," +  y     );
    }

    return n;
}

function distanceBetween(a, b) {
    ax = parseInt(a.split(",")[0]);
    ay = parseInt(a.split(",")[1]);
    bx = parseInt(b.split(",")[0]);
    by = parseInt(b.split(",")[1]);

    return (Math.abs(ax - bx) + Math.abs(ay - by));
}

function estimateCost(a, b) {
    return distanceBetween(a, b);
}

function reconstructPath(cameFrom, current) {
    if (cameFrom.hasOwnProperty(current)) {
        var p = reconstructPath(cameFrom, cameFrom[current]);
        p.push(current);
        return p;
    } else {
        return Array(current);
    }
}

function aStar(startX, startY, endX, endY) {
    var start = startX + ',' + startY;
    var goal = endX + ',' + endY;

    var closedSet = new MiniSet();
    var openSet = new MiniSet(start);
    var cameFrom = {};

    var gScore = {};
    gScore[start] = 0;
    var fScore = {};
    fScore[start] = gScore[start] + estimateCost(start, goal);

    while (!openSet.isEmpty()) {
        var current = findNext(openSet, fScore);
        if (current === goal) {
            return reconstructPath(cameFrom, current);
        }

        openSet.remove(current);
        closedSet.add(current);

        getNeighbours(current).forEach(function(entry) {
            if (closedSet.has(entry)) {
                return;
            }
            var tentativeScore = gScore[current] + distanceBetween(current, entry);

            if (!openSet.has(entry) || tentativeScore < gScore[entry]) {
                cameFrom[entry] = current;
                gScore[entry] = tentativeScore;
                fScore[entry] = gScore[entry] + estimateCost(entry, goal);
                if (!openSet.has(entry)) {
                    openSet.add(entry);
                }
            }
        });
    }

    return null;
}

function execute() {
    aStar(0, 0, maze.width - 1, maze.height -1).forEach(function(entry) {
        var x = parseInt(entry.split(",")[0]);
        var y = parseInt(entry.split(",")[1]);

        if (maze.getCell(x, y) != "player" && maze.getCell(x, y) != "exit") {
            maze.setCell(x, y, "path");
        }
    });
}

$(function() {
    maze = Maze()
    maze.setCell(0, 0, "player");
    maze.setCell(maze.width - 1, maze.height - 1, "exit");
});
