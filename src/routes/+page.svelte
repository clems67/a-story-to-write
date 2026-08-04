<script lang="ts">
	import story from '$lib/text/story.json';
	import questions from '$lib/text/questions.json';
	import SendHorizontal from '@lucide/svelte/icons/send-horizontal';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

	let loading = false;
	function load() {
		loading = true;
	}
</script>

<p class="p-5">{story[0].text}</p>

<div class="flex items-start justify-center">
	<form class="pr-3">
		<textarea class="textarea w-xl" rows="5" placeholder={questions[0].before_input}></textarea>
	</form>

	{#if !loading}
		<button type="button" class="btn preset-filled" onclick={load}>
			<SendHorizontal />
		</button>
	{/if}

	{#if loading}
		<LoadingSpinner />
	{/if}
</div>
