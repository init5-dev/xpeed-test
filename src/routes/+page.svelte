<script>
	import {
		Input,
		Label,
		Button,
		Heading,
		Table,
		TableHead,
		TableHeadCell,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		Spinner,
		Alert
	} from 'flowbite-svelte';
	import { PlaySolid, CloseSolid, DownloadSolid, PauseSolid } from 'flowbite-svelte-icons';
	import SpeedTest from '@cloudflare/speedtest';
	import FileSaver from 'file-saver';

	import { getCurrentTime, sleep } from '$lib/utils/time';
	import { Mbps, addUnitySufix } from '$lib/utils/formatting';
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
			upload: 'N\\A'
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

	const saveFile = async () => {
		let csvContent = 'Time;Download (Mbps);Upload (Mbps)\n';

		data.forEach((item) => {
			csvContent += `"${item.started}";${item.download};${item.upload}\n`;
		});

		csvContent += `\nAVERAGE;${avg.download.toFixed(2)};${avg.upload.toFixed(2)}\n`;
		csvContent += `MEDIAN;${median.download.toFixed(2)};${median.upload.toFixed(2)}\n\n`;

		const blob = new Blob([csvContent], { type: 'text/plain;charset=utf-8' });
		FileSaver.saveAs(blob, `xpeedtest-${started.replaceAll(',', '_')}.csv`);
	};

	restart()

</script>

<div class="main">
	<br />
	<Heading tag="h1" align="center">Xpeed Test</Heading>
	<Alert color="yellow">
		<a target="_blank" href="https://github.com/init5-dev/xpeed-test"
			><p>Visit the repo on <strong>Github</strong></p></a
		>
	</Alert>
	<br />
	<div class="items-center sm:flex sm:flex-col md:flex-row">
		<div class="flex items-center gap-2 p-1 sm:my-2">
			<Label for="iterations">Iterations</Label>
			<Input
				disabled={running || waiting}
				type="number"
				bind:value={iterations}
				min={5}
				max={1000}
			/>
		</div>
		<div class="flex items-center gap-2 p-1 sm:my-2 md:ml-2">
			<Label for="interval">Pause</Label>
			<Input disabled={running || waiting} type="number" bind:value={interval} min={15} max={60} />
		</div>
		<div class="flex items-center justify-center gap-2 p-1 sm:my-2 md:ml-2">
			<Button disabled={running || waiting} on:click={run}>
				{#if running}
					<Spinner size={4} />
				{:else}
					<PlaySolid size="sm" />
				{/if}
			</Button>
			<Button on:click={stop} disabled={!running}>
				<PauseSolid size="sm" />
			</Button>
			<Button on:click={restart}>
				<CloseSolid size="sm" />
			</Button>
		</div>
	</div>
	{#if error}
		<Alert color="red" class="flex items-center gap-4">
			<span>Iterations must be between 5 and 1000, and pause between 15 and 60 s.</span>
		</Alert>
	{/if}

	{#if running && !waiting}
		<Alert color="green" class="flex items-center gap-4">
			<Spinner size={10} />
			<span>Running iteration {i}...</span>
		</Alert>
	{/if}

	{#if running && waiting}
		<Alert color="yellow" class="flex items-center gap-4">
			<Spinner size={10} />
			<span>Waiting {interval} seconds for running iteration {i + 1}...</span>
		</Alert>
	{/if}

	{#if finished}
		<Alert color="green" class="flex items-center gap-4">
			<span
				><strong>AVERAGE: </strong>{addUnitySufix(avg.download.toFixed(2))} | {addUnitySufix(
					avg.upload.toFixed(2)
				)}</span
			>
			<span
				><strong>MEDIAN: </strong>{addUnitySufix(median.download.toFixed(2))} | {addUnitySufix(
					median.upload.toFixed(2)
				)}</span
			>
		</Alert>
		<Button on:click={saveFile}><DownloadSolid /></Button>
	{/if}

	{#if showTable}
		<Table class="w-full">
			<TableHead>
				<TableHeadCell>Iteration</TableHeadCell>
				<TableHeadCell>Started at</TableHeadCell>
				<TableHeadCell>Download</TableHeadCell>
				<TableHeadCell>Upload</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each data as item, index}
					<TableBodyRow>
						<TableBodyCell>{index + 1}</TableBodyCell>
						<TableBodyCell>{item.started}</TableBodyCell>
						<TableBodyCell class={index === i - 1 && downloadColor}
							>{addUnitySufix(item.download)}</TableBodyCell
						>
						<TableBodyCell class={index === i - 1 && uploadColor}
							>{addUnitySufix(item.upload)}</TableBodyCell
						>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	{/if}
</div>

<style>
	.main {
		width: 90vw;
		margin-left: 5vw;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
</style>
