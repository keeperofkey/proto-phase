<script lang=ts type="module">

    import * as THREE from 'three';
    import glslCurlNoise from 'glsl-curl-noise/curl.glsl';
    import glslNoise from 'glsl-noise/simplex/3d.glsl';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
    import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js';
    import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
    import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';

    let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
    let lines, geometry, material: THREE.PointsMaterial;
    init();
    animate();
    // render();

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
        // material = new THREE.PointsMaterial( { size: 0.04, vertexColors: true } );
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                amplitude: { value: 1.0 },
                frequency: { value: 1.0 }
            },
            vertexShader: `
                uniform float time;
                uniform float amplitude;
                uniform float frequency;
                varying vec3 vColor;
                varying vec3 vPosition;
                ${glslNoise}
                ${glslCurlNoise}
                void main() {
                vColor = color;
                vPosition = position;
                vec3 noise = curlNoise(position * frequency + time);
                vec3 offset = noise * amplitude;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position + offset, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                void main() {
                gl_FragColor = vec4(vColor, 1.0);
                }
            `
            });
        camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.01, 40 );
        camera.position.set( 0, 0, 1 );
        scene.add( camera );

        const controls = new OrbitControls( camera, renderer.domElement );
        controls.addEventListener( 'change', render ); // use if there is no animation loop
        controls.minDistance = 0.5;
        controls.maxDistance = 10;

        //scene.add( new THREE.AxesHelper( 1 ) );
        const loader = new PCDLoader();
        loader.load( 'models/willow-tree.pcd', function ( points ) {
            points.geometry.center();
            // points.material.size = 0.04;
            points.name = 'willow-tree.pcd';
            // material = points.material;
            geometry = points.geometry;
            lines = new THREE.Line(geometry, material)
            lines.name = 'lines';

            console.log(scene)
            // scene.add(lines)
            scene.add( points );


            //
            animate();
            // render();

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
    function animate() {

        requestAnimationFrame( animate );
        render();

    }
    function render() {

        renderer.render( scene, camera );

    }

</script>