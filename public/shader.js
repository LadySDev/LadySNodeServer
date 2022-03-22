class Shader {

    verticesAL = null;
    colorsAL = null;
    uvAL = null;
    matrixProjUL = null;
    matrixViewUL = null;
    matrixWorldUL = null;
    uvUL = null;

    constructor() {
    
    }

    createShader(gl, source, type){
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shader: " + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return false;
        }
        return shader;
    }

    createProgram(gl, vertexShader, fragmentShader){
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
            alert("An error occurred creating the program: " + gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return false;
        }
        gl.detachShader(program, vertexShader);
        gl.detachShader(program, fragmentShader);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return program;
    }

    loadTexture(gl, image){
        var text = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, text);
        

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        gl.generateMipmap(gl.TEXTURE_2D);

        gl.bindTexture(gl.TEXTURE_2D, null);
        return { texture: text, type: "TEXTURE_2D" };
    }

    loadTextureAtlas(gl, image, width, height, count){
        var text = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D_ARRAY, text);
        

        // gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        // gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);

        // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA, width, height, count, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);


        //gl.generateMipmap(gl.TEXTURE_2D_ARRAY);

        gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
        return { texture: text, type: "TEXTURE_2D_ARRAY" };
    }

    createVAO(gl, vertices, verticesAL, indices, colors, colorsAL, uvs, uvAL){
        var vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        var verticesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        
        gl.enableVertexAttribArray(verticesAL);
        gl.vertexAttribPointer(verticesAL, 3, gl.FLOAT, gl.FALSE, 0, 0);
            
        var indicesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        
        var colorsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(colorsAL);
        gl.vertexAttribPointer(colorsAL, 4, gl.FLOAT, gl.FALSE, 0, 0);
        
        var uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
         
        gl.enableVertexAttribArray(uvAL);
        gl.vertexAttribPointer(uvAL, 2, gl.FLOAT, gl.FALSE, 0, 0);

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return vao;
    }

    createMatrixModel(graphics, object){
        var matrixWorld = new Float32Array(16);
        graphics.mat4.identity(matrixWorld);

        //graphics.gl.bindVertexArray(object.vao);

        var matrixIdentity = new Float32Array(16);
        graphics.mat4.identity(matrixIdentity);
    
        var matrixTranslate = new Float32Array(16);
        graphics.mat4.translate(matrixTranslate, matrixIdentity, [object.positionX + object.offsetX, object.positionY + object.offsetY, object.positionZ + object.offsetZ]);
    
        var matrixRotateX = new Float32Array(16);
        graphics.mat4.rotateX(matrixRotateX, matrixIdentity, glMatrix.glMatrix.toRadian(object.rotationX));
        var matrixRotateY = new Float32Array(16);
        graphics.mat4.rotateY(matrixRotateY, matrixIdentity, glMatrix.glMatrix.toRadian(object.rotationY));
        var matrixRotateZ = new Float32Array(16);
        graphics.mat4.rotateZ(matrixRotateZ, matrixIdentity, glMatrix.glMatrix.toRadian(object.rotationZ));
    
        var matrixRotateXY = new Float32Array(16);
        graphics.mat4.mul(matrixRotateXY, matrixRotateX, matrixRotateY);
        var matrixRotate = new Float32Array(16);
        graphics.mat4.mul(matrixRotate, matrixRotateXY, matrixRotateZ);
    
        var matrixScale = new Float32Array(16);
        graphics.mat4.scale(matrixScale, matrixIdentity, [object.scaleX, object.scaleY, object.scaleZ]);
    
        var matrixTranslateRotate = new Float32Array(16);
        graphics.mat4.mul(matrixTranslateRotate, matrixTranslate, matrixRotate);
    
        graphics.mat4.mul(matrixWorld, matrixTranslateRotate, matrixScale);

        return matrixWorld;
    }

    renderObject(graphics, object){
        var matrixView = new Float32Array(16);
        //mat4.identity(matrixView);
        graphics.mat4.lookAt(matrixView, graphics.posCamera, graphics.posLookAt, graphics.upDirection);        
        
        var matrixProj = new Float32Array(16);
        //graphics.mat4.perspective(matrixProj, glMatrix.glMatrix.toRadian(graphics.FOV), graphics.canvas.width / graphics.canvas.height, graphics.near, graphics.far);
        graphics.mat4.ortho(matrixProj, graphics.projection.zoom * graphics.projection.width, - graphics.projection.zoom * graphics.projection.width, -graphics.projection.zoom * graphics.projection.width / graphics.projection.height, graphics.projection.zoom * graphics.projection.width / graphics.projection.height, graphics.near, graphics.far);
        //graphics.mat4.ortho(matrixProj, -graphics.canvas.width / 2, graphics.canvas.width / 2, -graphics.canvas.height / 2, graphics.canvas.height / 2, graphics.near, graphics.far);

        //var matrixWorld = new Float32Array(16);
        //graphics.mat4.identity(matrixWorld);

        graphics.gl.bindVertexArray(object.vao);

        // var matrixIdentity = new Float32Array(16);
        // graphics.mat4.identity(matrixIdentity);
    
        // var matrixTranslate = new Float32Array(16);
        // graphics.mat4.translate(matrixTranslate, matrixIdentity, [object.positionX + object.offsetX, object.positionY + object.offsetY, object.positionZ + object.offsetZ]);
    
        // var matrixRotateX = new Float32Array(16);
        // graphics.mat4.rotateX(matrixRotateX, matrixIdentity, glMatrix.glMatrix.toRadian(object.rotationX));
        // var matrixRotateY = new Float32Array(16);
        // graphics.mat4.rotateY(matrixRotateY, matrixIdentity, glMatrix.glMatrix.toRadian(object.rotationY));
        // var matrixRotateZ = new Float32Array(16);
        // graphics.mat4.rotateZ(matrixRotateZ, matrixIdentity, glMatrix.glMatrix.toRadian(object.rotationZ));
    
        // var matrixRotateXY = new Float32Array(16);
        // graphics.mat4.mul(matrixRotateXY, matrixRotateX, matrixRotateY);
        // var matrixRotate = new Float32Array(16);
        // graphics.mat4.mul(matrixRotate, matrixRotateXY, matrixRotateZ);
    
        // var matrixScale = new Float32Array(16);
        // graphics.mat4.scale(matrixScale, matrixIdentity, [object.scaleX, object.scaleY, object.scaleZ]);
    
        // var matrixTranslateRotate = new Float32Array(16);
        // graphics.mat4.mul(matrixTranslateRotate, matrixTranslate, matrixRotate);
    
        // graphics.mat4.mul(matrixWorld, matrixTranslateRotate, matrixScale);

        var matrixWorld = object.matrixModel;

        if(graphics.textures[object.texture].type === "TEXTURE_2D"){
            graphics.gl.useProgram( graphics.program );

            graphics.gl.uniformMatrix4fv(graphics.shader.matrixProjUL, graphics.gl.FALSE, matrixProj);
            graphics.gl.uniformMatrix4fv(graphics.shader.matrixViewUL, graphics.gl.FALSE, matrixView);
            graphics.gl.uniformMatrix4fv(graphics.shader.matrixWorldUL, graphics.gl.FALSE, matrixWorld);
                
            graphics.gl.activeTexture(graphics.gl.TEXTURE0);
            graphics.gl.bindTexture(graphics.gl.TEXTURE_2D, graphics.textures[object.texture].texture);
            graphics.gl.uniform1i(graphics.shader.uvUL, 0);
        }
        // if(graphics.textures[object.texture].type === "TEXTURE_2D_ARRAY"){
        //     graphics.gl.useProgram( graphics.programAtlas );

        //     graphics.gl.uniformMatrix4fv(graphics.shaderAtlas.matrixProjUL, graphics.gl.FALSE, matrixProj);
        //     graphics.gl.uniformMatrix4fv(graphics.shaderAtlas.matrixViewUL, graphics.gl.FALSE, matrixView);
        //     graphics.gl.uniformMatrix4fv(graphics.shaderAtlas.matrixWorldUL, graphics.gl.FALSE, matrixWorld);
                
        //     graphics.gl.activeTexture(graphics.gl.TEXTURE0);
        //     graphics.gl.bindTexture(graphics.textures[object.texture].type, graphics.textures[object.texture].texture);
        //     graphics.gl.uniform1i(graphics.shaderAtlas.uvUL, 0);
        // }

        var mode = graphics.gl.POINT;
    
        if(object.mode === "TRIANGLES"){
            mode = graphics.gl.TRIANGLES;
        }
    
        graphics.gl.drawElements(mode, object.indices.length, graphics.gl.UNSIGNED_SHORT, 0); 
        
        graphics.gl.bindVertexArray(null);
        //graphics.gl.bindTexture(graphics.gl.TEXTURE_2D, null);
    }
}