<div class="stage"></div>
<script lang=ts>
import * as THREE from 'three';


import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import type { claim_space } from 'svelte/internal';

let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer, controls: { enableDamping: boolean; minDistance: number; maxDistance: number; target: { set: (arg0: number, arg1: number, arg2: number) => void; }; update: () => void; };
let model: THREE.Object3D<THREE.Event>
let anim: THREE.AnimationClip[]
let cams
let mixer: THREE.AnimationMixer
let action: THREE.AnimationAction
let time: THREE.Clock
let scrollDirection: number | boolean
let pageLength: number
let frameIncrement: number
let focus = new THREE.Vector3();
const Clock = new THREE.Clock();
init();

function init(this: any) {

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.zIndex = '-1';
    container.style.width = '100%';
    container.style.overflow = 'auto';
    document.body.appendChild( container );


    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 20 );
    camera.position.set( -10, 10, 10 );
    camera.lookAt(focus);

    scene = new THREE.Scene();
    // model

    new GLTFLoader()
        .setPath( 'models/' )
        .load( 'can-cam.glb', function ( gltf: any ) {

            anim = gltf.animations;
            cams = gltf.cameras;
            camera = cams[0]
            mixer = new THREE.AnimationMixer( gltf )
            action = mixer.clipAction( anim[0], camera );
            model = gltf.scene;
            action.play()
            action.paused = true;
            pageLength = (((anim[0].duration * 24) / frameIncrement) * window.innerHeight);

            //console.log(action)
            // console.log(camera)
            console.log(mixer)
            document.addEventListener( 'scroll', onScroll );
            window.addEventListener( 'resize', onWindowResize );
            scene.add( model );
            JSON.stringify(scene)


        } );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    container.style.height = '400vh';
    container.appendChild( renderer.domElement );

    const environment = new RoomEnvironment();
    const pmremGenerator = new THREE.PMREMGenerator( renderer );

    scene.background = new THREE.Color( 0xbbbbbb );
    scene.environment = pmremGenerator.fromScene( environment ).texture;
    // controls = new OrbitControls( camera, renderer.domElement );
    // controls.enableDamping = true;
    // controls.minDistance = 1;
    // controls.maxDistance = 10;
    // controls.target.set( 0, 0.35, 0 );
    // controls.update();

    // animate();

}


function onScroll(this: any) {
    // play a single frame of the animation on scroll
    // get scroll percentage and normalize it

    frameIncrement = 0.1;

    let scroll = window.scrollY / (document.body.scrollHeight - window.innerHeight)

    scrollDirection = this.oldScroll > window.scrollY
    this.oldScroll = window.scrollY
 
    // Adjust the current frame of the animation based on scroll direction
    const currentFrame = action.time;
    // console.log(currentFrame)
        if (action.time < action.getClip().duration && action.time >= 0) {
            if (scrollDirection) {
                action.time = currentFrame - frameIncrement;
            } else {
                action.time = currentFrame + frameIncrement;
            }
        } else {
            action.time = 0;
        }

    // console.log(action.time)
    // Render the updated frame
    requestAnimationFrame(animate);

    animate();
    // console.log(scroll)
    // set the animation time to the percentage
    // action.time = scroll * action.getClip().duration
    // console.log(action.time)
    
}


function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    const delta = Clock.getDelta();

    mixer.update( delta );

    // controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

    render();

}

function render() {

    // raycaster.setFromCamera( pointer, camera );

    // const intersects = raycaster.intersectObjects( scene.children )

    // for ( let i = 0; i < intersects.length; i ++ ) {
    //     focus = intersects[i].point
    // }
    renderer.render( scene, camera );

}
</script>
<style>
</style>