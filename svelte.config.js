import { vitePreprocess } from '@astrojs/svelte';
import { preprocessThrelte } from '@threlte/preprocess';
import sequence from 'svelte-sequential-preprocessor';
export default {
	preprocess: sequence([vitePreprocess(), preprocessThrelte({
		extensions: {
			'three/examples/jsm/controls/OrbitControls': ['OrbitControls'],
		}
	})])
};
