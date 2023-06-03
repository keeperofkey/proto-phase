<script lang=ts type="module">
  import * as THREE from 'three';
  import glslCurlNoise from 'glsl-curl-noise/curl.glsl';
  import glslNoise from 'glsl-noise/simplex/3d.glsl';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js';
  import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
  import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';

  let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
  let points: THREE.Points, material: THREE.ShaderMaterial;

  init();
  animate();

  function init() {
    // Create the renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Add the renderer to the DOM
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.zIndex = '-1';
    container.style.width = '100%';
    container.style.overflow = 'auto';
    document.body.appendChild(container);
    container.appendChild(renderer.domElement);

    // Create the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf5f5f5f5);

    // Create the camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Load the PCD point cloud
    const loader = new PCDLoader();
    loader.load('models/willow-tree.pcd', (points) => {
      // Create a custom shader material that combines the vertex colors with the curl noise animation
      material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 1.1 },
          amplitude: { value: 0.02 },
          frequency: { value: 10 },
        },
        vertexShader: `
          uniform float time;
          uniform float amplitude;
          uniform float frequency;
          varying vec3 vPosition;
          varying vec3 vColor;
          attribute vec3 color;
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

      // Create a Points object with the geometry and material
      points.material = material;
      scene.add(points);
    animate();
    });

    // Add a GUI to control the animation parameters
    const gui = new GUI();
    gui.add(material.uniforms.amplitude, 'value', 0, 2).name('Amplitude');
    gui.add(material.uniforms.frequency, 'value', 0, 5).name('Frequency');
  }

  function animate() {
    requestAnimationFrame(animate);
    const time = performance.now() * 0.001;
    material.uniforms.time.value = time;
    renderer.render(scene, camera);
  }
</script>