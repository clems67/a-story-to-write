<script lang="ts">
	import questions from '$lib/text/questions.json';
	import story from '$lib/text/story.json';
	import StoryBlock from '$lib/components/StoryBlock.svelte';

	let theStory = story.find((x) => x.id == 0);
	let theQuestion = questions.find((x) => x.id == theStory?.question_id);
</script>

<StoryBlock story={theStory} question={theQuestion} />
