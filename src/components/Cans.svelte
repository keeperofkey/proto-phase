<script lang="ts">
import { Canvas, AmbientLight, OrbitControls, PerspectiveCamera } from '@threlte/core';
import { Environment, GLTF } from '@threlte/extras';
</script>
<div class="Joya">
	<Canvas>
		<Environment path="/hdr/" files="music_hall_01_1k.hdr" isBackground={false}/>

		<PerspectiveCamera position={{x: 5, y: 2, z:5 }} fov={50}>
			<OrbitControls autoRotate enableDamping enableZoom={false} />
		</PerspectiveCamera>

		<GLTF url="/models/b_cam.glb" />
	</Canvas>
</div>
<style>
	.Joya {
		position: fixed;
		justify-self: center;
		top: 5;
		height: 100%;
		width: 100%;
	}
</style>
