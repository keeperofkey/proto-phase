<script lang='ts'>
  import { Canvas, T } from '@threlte/core'
</script>
<div class="cube">
    <Canvas>
       <!-- <T.OrthographicCamera makeDefault position={[10 ,10, 10]} up={[0, 0, 1]} lookAt={[1 , 2, 1]} />-->

        <T.Mesh position.y={1}>
            <T.BoxGeometry args={[1, 2, 1]} />
            <T.MeshBasicMaterial color="hotpink" />
        </T.Mesh>
    </Canvas>
</div>
<style>
    .cube {
        height: 100%;
        width: 100%;
    }
</style>