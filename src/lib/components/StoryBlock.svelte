<script lang="ts">
	import SendHorizontal from '@lucide/svelte/icons/send-horizontal';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

	async function llm_classifier(user_text: string, question_id: number) {
		const response = await fetch('/api/classify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ user_text, question_id })
		});

		if (!response.ok) throw new Error(await response.text());

		return response.json();
	}

    let props = $props()
	let input = $state('')
	let loading = $state(false);

	function resolve_input() {
		loading = true;
		llm_classifier(input, props.question.id)
			.then((result) => console.log(result))
			.finally(() => (loading = false));
	}
</script>

<p class="p-5">{props.story.text}</p>

<div class="flex items-start justify-center">
	<form class="pr-3">
		<textarea class="textarea w-xl" rows="5" placeholder={props.question.before_input} bind:value={input}></textarea>
	</form>

	{#if loading}
		<LoadingSpinner />
	{:else}
		<button type="button" class="btn preset-filled" onclick={resolve_input}>
			<SendHorizontal />
		</button>
	{/if}
</div>
