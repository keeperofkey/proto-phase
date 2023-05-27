<script lang="ts">
    import * as THREE from 'three';

    import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js';
    import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
    import { HDRCubeTextureLoader } from 'three/examples/jsm/loaders/HDRCubeTextureLoader.js';

    let camera: THREE.Camera
    let scene: THREE.Scene
    let renderer: THREE.WebGLRenderer
    let material: THREE.Material | THREE.Material[]
    

    init();
    render();

    function init() {
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
        camera.lookAt(0, 0, 0);

        scene = new THREE.Scene();
        material = new THREE.PointsMaterial( { color: 0xff0000, size: 0.1 } );

        const loader = new PCDLoader();
        loader.load( 
            'models/willow.pcd', 
            function ( points ) {
                scene.add( points );
            },
            function ( xhr ) {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            function ( error ) {
                console.log( 'An error happened' );
            }
        );

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        container.appendChild( renderer.domElement );
        const pmremGenerator = new THREE.PMREMGenerator( renderer );
        const hdri = new THREE.TextureLoader().load( 'hdr/aircraft_workshop_01_1k.hdr', function () {
            const envMap = pmremGenerator.fromEquirectangular( hdri ).texture;
            // scene.background = envMap;
            scene.environment = envMap;
            hdri.dispose();
            pmremGenerator.dispose();
        } );
    }
    function render() {
        renderer.render( scene, camera );
    }
</script>