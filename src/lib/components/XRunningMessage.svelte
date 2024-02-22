<script>
	import { Alert, Spinner } from 'flowbite-svelte';

  export let i
</script>

<Alert color="green" class="flex items-center gap-4">
	<Spinner size={10} />
	<span>Running iteration {i}...</span>
</Alert>
