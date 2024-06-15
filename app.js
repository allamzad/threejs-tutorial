/*
 * Tutorial for creating a rendered animation of a 3D model (.gltf format)
 * using Javascript's 3D Library, Three.js
 * Source: https://threejs.org/docs/#manual/en/introduction/Installation 
 * and https://threejs.org/docs/#manual/en/introduction/Loading-3D-models
 */

import * as THREE from 'three';
/* GLTFLoader loads the 3D model of .gltf format */
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/* Window dimensions. */
const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight;

// Default Camera parameters in documentation
const FOV = 45;
const NEAR = 1;
const FAR = 1000;

// Camera location positioning
const CAMERA_X = 0;
const CAMERA_Y = 10;
const CAMERA_Z = 17;

// 3D Model positioning
const MODEL_X = 0;
const MODEL_Y = 10;
const MODEL_Z = 10;
const MODEL_SCALE = 0.5;

// Scence object paths
const BACKGROUND_IMG_PATH = "materials/space.jpg";
const MODEL_GLTF_PATH = "materials/shine.gltf";

// Light properties
const LIGHT_INTENSITY = 5;
const AMBIENT_COLOR = 0xffffff;     /* Color of light within model object */
const DIRECTIONAL_COLOR = 0xffd700; /* Color of light shining on model object */

// Animation properties
const ROTATE_X_DELAY = 2000;
const ROTATE_Y_DELAY = 1000;

// Scene of the animation.
let scene;
// The camera of the scene.
let camera;
// The 3D model object.
let model;
// Rendering object.
let renderer;

(function() {
    "use strict";

    /* Renders a scene featuring an animated 3D model. */
    function init() {
        createScene();
        configureCamera();
        setUpLight();
        addModel();
        renderScene();
    }

    /* Creates the scene for the rendered animation. */
    function createScene() {
        /* Creates the scene, which is where all Three.js objects are placed to be
        rendered (lights, cameras, shapes, etc.) */
        scene = new THREE.Scene();
        /* Set the scene background to a texture. */
        const texture = new THREE.TextureLoader().load(BACKGROUND_IMG_PATH);
        scene.background = texture;
    }

    /* Configure's the scene's camera. */
    function configureCamera() {
        /* Creates a camera with the perspective being determined by the input.
            Knowing input parameters requires knowing camera terminology, more
            here: https://threejs.org/docs/#api/en/cameras/PerspectiveCamera */
            camera = new THREE.PerspectiveCamera(FOV, WIDTH / HEIGHT, NEAR, FAR);
            /* Moves the camera to the 3D coordinates specified in the input.  
            Lowering z, zooms in. Increasing z, zooms out.  */
            camera.position.set(CAMERA_X, CAMERA_Y, CAMERA_Z);
        }

    /* Adds lights to the scene. */
    function setUpLight() {
        /* Adds a light to the scene from within the model */
        const ambientLight = new THREE.AmbientLight(AMBIENT_COLOR, LIGHT_INTENSITY); 
        ambientLight.position.set(MODEL_X, MODEL_Y, MODEL_Z);
        scene.add(ambientLight);

        /* Adds a light to the scene from above the model */
        const directionalLight = new THREE.DirectionalLight(DIRECTIONAL_COLOR, LIGHT_INTENSITY);
        directionalLight.position.set(MODEL_X, MODEL_Y, MODEL_Z + 1);
        scene.add(directionalLight);

        /* Adds a light to the scene from below the model */
        const directionalLight2 = new THREE.DirectionalLight(DIRECTIONAL_COLOR, LIGHT_INTENSITY); 
        directionalLight2.position.set(MODEL_X, MODEL_Y, MODEL_Z - 1);
        scene.add(directionalLight2);
        return scene;
    }

    /* Adds the 3D model to the scene. */
    function addModel() {
        /* Loads the model's .gltf file. */
        const loader = new GLTFLoader();
        loader.load(MODEL_GLTF_PATH, function (gltf) {
            model = gltf.scene;
            /* Scales the model to different dimensions. */
            model.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE);
            /* Sets the model's position on the scene. */
            model.position.set(MODEL_X, MODEL_Y, MODEL_Z);
            /* Adds the model to the scene. */
            scene.add(model);
        });
    }

    /* Renders the scene. */
    function renderScene() {
        /* WebGLRenderer renders the scene by using the WebGL Javascript API
        that can render interactive 2D and 3D graphics.
        Antialiasing makes edges on a 3D object smoother by blurring. */
        renderer = new THREE.WebGLRenderer({antialias: true });
        /* The rendered scene is fitted to the window's dimensions. */
        renderer.setSize(WIDTH, HEIGHT);
        /* Animates the model in a loop with the given animation function below. */
        renderer.setAnimationLoop(animate);
        /* Appends the rendered scene to the HTML body element. */
        document.body.appendChild(renderer.domElement);
    }

    /**
     * Rotates the model in the x and y directions and renders the animated frame.
     * @param {Number} time - the local time of the function, which gets clamped by 
     * clip.duration, the time it takes to make a full rotation.
     */
    function animate(time) {
        if (model && model.rotation) {
            model.rotation.x = time / ROTATE_X_DELAY;
            model.rotation.y = time / ROTATE_Y_DELAY;
        }
        /* Renders the animated frame */
        renderer.render(scene, camera);
    }

    init();
})();