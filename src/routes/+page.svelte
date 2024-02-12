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
	import { PlaySolid, CloseSolid, DownloadSolid } from 'flowbite-svelte-icons';
	import SpeedTest from '@cloudflare/speedtest';
	import FileSaver from 'file-saver';

	const now = () => {
		return new Date().toLocaleDateString('en-us', {
			weekday: 'long',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		});
	};

	let showTable = false;

	let iterations = 10;
	let interval = 15;

	let running = false;
	let waiting = false;
	let finished = false;
	let error = false;

	let downloadColor = '';
	let uploadColor = '';

	let i = 0;

	const started = now();

	const data = [];

	const avg = {
		download: 0,
		upload: 0
	};

	const test = new SpeedTest({ autoStart: false });

	const Mbps = (bps, sufix = true) => {
		if (isNaN(bps)) {
			return 'N\\A';
		}
		return (bps / 1024 / 1024).toFixed(2) + (sufix ? ' Mbps' : '');
	};

	const format = (Mbps) => {
		if (Mbps === 'N\\A') return Mbps;

		return Mbps + ' Mbps';
	};

	function getFormattedDateTime(format = 'YYYY-MM-DD HH:mm:ss') {
		const now = new Date();
		const options = {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			hour12: false,
			timeZone: 'UTC'
		};

		// Intl.DateTimeFormat can be used for more complex formatting
		const formattedDateTime = new Intl.DateTimeFormat('en-US', options).format(now);

		// Replace placeholders in the format string
		return format
			.replace(/YYYY/g, formattedDateTime.getFullYear())
			.replace(/MM/g, formattedDateTime.getMonth() + 1)
			.replace(/DD/g, formattedDateTime.getDate())
			.replace(/HH/g, formattedDateTime.getHours())
			.replace(/mm/g, formattedDateTime.getMinutes())
			.replace(/ss/g, formattedDateTime.getSeconds());
	}

	const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

	const calcAvg = () => {
		console.log(JSON.stringify(data, null, 2));

		data.forEach((item) => {
			if (!isNaN(item.download)) avg.download += Number(item.download);
			if (!isNaN(item.upload)) avg.upload += Number(item.upload);
		});

		avg.download = avg.download / data.length;
		avg.upload = avg.upload / data.length;

		console.log('AVG:', avg);
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

			calcAvg();

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
			started: now(),
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
		calcAvg();
		console.log('Stopped');
	};

	const saveFile = async () => {
		let csvContent = 'Time;Download (Mbps);Upload (Mbps)\n';

		data.forEach((item) => {
			csvContent += `"${item.started}";${item.download};${item.upload}\n`;
		});

		csvContent += `\nAVERAGE;${avg.download.toFixed(2)};${avg.upload.toFixed(2)}\n\n`;

		const blob = new Blob([csvContent], { type: 'text/plain;charset=utf-8' });
		FileSaver.saveAs(blob, `xpeedtest-${started.replaceAll(',', '_')}.csv`);
	};
</script>

<div class="main">
	<Heading tag="h1" align="center">Xpeed Test</Heading>
	<br />
	<div class="params-group">
		<div class="param">
			<Label for="iterations">Iterations</Label>
			<Input
				disabled={running || waiting}
				class="input"
				type="number"
				bind:value={iterations}
				min={5}
				max={1000}
			/>
		</div>
		<div class="param">
			<Label for="interval">Pause</Label>
			<Input disabled={running || waiting} type="number" bind:value={interval} min={15} max={60} />
		</div>
		<div class="param">
			<Button disabled={running || waiting} on:click={run}>
				{#if running}
					<Spinner size={4} />
				{:else}
					<PlaySolid size="sm" />
				{/if}
			</Button>
			<Button on:click={stop} disabled={!running}>
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
				><strong>AVERAGE: </strong>{format(avg.download.toFixed(2))} | {format(
					avg.upload.toFixed(2)
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
							>{format(item.download)}</TableBodyCell
						>
						<TableBodyCell class={index === i - 1 && uploadColor}
							>{format(item.upload)}</TableBodyCell
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

	.params-group {
		display: flex;
		flex-direction: row;
		gap: 2rem;
	}

	.param {
		display: flex;
		flex-direction: row;
		gap: 6px;
		align-items: center;
		margin: 4px;
	}
</style>
