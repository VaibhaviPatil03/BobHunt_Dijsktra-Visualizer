var tiles = [];
$(document).ready(() => {
    // Draw Tiles
    drawTiles();
    
    // Change Tiles When They Are Clicked
    changeTiles();

    // Create Start End Tiles
    startEndTiles();

    $('#letItGo').on('click', () => {
        clearAfterFinish();
        pathFinder();
    })

    $('#randomly').on('click', () => {
        randomStartEnd();
    })
});

class Tiles {
    constructor(row, col) {
      this.row = row;
      this.col = col;
      this.wall = false;
      this.property = 'ordinary';
    }
}

function randomStartEnd(){
    var rndPoints = {
        startIndex: Math.floor(Math.random() * Math.floor(144)),
        endIndex: Math.floor(Math.random() * Math.floor(144))
    }
    clearMap();
    startEndTiles(rndPoints);
}

function startEndTiles(extPoints){
    var points = null;
    if(extPoints){
        points = extPoints
    } else {
        points = initialExample();
    }
    if (points.startIndex == points.endIndex) {
        points.endIndex = Math.floor(Math.random() * Math.floor(144));
    }
    tiles[points.startIndex].property = 'start';
    $(`#${tiles[points.startIndex].row}_${tiles[points.startIndex].col}`).addClass('starting').html('Oliver')
    tiles[points.endIndex].property = 'end';
    $(`#${tiles[points.endIndex].row}_${tiles[points.endIndex].col}`).addClass('ending').html('Bob')
    console.log(points.startIndex, points.endIndex)
    
}

function drawTiles(){
    for(let row=0; row<12; row++){
        $('#arena').append(`<div class="row text-center" id="row-${row}">`);
        for(let col=0; col<12; col++){
            $(`#row-${row}`).append(`<div class="tile col border rounded" id="${row}_${col}">-</div>`)
            tiles.push(new Tiles(row, col))
        }
    }
}

function changeTiles(){
    $('.tile').on('click', e => {
        var tileId = e.target.id;
        var spreader = tileId.indexOf('_');
        var row = tileId.substr(0,spreader);
        var col = tileId.substr(spreader+1);
        var indexOfTile = tiles.findIndex(tile => tile.row == row && tile.col == col)

        if(tiles[indexOfTile].property == 'ordinary') {
            if(tiles[indexOfTile].wall == true) {
                tiles[indexOfTile].wall = false
                $(`#${tileId}`).removeClass('wall')
            }
            else {
                tiles[indexOfTile].wall = true;
                $(`#${tileId}`).addClass('wall');
            }
        }

        clearAfterFinish();

        console.log('tileId: ', tileId)
        console.log('row: ', row, 'col: ', col)
        console.log(tiles[indexOfTile])
        console.log('index: ', indexOfTile)
    });
}

function clearMap(){
    tiles.forEach(tile => {
        tile.property ='ordinary';
        tile.wall = false;
        $(`#${tile.row}_${tile.col}`).removeClass().addClass('tile col border rounded')
        clearAfterFinish();
    });
}

function clearAfterFinish() {
 
        tiles.forEach(tile => {
            if (tile.property == 'start'){}
            else if  (tile.property == 'end') {
                $(`#${tile.row}_${tile.col}`).html('Bob')
            } else {
                $(`#${tile.row}_${tile.col}`).html('-')
            }
            $(`#${tile.row}_${tile.col}`).removeClass('shortestPath visited nbvisit')
            $(`#${tile.row}_${tile.col}`).removeAttr("style");
        });

}