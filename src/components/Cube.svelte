<script lang='ts'>
  import * as THREE from 'three';


  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();

  renderer. setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  //
  const geo = new THREE.DodecahedronGeometry( 2)
  const mat = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const mesh = new THREE.Mesh( geo, mat );




  scene.add( mesh );
  camera.position.z = 5;
  function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
  }
  animate();
</script>
<style>
</style>