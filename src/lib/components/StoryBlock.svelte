<script lang="ts">
	import SendHorizontal from '@lucide/svelte/icons/send-horizontal';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import questions from '$lib/text/questions.json';
	import stories from '$lib/text/story.json';

	async function llm_classifier(user_text: string, question_id: number) {
		const response = await fetch('/api/classify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ user_text, question_id })
		});

		if (!response.ok) throw new Error(await response.text());

		return response.json();
	}

	let { story_id } = $props();
	let story = stories.find((x) => x.id == story_id);
	if(story == undefined){throw Error(`Story n°${story_id} is missing !`)}
	let question = questions.find((x) => x.id == story?.question_id);
	if (question == undefined) {
		throw Error(`The question n°${story?.question_id} of the story n°${story?.id} is missing !`);
	}

	let input = $state('');
	let loading = $state(false);

	function resolve_input() {
		loading = true;
		llm_classifier(input, question?.id || 0)
			.then((result) => console.log(result))
			.then()
			.finally(() => (loading = false));
	}
</script>

<p class="p-5">{story?.text}</p>

<div class="flex items-start justify-center">
	<form class="pr-3">
		<textarea
			class="textarea w-xl"
			rows="5"
			placeholder={question.before_input}
			bind:value={input}></textarea>
	</form>

	{#if loading}
		<LoadingSpinner />
	{:else}
		<button type="button" class="btn preset-filled" onclick={resolve_input}>
			<SendHorizontal />
		</button>
	{/if}
</div>
