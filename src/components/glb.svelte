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
            animate();


        } );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    container.appendChild( renderer.domElement );

    const environment = new RoomEnvironment();
    const pmremGenerator = new THREE.PMREMGenerator( renderer );

    scene.background = new THREE.Color( 0xf5f5f5 );
    scene.environment = pmremGenerator.fromScene( environment ).texture;
    controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controls.target.set( 0, 0.35, 0 );
    controls.update();

    animate();

}


function onScroll() {
    // Normalize scroll position to 0-1
    let scroll = window.scrollY / (document.body.scrollHeight - window.innerHeight)
    // Clamp scroll position (0-1) insures you dont go out of animation bounds
    const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);
    scroll = clamp(scroll, 0, 0.99)
    // Set the animation time to the scroll position mapped to the animation duration 
    action.time = scroll * action.getClip().duration
    // console.log(action.time)
    // console.log(scroll) 
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
<style lang="scss">
    $beaver: #8C7865ff;
    $silver: #BABABAff;
    $dim-gray: #686862ff;
    $jet: #2B2C2Cff;
    $battleship-gray: #87837Eff;
</style>