<svelte:window />

<script lang="ts">
	import { afterUpdate, onMount, onDestroy } from 'svelte';
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import { browser } from '$app/environment';

	let map;
	function createMap(container) {
    map = L.map(container, {
		center: L.latLng(-82.487037, 23.0889425),
		zoom: 20
	});

	const key = 'rphE314qsffDNiNaeQTO';

	L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`, {
		//style URL
		tileSize: 512,
		zoomOffset: -1,
		minZoom: 1,
		attribution:
			'\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
		crossOrigin: true
	}).addTo(map);
  }
</script>



<style>
	body {
		margin: 0;
		padding: 0;
	}

	#map {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
	}
</style>

<div class="map" style="height:100%;width:100%" use:createMap />
