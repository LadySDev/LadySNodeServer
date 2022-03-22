class Graphics {

    mat4 = null;
    vec4 = null;
    vec3 = null;

    canvas = null;

    gl = null;
    extensions = null;

    vertexSource = `
    attribute vec3 aPos;
    attribute vec4 aColor;
    attribute vec2 aUV;
    varying vec4 fragColor;
    varying vec2 fragUV;
    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;
    void main() {
        fragColor = aColor;
        fragUV = aUV;
        gl_Position = mProj * mView * mWorld * vec4(aPos.x, aPos.y, aPos.z, 1.0);
    }`;
    fragmentSource = `
    precision mediump float;
    varying vec4 fragColor;
    varying vec2 fragUV;
    uniform sampler2D uMainText;
    void main() {
        gl_FragColor = fragColor * texture2D(uMainText, fragUV);
    }`;

    // fragmentSourceAtlas = `
    // precision mediump float;
    // varying vec4 fragColor;
    // varying vec2 fragUV;
    // uniform sampler2DArray uMainText;
    // void main() {
    //     gl_FragColor = fragColor * texture(uMainText, fragUV);
    // }`;

    shader = null;
    //shaderAtlas = null;
    program = null;
    //programAtlas = null;
    textures = [];
    

    fps = 30;
    fpsTimer = 0;
    interval = null;
    posCamera = [ 8, 8, 8 * Math.sqrt(2.5) ];

    leftClick = null;

// A [ 0, 0, 0 ]
// B [ 1, 1, 0 ]
// C [ 5, 5, ? ]
// alpha 26.6
// AC²= AB² + BC²
// 1.58

    posLookAt = [ 0, 0, 0];
    upDirection = [ 0, 0, 1];
    FOV = 45.0;
    near = 0.1;
    far = 1000.0;

    projection = { 
        type: "orthogonale",
        zoom: 8,
        width: 1,
        height: 1.5
    };

    worldData = null;
    myID = null;
    world = null;

    constructor(mat4, vec4, vec3) {
        this.mat4 = mat4;
        this.vec4 = vec4;
        this.vec3 = vec3;

        this.canvas = document.getElementById("canvas");
        this.canvas.width = 960;
        this.canvas.height = 480;

        //this.projection.width = 8;
        //this.projection.height = this.projection.width / 2;

        this.initWebGL();
        this.loopWebGL();
    }

    getWebGLContext( canvas_object ){
        /*
        return canvas_object.getContext("webgl") || // Standard
        canvas_object.getContext("experimental‐webgl") || // Alternative; Safari, others
        canvas_object.getContext("moz‐webgl") || // Firefox; mozilla
        canvas_object.getContext("webkit‐3d"); // Last resort;
        */
        return canvas_object.getContext("webgl2");
    }

    renderWebGL(){
        var now = Date.now() / 1000.0;
        var deltaTime = now - this.fpsTimer;
        var fps = 1 / deltaTime;
        
        document.getElementById("fpsSpan").innerHTML = " " + Math.floor(fps);

        this.fpsTimer = now;

        if ( !this.program )
            alert('Failed to initialize shaders.');
        else {  

            if(this.worldData !== null && this.world === null){
                this.world = new World(this);
            }

            this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        
            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);

            var matrixView = new Float32Array(16);
            //mat4.identity(matrixView);
            this.mat4.lookAt(matrixView, this.posCamera, this.posLookAt, this.upDirection);        
            
            var matrixProj = new Float32Array(16);
            //graphics.mat4.perspective(matrixProj, glMatrix.glMatrix.toRadian(graphics.FOV), graphics.canvas.width / graphics.canvas.height, graphics.near, graphics.far);
            this.mat4.ortho(matrixProj, this.projection.zoom * this.projection.width, - this.projection.zoom * this.projection.width, -this.projection.zoom * this.projection.width / this.projection.height, this.projection.zoom * this.projection.width / this.projection.height, this.near, this.far);
            //graphics.mat4.ortho(matrixProj, -graphics.canvas.width / 2, graphics.canvas.width / 2, -graphics.canvas.height / 2, graphics.canvas.height / 2, graphics.near, graphics.far);

            // DRAW 
            if(this.world !== null){
                this.world.render();
            }

            // if(this.leftClick !== null){
            
            //     // posX and posY are coordinates in canvas from width: 0 -> 960 and height: 0 -> 480
            //     // normalize device coords ndcX and ndcY are coordinates convert in canvas as display from -1 -> 1
            //     // into clip space z = -1 and w = 1, so we can now have a vector4
            //     // with the invert matrix projection we can have the eye coords from the clip coords x and y (z=-1.0 and w=0.0)
            //     // finally with the inverse matrix view we can have the world coords from the eye coords (keep only x,y and z and normalise the final vec3)

            //     var rayStart = [ (this.leftClick.posX / this.canvas.width - 0.5) * 2.0, (this.leftClick.posY / this.canvas.height - 0.5) * 2.0, -1.0, 1.0 ];
            //     var rayEnd = [ (this.leftClick.posX / this.canvas.width - 0.5) * 2.0, (this.leftClick.posY / this.canvas.height - 0.5) * 2.0, 0.0, 1.0 ];

            //     var matrixInvertProj = new Float32Array(16);
            //     this.mat4.invert(matrixInvertProj, matrixProj);

            //     var matrixInvertView = new Float32Array(16);
            //     this.mat4.invert(matrixInvertView, matrixView);

            //     var rayStartProj = [ 0, 0, 0, 0 ];
            //     this.vec4.transformMat4(rayStartProj, rayStart, matrixInvertProj);
            //     rayStartProj = [ rayStartProj[0], rayStartProj[1], -1.0, 0.0 ];

            //     var rayStartWorld = [ 0, 0, 0, 0 ];
            //     this.vec4.transformMat4(rayStartWorld, rayStartProj, matrixInvertView);
            //     var vector3RayStartWorld = [ rayStartWorld[0], rayStartWorld[1], rayStartWorld[2] ];
            //     this.vec3.normalize(vector3RayStartWorld, vector3RayStartWorld);

            //     //console.log("vector3RayStartWorld " + vector3RayStartWorld);

            //     var rayEndProj = [ 0, 0, 0, 0 ];
            //     this.vec4.transformMat4(rayEndProj, rayEnd, matrixInvertProj);
            //     rayEndProj = [ rayEndProj[0], rayEndProj[1], 1.0, 0.0 ];

            //     var rayEndWorld = [ 0, 0, 0, 0 ];
            //     this.vec4.transformMat4(rayEndWorld, rayEndProj, matrixInvertView);
            //     var vector3RayEndWorld = [ rayEndWorld[0], rayEndWorld[1], rayEndWorld[2] ];
            //     this.vec3.normalize(vector3RayEndWorld, vector3RayEndWorld);

            //     var rayDir = [ 0, 0, 0 ];
            //     this.vec3.subtract(rayDir, vector3RayEndWorld, vector3RayStartWorld);
            //     this.vec3.normalize(rayDir, rayDir);
            //     //console.log("rayDir " + rayDir);

            //     var EPSILON = 0.0000001;
            //     var found = false;

            //     for(var r=0;r<this.world.map.length;r++){
            //         for(var c=0;c<this.world.map[r].length;c++){
            //             var plane = this.world.map[r][c];

            //             // not tak account of rotation and scale !!!!!
            //             var pointA = [ plane.vertices[0], plane.vertices[1], plane.vertices[2], 1];
            //             this.vec4.transformMat4(pointA, pointA, plane.matrixModel);
            //             pointA = [ pointA[0], pointA[1], pointA[2]];

            //             var pointB = [ plane.vertices[3], plane.vertices[4], plane.vertices[5], 1];
            //             this.vec4.transformMat4(pointB, pointB, plane.matrixModel);
            //             pointB = [ pointB[0], pointB[1], pointB[2]];

            //             var pointC = [ plane.vertices[6], plane.vertices[7], plane.vertices[8], 1];
            //             this.vec4.transformMat4(pointC, pointC, plane.matrixModel);
            //             pointC = [ pointC[0], pointC[1], pointC[2]];

            //             var AB = [ 0, 0, 0];
            //             this.vec3.subtract(AB, pointB, pointA);
            //             //console.log("AB " + AB);

            //             var AC = [ 0, 0, 0];
            //             this.vec3.subtract(AC, pointC, pointA);
            //             //console.log("AC " + AC);

            //             // var cross = [ 0, 0, 0];
            //             // this.vec3.cross(cross, AB, AC);

            //             // var normal = [ 0, 0, 0];
            //             // this.vec3.normalize(normal, cross);

            //             //var distance = this.vec3.distance(normal, pointA);



            //             var h = [ 0, 0, 0];
            //             this.vec3.cross(h, rayDir, AC);

            //             //console.log("h " + h);

            //             var a = this.vec3.dot(AB, h);
            //             if(a > -EPSILON && a < EPSILON){
            //                 // not intersect
            //                 console.log("a false for map " + r + " " + c + " : " + a);
            //             }
            //             else {
            //                 //console.log("a TRUE for map " + r + " " + c + " : " + a);
            //             }

            //             var f = 1.0 / a;
            //             var s = [ 0, 0, 0 ];
            //             this.vec3.subtract(s, vector3RayStartWorld, pointA);

            //             var u = f * this.vec3.dot(s, h);
            //             if(u < 0.0 || u > 1.0){
            //                 // not intersect
            //                 //console.log("u false for map " + r + " " + c + " : " + u);
            //             }
            //             else {
            //                 console.log("u TRUE for map " + r + " " + c + " : " + u);
            //             }

            //             var q = [ 0, 0, 0];
            //             this.vec3.cross(q, s, AB);

            //             var v = f * this.vec3.dot(rayDir, q);
            //             if (v < 0.0 || u + v > 1.0)
            //             {
            //                 // not intersect
            //                 console.log("v false for map " + r + " " + c + " : " + v);
            //             }
            //             else {
            //                 //console.log("v TRUE for map " + r + " " + c + " : " + v);
            //             }

            //             var t = f * this.vec3.dot(AC, q);
            //             if(t > EPSILON){
            //                 var point = [ 0, 0, 0];
            //                 this.vec3.add(point, vector3RayStartWorld, [ rayDir[0] * t, rayDir[1] * t, rayDir[2] * t ])

            //                 console.log("t TRUE for map " + r + " " + c);

            //                 found = true;
            //                 break;
            //             }
            //             else {
            //                 // not intersect
            //                 //console.log("t false for map " + r + " " + c + " : " + t);
            //             }
            //         }

            //         if(found === true){
            //             break;
            //         }
            //     }

            //     this.leftClick = null;
            // }
        }
    }

    initWebGL(){
        if (!!window.WebGLRenderingContext == true){
            if ( this.gl = this.getWebGLContext( this.canvas ) ){
                console.log("WebGL is initialized.");

                // Ensure WebGL viewport is resized to match canvas dimensions
                this.gl.viewportWidth = this.canvas.width;
                this.gl.viewportHeight = this.canvas.height;

                // Output the WebGL rendering context object
                //console.log( this.gl );
                // List available extensions
                //console.log( this.extensions = this.gl.getSupportedExtensions() );
            
                // Shader  
                this.shader = new Shader();          
                var vertexShader = this.shader.createShader(this.gl, this.vertexSource, this.gl.VERTEX_SHADER);    
                var fragmentShader = this.shader.createShader(this.gl, this.fragmentSource, this.gl.FRAGMENT_SHADER);
                this.program = this.shader.createProgram(this.gl, vertexShader, fragmentShader);

                //this.gl.useProgram( this.program );

                this.shader.verticesAL = this.gl.getAttribLocation(this.program, "aPos");
                this.shader.colorsAL = this.gl.getAttribLocation(this.program, "aColor");
                this.shader.uvAL = this.gl.getAttribLocation(this.program, "aUV");

                this.shader.matrixViewUL = this.gl.getUniformLocation(this.program, "mView");
                this.shader.matrixProjUL = this.gl.getUniformLocation(this.program, "mProj");
                this.shader.matrixWorldUL = this.gl.getUniformLocation(this.program, "mWorld");

                this.shader.uvUL = this.gl.getUniformLocation(this.program, "uMainText");

                //this.gl.useProgram( null );

                // this.shaderAtlas = new Shader();
                // var vertexShaderAtlas = this.shaderAtlas.createShader(this.gl, this.vertexSource, this.gl.VERTEX_SHADER);
                // var fragmentShaderAtlas = this.shaderAtlas.createShader(this.gl, this.fragmentSourceAtlas, this.gl.FRAGMENT_SHADER);
                // this.programAtlas = this.shaderAtlas.createProgram(this.gl, vertexShaderAtlas, fragmentShaderAtlas);

                // //this.gl.useProgram( this.programAtlas );

                // this.shaderAtlas.verticesAL = this.gl.getAttribLocation(this.programAtlas, "aPos");
                // this.shaderAtlas.colorsAL = this.gl.getAttribLocation(this.programAtlas, "aColor");
                // this.shaderAtlas.uvAL = this.gl.getAttribLocation(this.programAtlas, "aUV");

                // this.shaderAtlas.matrixViewUL = this.gl.getUniformLocation(this.programAtlas, "mView");
                // this.shaderAtlas.matrixProjUL = this.gl.getUniformLocation(this.programAtlas, "mProj");
                // this.shaderAtlas.matrixWorldUL = this.gl.getUniformLocation(this.programAtlas, "mWorld");

                // this.shaderAtlas.uvUL = this.gl.getUniformLocation(this.programAtlas, "uMainText");

                var mainImage = new Image();
                mainImage.src = "../mainTexture.png";
                var mainTexture = this.shader.loadTexture(this.gl, mainImage);
                this.textures["main"] = mainTexture;

                var gridImage = new Image();
                gridImage.src = "../grid.png";
                var gridTexture = this.shader.loadTexture(this.gl, gridImage);
                this.textures["grid"] = gridTexture;

                console.log(this.textures);
                
                // var test1Image = new Image();
                // test1Image.src = "../triangles-g7483f8819_640.png";
                // var test1Texture = this.shader.loadTexture(this.gl, test1Image);
                // this.textures["test1"] = test1Texture;

                // var gridImage = new Image();
                // gridImage.src = "../grid.png";
                // var gridTexture = this.shaderAtlas.loadTeloadTextureAtlasxture(this.gl, gridImage, 2, 2, 1);
                // this.textures["grid"] = gridTexture;

                // var tilesheetImage = new Image();
                // tilesheetImage.src = "../tilesheet.png";
                // this.tilesheet = tilesheet;
                // var atlas = this.shaderAtlas.loadTextureAtlas(this.gl, tilesheetImage, this.tilesheet.frameWidth, this.tilesheet.frameHeight, this.tilesheet.frames.length);
                // this.textures["atlas"] = atlas;
                
                // Render
                this.renderWebGL();
            }else {
                console.log("Your browser doesn't support WebGL.");
            }
        } else {
            console.log("WebGL is supported, but disabled :‐(");
        }
    }

    loopWebGL(){
        this.interval = setInterval(() => {

            this.renderWebGL();

        }, 1000 / this.fps);
    }

    updateFPS(fps){
        clearInterval(this.interval);
        this.fps = fps;
        this.loopWebGL();
    }

    update(data){
        var state = JSON.parse(data.state);
        this.myID = data.id;

        if(state.fps !== this.fps){
            this.updateFPS(state.fps);
        }

        this.worldData = state.world;

        if(this.world !== null){
            this.world.update(state.world);
        }
    }

    onclick(posX, posY, clipX, clipY){
        //this.leftClick = { posX: posX, posY: posY, clipX: clipX, clipY: clipY };
    }
}