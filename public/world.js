class World {

    graphics = null;

    mapData = [];
    map = [];

    playersData = [];
    players = [];

    constructor(graphics){
        this.graphics = graphics;
        
        this.mapData = graphics.worldData.map;

        for(var i=0;i<this.mapData.length;i++){
            this.map[i] = [];
            for(var j=0;j<this.mapData[i].length;j++){

                var plane = new Plane();
                plane.setPosition(j, i, 0);
                plane.texture = this.mapData[i][j].frame;
                // plane.uvs = [
                //     this.graphics.tilesheet.frames[ this.mapData[i][j].frame ].left, this.graphics.tilesheet.frames[ this.mapData[i][j].frame ].top,
                //     (this.graphics.tilesheet.frames[ this.mapData[i][j].frame ].left + this.graphics.tilesheet.frameWidth) / this.graphics.tilesheet.width, this.graphics.tilesheet.frames[ this.mapData[i][j].frame ].top,
                //     (this.graphics.tilesheet.frames[ this.mapData[i][j].frame ].left + this.graphics.tilesheet.frameWidth) / this.graphics.tilesheet.width, (this.graphics.tilesheet.frames[ this.mapData[i][j].frame ].top + this.graphics.tilesheet.frameHeight) / this.graphics.tilesheet.height,
                //     this.graphics.tilesheet.frames[ this.mapData[i][j].frame ].left, (this.graphics.tilesheet.frames[ this.mapData[i][j].frame ].top + this.graphics.tilesheet.frameHeight) / this.graphics.tilesheet.height
                // ];
                plane.vao = this.graphics.shader.createVAO(this.graphics.gl, plane.vertices, this.graphics.shader.verticesAL, plane.indices, plane.colors, this.graphics.shader.colorsAL, plane.uvs, this.graphics.shader.uvAL);
                plane.matrixModel = this.graphics.shader.createMatrixModel(this.graphics, plane);

                this.map[i][j] = plane;                
            }
        }

        this.playersData = graphics.worldData.players;
        for(var id in this.playersData){
            // create new player
            var plane = new Plane();
            plane.setPosition(this.playersData[id].posX, this.playersData[id].posY, 0);
            //plane.texture = "atlas";
            // plane.uvs = [
            //     this.graphics.tilesheet.frames[ "arrow" ].left, this.graphics.tilesheet.frames[ "arrow" ].top,
            //     (this.graphics.tilesheet.frames[ "arrow" ].left + this.graphics.tilesheet.frameWidth) / this.graphics.tilesheet.width, this.graphics.tilesheet.frames[ "arrow" ].top,
            //     (this.graphics.tilesheet.frames[ "arrow" ].left + this.graphics.tilesheet.frameWidth) / this.graphics.tilesheet.width, (this.graphics.tilesheet.frames[ "arrow" ].top + this.graphics.tilesheet.frameHeight) / this.graphics.tilesheet.height,
            //     this.graphics.tilesheet.frames[ "arrow" ].left, (this.graphics.tilesheet.frames[ "arrow" ].top + this.graphics.tilesheet.frameHeight) / this.graphics.tilesheet.height
            // ];
            plane.vao = this.graphics.shader.createVAO(this.graphics.gl, plane.vertices, this.graphics.shader.verticesAL, plane.indices, plane.colors, this.graphics.shader.colorsAL, plane.uvs, this.graphics.shader.uvAL);
            plane.matrixModel = this.graphics.shader.createMatrixModel(this.graphics, plane);

            this.players[id] = plane;
        }
    }

    update(world){
        
        for(var id in world.players){
            if(this.players[id] === undefined){
                // create new player
                var plane = new Plane();
                plane.setPosition(world.players[id].posX, world.players[id].posY, 0);
                //plane.setOffset(0.5, 0.5, 0);
                //plane.setColor(0.0, 0.0, 1.0, 1.0);
                plane.vao = this.graphics.shader.createVAO(this.graphics.gl, plane.vertices, this.graphics.shader.verticesAL, plane.indices, plane.colors, this.graphics.shader.colorsAL, plane.uvs, this.graphics.shader.uvAL);
                plane.matrixModel = this.graphics.shader.createMatrixModel(this.graphics, plane);

                this.players[id] = plane;
            }
            else if(this.playersData[id].posX !== world.players[id].posX || this.playersData[id].posY !== world.players[id].posY){
                this.players[id].setPosition(world.players[id].posX, world.players[id].posY, 0);
                this.players[id].matrixModel = this.graphics.shader.createMatrixModel(this.graphics, this.players[id]);

                if(id === this.graphics.myID){
                    this.graphics.posCamera = [ world.players[id].posX + this.graphics.projection.zoom, world.players[id].posY + this.graphics.projection.zoom, this.graphics.projection.zoom * Math.sqrt(2.5) ];
                    this.graphics.posLookAt = [ world.players[id].posX, world.players[id].posY, this.graphics.posLookAt[2] ];
                }
            }
        }

        var toRemoveIDS = [];
        for(var id in this.players){
            if(world.players[id] === undefined){
                toRemoveIDS.push(id);
            }
        }

        for(var i=0;i<toRemoveIDS.length;i++){
            var id = toRemoveIDS[i];
            delete this.players[id];
        }

        this.playersData = world.players;
    }

    render(){
        for(var c=0;c<this.map[0].length;c++){
            for(var r=0;r<this.map.length;r++){
                this.graphics.shader.renderObject(this.graphics, this.map[r][c]);
            }
        }

        for(var id in this.players){
            this.graphics.shader.renderObject(this.graphics, this.players[id]);
        }
    }

    
}