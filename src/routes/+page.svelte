<script>
	// @ts-nocheck

	import XTable from '$lib/components/XTable.svelte';
	import XResume from '$lib/components/XResume.svelte';
	import XRunningMessage from '$lib/components/XRunningMessage.svelte';
	import XWaitingMessage from '$lib/components/XWaitingMessage.svelte';
	import XErrorMessage from '$lib/components/XErrorMessage.svelte';
	import XControls from '$lib/components/XControls.svelte';
	import XHeading from '$lib/components/XHeading.svelte';

	import SpeedTest from '@cloudflare/speedtest';
	import Geolocation from "svelte-geolocation";
	import { getCurrentTime, sleep } from '$lib/utils/time';
	import { Mbps } from '$lib/utils/formatting';
	import { calcAvg, calcMedian } from '$lib/utils/stats';

	let showTable;

	let iterations;
	let interval;

	let running;
	let waiting;
	let finished;
	let error;

	let downloadColor;
	let uploadColor;

	let i;

	let started;

	let data;
	let median;
	let avg;
	let coordinates = []

	let test;

	const restart = () => {
		showTable = false;

		iterations = 10;
		interval = 15;

		running = false;
		waiting = false;
		finished = false;
		error = false;

		downloadColor = '';
		uploadColor = '';

		i = 0;

		started = getCurrentTime();

		data = [];
		median = {};
		avg = {};

		test = new SpeedTest({ autoStart: false });
	};

	const run = async () => {
		if (iterations < 5 || iterations > 1000 || interval < 15 || interval > 60) {
			error = true;
			return;
		} else {
			error = false;
		}

		if (i >= iterations) {
			i = 0;

			running = false;
			finished = true;
			waiting = false;

			avg = calcAvg();
			median = calcMedian();

			return;
		}

		if (i > 0) {
			waiting = true;
			await sleep(interval * 1000);
			waiting = false;
		} else {
			while (data.length > 0) data.pop();
			const avg = {
				download: 0,
				upload: 0
			};
		}

		showTable = true;
		finished = false;
		i++;

		console.log('Running test ' + i + '...');
		test.restart();
		running = true;

		data.push({
			started: getCurrentTime(),
			download: 'N\\A',
			upload: 'N\\A',
			coordinates: {
				latitude: coordinates[0],
				longitude: coordinates[1]
			}
		});

		test.onResultsChange = (results) => {
			const downBandwith = test.results.getDownloadBandwidth();
			const upBandwith = test.results.getUploadBandwidth();

			if (downBandwith) {
				data[data.length - 1].download = Mbps(downBandwith, false);
				if (data[data.length - 1].download !== 'N\\A') {
					downloadColor = downloadColor === 'text-red-800' ? 'text-green-800' : 'text-red-800';
				}
			}

			if (upBandwith) {
				data[data.length - 1].upload = Mbps(upBandwith, false);

				if (data[data.length - 1].upload !== 'N\\A') {
					downloadColor = '';
					uploadColor = uploadColor === 'text-red-800' ? 'text-green-800' : 'text-red-800';
				}
			}

			data[data.length - 1].coordinates = {
				latitude: coordinates[0],
				longitude: coordinates[1]
			};
		};

		test.onFinish = (results) => {
			const summary = results.getSummary();
			data[data.length - 1].download = Mbps(summary.download, false);
			console.log('FINISH DOWNLOAD:', summary.download);
			data[data.length - 1].upload = Mbps(summary.upload, false);
			console.log('FINISH DOWNLOAD:', summary.upload);
			downloadColor = '';
			uploadColor = '';
			run();
		};
	};

	const stop = () => {
		test.pause();
		running = false;
		i = 0;
		downloadColor = '';
		uploadColor = '';
		finished = true;
		waiting = false;
		avg = calcAvg(data);
		median = calcMedian(data);
		console.log('Stopped');
	};

	restart();
</script>

<Geolocation getPosition bind:coords={coordinates} />

<div class="main">
	<XHeading />
	<XControls {running} {waiting} {iterations} {interval} {run} {stop} {restart} />

	{#if error}
		<XErrorMessage />
	{/if}

	{#if running && !waiting}
		<XRunningMessage {i} />
	{/if}

	{#if running && waiting}
		<XWaitingMessage {interval} {i} />
	{/if}

	{#if finished}
		<XResume {data} {started} {avg} {median} />
	{/if}

	{#if showTable}
		<XTable {data} {i} {downloadColor} {uploadColor} />
	{/if}
</div>
