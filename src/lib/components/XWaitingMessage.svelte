<script>
// @ts-nocheck

	import { Alert, Spinner } from 'flowbite-svelte';

  export let interval
  export let i
</script>

<Alert color="yellow" class="flex items-center gap-4">
	<Spinner size={10} />
	<span>Waiting {interval} seconds for running iteration {i + 1}...</span>
</Alert>
