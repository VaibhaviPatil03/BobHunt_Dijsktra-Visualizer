function pathFinder(){
    var startTile = null;
    tiles.forEach((tile) => {
        var table = {};
        table.neighbours = findNeighbours(tile)
        if(tile.property == 'start'){
            table.costs = 0;
            startTile = tile;
        } else {
            table.costs = Infinity;
        }
        table.previousTile = null;
        table.visited = false;
        tile.table = table;
    });
    runTile(startTile);
}

function findNeighbours(tile) {
    var neighbours = [];

    for (let i = -1; i<2; i += 2){
        var neigh = {};
        neigh.row = tile.row+i;
        neigh.col = tile.col;
        var neighIndex = tiles.findIndex(tile => tile.row == neigh.row && tile.col == neigh.col)
        if(neigh.row >= 0 && neigh.row <=11 && neigh.col >= 0 && neigh.col <=11) {
            if(tiles[neighIndex].wall == true){}
            else{
                neighbours.push(neigh);
            }
        }
    }
    for (let i = -1; i<2; i += 2){
        var neigh = {};
        neigh.row = tile.row
        neigh.col = tile.col+i
        var neighIndex = tiles.findIndex(tile => tile.row == neigh.row && tile.col == neigh.col)
        if(neigh.row >= 0 && neigh.row <=11 && neigh.col >= 0 && neigh.col <=11) {
            if(tiles[neighIndex].wall == true){}
            else{
                neighbours.push(neigh);
            }
        }
    }
    return neighbours;
}

function runTile(currentTile){
    if ( currentTile.property == 'end'){
        drawRoad(currentTile);
    } else {
        currentTile.table.visited = true;
        $(`#${currentTile.row}_${currentTile.col}`).addClass('visited')

        var cost = 1 + currentTile.table.costs;
        var neighbours = currentTile.table.neighbours;
        neighbours.forEach(neighbour => {
            var nbIndex = tiles.findIndex(tile => tile.row == neighbour.row && tile.col == neighbour.col)
            if(cost < tiles[nbIndex].table.costs){
                tiles[nbIndex].table.costs = cost;
                console.log('tile: ', tiles[nbIndex].row, tiles[nbIndex].col, 'costs: ', tiles[nbIndex].table.costs)
                tiles[nbIndex].table.previousTile = tiles.findIndex(tile => tile.row == currentTile.row && tile.col == currentTile.col);
                $(`#${tiles[nbIndex].row}_${tiles[nbIndex].col}`).addClass('nbvisit')
                $(`#${tiles[nbIndex].row}_${tiles[nbIndex].col}`).css('background', `#D4${9-Math.floor(tiles[nbIndex].table.costs/2)}822`)
                
                $(`#${tiles[nbIndex].row}_${tiles[nbIndex].col}`).html(tiles[nbIndex].table.costs)
            } else {}
        });
        var nextTile = getMinCost();
        if(nextTile){
            setTimeout(() => {
                runTile(nextTile)
            }, 25);
        } else {
            console.log('No Tile Left')
        }
    }
}

function getMinCost(){
    var unvisitedTiles = [];
    tiles.forEach(tile => {
        if(tile.table.visited == false) {
            unvisitedTiles.push(tile)
        }
    });
    if(unvisitedTiles.length == 0) {
        console.log('All vertices were visited!')
        return null;
     }
    else {
        return unvisitedTiles.reduce((prev, curr) => {
            return prev.table.costs < curr.table.costs ? prev : curr
        })
    }
}

function drawRoad(finish) {
    console.log('Finish !')
    var way = [];
    var currentTile = finish;
    while(currentTile.property != 'start'){
        way.push(currentTile)
        currentTile = findPreviousTile(currentTile)
    }
    console.log(way)
    way.forEach(tile => {
        $(`#${tile.row}_${tile.col}`)
            .removeClass('visited').removeClass('nbvisit')
            .removeAttr("style")
            .addClass('shortestPath')
    });
}

function findPreviousTile(tile){
    return tiles[tile.table.previousTile]
}