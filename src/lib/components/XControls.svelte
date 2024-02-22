<script>
	import { Label, Button, Spinner, Input } from "flowbite-svelte";
	import { PlaySolid, PauseSolid, CloseSolid } from "flowbite-svelte-icons";

  export let running
  export let waiting
  export let iterations
  export let interval
  export let run
  export let stop
  export let restart

</script>
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