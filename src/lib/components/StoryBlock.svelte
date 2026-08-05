<script lang="ts">
	import SendHorizontal from '@lucide/svelte/icons/send-horizontal';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import questions from '$lib/text/questions.json';
	import stories from '$lib/text/story.json';
	import { Toast, createToaster } from '@skeletonlabs/skeleton-svelte';
	const toaster = createToaster();

	let input = $state('');
	let loading = $state(false);
	let chapterClosed = $state(false);
	let endChapterText = $state('');
	let { story_id, onNewStoryId } = $props();

	let story = stories.find((x) => x.id == story_id);
	if (story == undefined) {
		throw Error(`Story n°${story_id} is missing !`);
	}
	let question = questions.find((x) => x.id == story?.question_id);
	if (question == undefined) {
		throw Error(`The question n°${story?.question_id} of the story n°${story?.id} is missing !`);
	}

	function resolve_input() {
		if(story_id == 2){
			toaster.success({description: "Merci beaucoup d'avoir testé notre projet !!! La suite de l'histoire est en cours d'écriture."})
			throw Error()
		}
		loading = true;
		llm_classifier(input, question?.id || 0)
			.then((result) => resolveStoryId(result))
			.finally(() => (loading = false));
	}

	async function llm_classifier(user_text: string, question_id: number) {
		const response = await fetch('/api/classify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ user_text, question_id })
		});

		if (!response.ok) throw new Error(await response.text());

		return response.json().then((x) => +x.content);
	}

	function resolveStoryId(optionId: number) {
		if (optionId != 0) {
			optionId -= 1; //necessary because option 0 is None
			const optionChoosed = question?.options[optionId];
			if (optionChoosed == undefined) {
				throw Error(`Question n°${question?.id} is missing option°${optionId}`);
			}
			const storyId = optionChoosed.story_id;
			endChapterText = optionChoosed.result + " " + question?.after_input;
			chapterClosed = true
			onNewStoryId(storyId);
		}else{
			toaster.info({
				description: 'Vous avez une imagination DÉ-BOR-DANTE\nMalheureusement, cette action est impossible, essayez autre chose !'
			})
		}
	}
</script>

<p class="p-5">{story?.text}</p>

{#if !chapterClosed}
	<div class="flex flex-col items-center gap-2 sm:flex-row sm:items-start sm:justify-center">
		<form class="w-full sm:w-auto sm:pr-3">
			<textarea
				class="textarea w-full sm:w-xl"
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
{:else}
	<p class="p-5">{endChapterText}</p>
{/if}

<Toast.Group {toaster}>
	{#snippet children(toast)}
		<Toast {toast}>
			<Toast.Message>
				<Toast.Title>{toast.title}</Toast.Title>
				<Toast.Description>{toast.description}</Toast.Description>
			</Toast.Message>
			<Toast.CloseTrigger />
		</Toast>
	{/snippet}
</Toast.Group>