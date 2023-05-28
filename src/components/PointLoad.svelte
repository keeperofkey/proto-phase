<script lang=ts type="module">

    import * as THREE from 'three';

    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
    import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js';
    import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
    import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';

    let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
    let lines, geometry, material;
    init();
    render();

    function init() {

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );

        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.zIndex = '-1';
        container.style.width = '100%';
        container.style.overflow = 'auto';
        document.body.appendChild( container );
        container.appendChild( renderer.domElement );

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.01, 40 );
        camera.position.set( 0, 0, 1 );
        scene.add( camera );

        const controls = new OrbitControls( camera, renderer.domElement );
        controls.addEventListener( 'change', render ); // use if there is no animation loop
        controls.minDistance = 0.5;
        controls.maxDistance = 10;

        //scene.add( new THREE.AxesHelper( 1 ) );
        const loader = new PCDLoader();
        loader.load( 'models/willow_tree.pcd', function ( points ) {
            points.geometry.center();
            points.material.size = 0.01;
            points.name = 'willow_tree.pcd';
            material = points.material;
            geometry = points.geometry;
            lines = new THREE.Line(geometry, material)
            lines.name = 'lines';

            console.log(lines)
            scene.add(lines)
            scene.add( points );

            //

            render();

        } );
        // connect adjacent points with lines
        
        window.addEventListener( 'resize', onWindowResize );

        const environment = new RoomEnvironment();
        const pmremGenerator = new THREE.PMREMGenerator( renderer );

        scene.background = new THREE.Color( 0xf5f5f5f5);
        scene.environment = pmremGenerator.fromScene( environment ).texture;
    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

        render();

    }

    function render() {

        renderer.render( scene, camera );

    }

</script>