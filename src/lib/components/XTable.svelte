<script>
// @ts-nocheck

  import { Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell } from "flowbite-svelte";
  import { addUnitySufix } from "$lib/utils/formatting";
  
  export let data;
  export let i
  export let downloadColor
  export let uploadColor
</script>

<Table class="w-full">
	<TableHead>
		<TableHeadCell>Iteration</TableHeadCell>
		<TableHeadCell>Started at</TableHeadCell>
		<TableHeadCell>Download</TableHeadCell>
		<TableHeadCell>Upload</TableHeadCell>
		<TableHeadCell>Location</TableHeadCell>
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
				<TableBodyCell
					>{`${item.coordinates.latitude}, ${item.coordinates.longitude}`}</TableBodyCell
				>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
