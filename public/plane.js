class Plane {
    vertices = [
        -0.5, 0.5, 0.0,
        0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];

    uvs = [
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ];

    indices = [
        0, 1, 2,
        2, 3, 0
    ];

    mode = "TRIANGLES";

    vao = null;

    positionX = 0;
    positionY = 0;
    positionZ = 0;

    offsetX = 0.5;
    offsetY = 0.5;
    offsetZ = 0;

    rotationX = 0;
    rotationY = 0;
    rotationZ = 0;

    scaleX = 1;
    scaleY = 1;
    scaleZ = 1;

    colorR = 1.0;
    colorG = 1.0;
    colorB = 1.0;
    colorA = 1.0;

    colors = [
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0
    ];

    texture = "main";
    matrixModel = new Float32Array(16);

    constructor() {
    }

    getVertices(){
        return this.vertices;
    }

    getIndices(){
        return this.indices;
    }

    getRenderMode(){
        return this.mode;
    }

    setPosition(x, y, z){
        this.positionX = x;
        this.positionY = y;
        this.positionZ = z;
    }

    getPosition(){
        return { x: this.positionX, y: this.positionY, z: this.positionZ }
    }

    setOffset(x, y, z){
        this.offsetX = x;
        this.offsetY = y;
        this.offsetZ = z;
    }

    setRotation(x, y, z){
        this.rotationX = x;
        this.rotationY = y;
        this.rotationZ = z;
    }

    getRotation(){
        return { x: this.rotationX, y: this.rotationY, z: this.rotationZ }
    }

    setColor(r, g, b, a){
        this.colorR = r;
        this.colorG = g;
        this.colorB = b;
        this.colorA = a;

        this.colors[0] = this.colors[4] = this.colors[8] = this.colors[12] = this.colorR;
        this.colors[1] = this.colors[5] = this.colors[9] = this.colors[13] = this.colorG;
        this.colors[2] = this.colors[6] = this.colors[10] = this.colors[14] = this.colorB;
        this.colors[3] = this.colors[7] = this.colors[11] = this.colors[15] = this.colorA;
    }

    getColor(){
        return { r: this.colorR, g: this.colorG, b: this.colorB, a: this.colorA }
    }
}
