<script lang='ts'>
  import { Canvas, T } from '@threlte/core'
  import { Editable, Theatre } from '@threlte/theatre'
</script>
<div class="cube">
    <Canvas>
        <Theatre>
            <T.PerspectiveCamera position={[5, 10, 3]}>
                <Editable name="Camera" transform />
            </T.PerspectiveCamera>
    
            <T.Mesh position.y={0.5}>
                <Editable name="Cube" transform controls />
                <T.BoxGeometry />
                <T.MeshBasicMaterial color="hotpink" />
            </T.Mesh>
    
            <T.GridHelper />
        </Theatre> 
    </Canvas>
</div>
<style>
    .cube {
        height: 100%;
        width: 100%;
    }
</style>