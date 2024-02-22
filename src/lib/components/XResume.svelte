<script>
	import { addUnitySufix } from "$lib/utils/formatting";
	import { Alert, Button } from "flowbite-svelte";
	import { DownloadSolid } from "flowbite-svelte-icons";
  import FileSaver from 'file-saver';

  export let avg
  export let median
  export let started
  export let data

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
  
</script>

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