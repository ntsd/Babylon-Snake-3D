/**
 * Created by ntsd on 4/6/2017.
 */
window.addEventListener('DOMContentLoaded', function(){
    // get the canvas DOM element
    var canvas = document.getElementById('renderCanvas');

    // load the 3D engine
    var engine = new BABYLON.Engine(canvas, true);

    var snakeArray =[];

    var mapWidth = 20;
    var mapHeight = 20;

    var mapArray = [];

    var direction = "";

    var keyDirection = "";

    var foodArray = []

    // createScene function that creates and return the scene
    var createScene = function(){
        // create a basic BJS Scene object
        var scene = new BABYLON.Scene(engine);

        //Create an Arc Rotate Camera - aimed negative z this time
        var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, 1.0, 110, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);

        // target the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // attach the camera to the canvas
        //camera.attachControl(canvas, false);

        // create a basic light, aiming 0,1,0 - meaning, to the sky
//                var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);
        //Create a light
        var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(-60, 60, 80), scene);

        // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
        var ground = BABYLON.Mesh.CreatePlane("ground", 100, scene);
        ground.position.y = -5;
        ground.rotation.x = Math.PI / 2;

        var materialGrass = new BABYLON.StandardMaterial("grass", scene);
        materialGrass.diffuseTexture = new BABYLON.Texture("textures/grass1.jpg", scene);
        materialGrass.diffuseTexture.uScale = 10.0;//Repeat 5 times on the Vertical Axes
        materialGrass.diffuseTexture.vScale = 10.0;//Repeat 5 times on the Horizontal Axes
        materialGrass.backFaceCulling = false;//Always show the front and the back of an element


        var materialBox = new BABYLON.StandardMaterial("box", scene);
        materialBox.diffuseTexture = new BABYLON.Texture("textures/box1.png", scene);
        materialBox.diffuseTexture.uScale = 20.0;//Repeat 5 times on the Vertical Axes
        materialBox.diffuseTexture.vScale = 20.0;//Repeat 5 times on the Horizontal Axes
        materialBox.backFaceCulling = false;//Always show the front and the back of an element


        ground.material = materialBox;


        // return the created scene
        return scene;
    };

    // call the createScene function
    var scene = createScene();

    var createSnakeBox = function(){
        var boxOptions = {
            width: 5,
            height: 5,
            depth: 5
        };
        var box = BABYLON.MeshBuilder.CreateBox('box', boxOptions, scene);
        snakeArray.push(box)
    };

    var createFood = function(x, z){
        var sphereOptions = {
            width: 5,
            height: 5,
            depth: 5
        };
        var food = BABYLON.MeshBuilder.CreateSphere('box', sphereOptions, scene);
        food.position.x = x;
        food.position.z = z;
        foodArray.push(food)
    };

    createSnakeBox();

    var startCreate = 0;

    var create = 0;

    var loop=0;

    // run the render loop
    engine.runRenderLoop(function(){
        scene.render();

        //change head snake
        var oldX;
        var oldZ;
        var beforeX;
        var beforeZ;
        var moved = 0;

        var head = snakeArray[0]; //clone head snake
        if(loop%10==0){
            if(keyDirection == "z-") {
                direction = "z-";
            }
            else if(keyDirection == "z+"){
                direction = "z+";
            }
            else if(keyDirection == "x-"){
                direction = "x-";
            }
            else if(keyDirection == "x+"){
                direction = "x+";
            }
            else{
                direction = "";
            }
            if(startCreate==1){
                create=1;
            }else{
                create=0;
            }
            startCreate=0;
            // keyDirection="";
        }


        if(direction == "z-") {
            beforeZ = head.position.z - 0.5;
            beforeX = head.position.x;
            moved = 1;
        }
        else if(direction == "z+"){
            beforeZ = head.position.z + 0.5;
            beforeX = head.position.x;
            moved = 1;
        }
        else if(direction == "x-"){
            beforeX = head.position.x - 0.5;
            beforeZ = head.position.z;
            moved = 1;
        }
        else if(direction == "x+"){
            beforeX = head.position.x + 0.5;
            beforeZ = head.position.z;
            moved = 1;
        }
        else{
            beforeX = head.position.x;
            beforeZ = head.position.z;
        }

        if(create == 1){
            var box = BABYLON.MeshBuilder.CreateBox('box', {
                width: 5,
                height: 5,
                depth: 5
            }, scene);
            box.position.x = snakeArray[snakeArray.length-1].position.x;
            box.position.z = snakeArray[snakeArray.length-1].position.z;
        }

        if(moved == 1){
            snakeArray.forEach(function (snakeBox) {
                oldX = snakeBox.position.x;
                oldZ = snakeBox.position.z;
                snakeBox.position.x = beforeX;
                snakeBox.position.z = beforeZ;
                beforeX = oldX;
                beforeZ = oldZ;
            });
        }

        if(create == 1){
            snakeArray.push(box);
            console.log(snakeArray);
        }

        loop+=1;


        // direction = "";
    });

    // the canvas/window resize event handler
    window.addEventListener('resize', function(){
        engine.resize();
    });
    
    function snakeController(evt) {
        var keyCode = evt.keyCode;
        //console.log(String.fromCharCode(keyCode));
        switch (String.fromCharCode(keyCode)) {
            case "A"://37 : //left
                keyDirection = "x+";
                break;
            case "W"://38 : //up
                keyDirection = "z-";
                break;
            case "D"://39 : //right
                keyDirection = "x-";
                break;
            case "S"://40: // down
                keyDirection = "z+";
                break;
            case "F":
                startCreate =1;
                break;
        }
    }
    
    window.addEventListener("keydown", snakeController);
});