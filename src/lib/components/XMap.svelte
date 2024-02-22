<script>
	import { Map } from 'maplibre-gl';

	let container

	if(container) {
    let map = new Map({
		container,
		center: [-122.420679, 37.772537],
		zoom: 13,
		style: '',
		hash: true,
		transformRequest: (url, resourceType) => {
			if (resourceType === 'Source' && url.startsWith('http://localhost:51')) {
				return {
					url: url.replace('http', 'https'),
					headers: { 'my-custom-header': true },
					credentials: 'include' // Include cookies for cross-origin requests
				};
			}
		}
	});
  }
</script>

<div bind:this={container}></div>
