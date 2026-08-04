<script lang="ts">
	
	import SendHorizontal from '@lucide/svelte/icons/send-horizontal';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

    export let story
    export let question

	let loading = false;
	function load() {
		loading = true;
	}
</script>

<p class="p-5">{story.text}</p>

<div class="flex items-start justify-center">
	<form class="pr-3">
		<textarea class="textarea w-xl" rows="5" placeholder={question.before_input}></textarea>
	</form>

	{#if loading}
		<LoadingSpinner />
	{:else}
		<button type="button" class="btn preset-filled" onclick={load}>
			<SendHorizontal />
		</button>
	{/if}
</div>
