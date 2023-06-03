<script lang=ts type="module">
    import * as THREE from 'three';
    import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

    let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
    let lines, geometry, material: THREE.PointsMaterial;
    init();
    animate();
    function init() {
        const container = document.createElement('div');
        document.body.appendChild(container);
        camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 5, 3500);
        camera.position.z = 2750;
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x050505);
        scene.fog = new THREE.Fog(0x050505, 2000, 3500);
        const loader = new PLYLoader();
        loader.load('models/wires.ply', function (geometry) {
            geometry.computeVertexNormals();
            material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, opacity: 0.75 });
            lines = new THREE.Points(geometry, material);
            scene.add(lines);
        });
    }

</script>