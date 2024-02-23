<script>
	// @ts-nocheck

	import 'ol/ol.css';

	import { afterUpdate } from 'svelte';
	import { Map, View } from 'ol';
	import TileLayer from 'ol/layer/Tile';
	import OSM from 'ol/source/OSM';
	import { fromLonLat } from 'ol/proj';
	import Vector from 'ol/layer/Vector';
	import Feature from 'ol/Feature';
	import Point from 'ol/geom/Point';
	import { MapLocationOutline } from 'flowbite-svelte-icons';

	export let latitude = 0;
	export let longitude = 0;

	let map;

	afterUpdate(() => {
		document.getElementById('map').innerHTML = '';

		const layer = new TileLayer({
			source: new OSM()
		});

		map = new Map({
			target: 'map',
			layers: [
				new TileLayer({
					source: new OSM()
				})
			],
			view: new View({
				center: fromLonLat([latitude, longitude]),
				zoom: 20
			}),
			controls: [],
			interactions: [],
			overlays: []
		});
	});
</script>

<div id="map" class="ol- z-0 h-full w-full"></div>
