<script lang="ts">
	import StoryBlock from '$lib/components/StoryBlock.svelte';

	let components = [{ id: crypto.randomUUID(), storyId: 0 }];

	function addComponent(id: number) {
		components = [...components, { id: crypto.randomUUID(), storyId: id }];
	}
</script>

{#each components as component (component.id)}
	<StoryBlock story_id={component.storyId} onNewStoryId={addComponent} />
{/each}
