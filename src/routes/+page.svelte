<script lang="ts">
	import { nonpassive } from 'svelte/legacy';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const like = () => {
		console.log('Nothin');
		return null;
	};
</script>

<div class="post-container">
	{#each data.POSTS as post}
		<div class="post">
			<p class="post-title">{post.title}</p>
			<p class="post-text">{post.text}</p>
			<div class="icon-box">
				<div class="icon-value">
					<p class="icon-text">{post.LIKE}</p>
					<button onclick={like}><img src="/like.svg" alt="Nothin" class="icon" /></button>
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	* {
		user-select: none;
	}
</style>
