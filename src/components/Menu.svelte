<script lang='ts'>
import { Canvas, T, } from "@threlte/core";
</script>
<div class="cube">
    <Canvas>
        <T.AmbientLight />
        <T.Mesh >
            <T.BoxGeometry />
            <T.MeshStandardMaterial color="red" />
            
        </T.Mesh>
    </Canvas>
</div>
<style>
    .cube {
        height: 100%;
        width: 100%;
    }
</style>