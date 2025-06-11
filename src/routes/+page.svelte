<script lang="ts">
	import type { PageProps } from './$types';
	import Post from '$lib/client/component/Post.svelte';
	import type { CPost } from './proxy+page.server.js';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	let { data }: PageProps = $props();
	let posts: CPost[] = $state(data.posts);

	let postTitle = $state('');
	let postMSG = $state('');
	let loaded = $state(10);

	const loadItems = async (limit: number, offset: number) => {
		let f = await fetch(`/api/v1/post/top?limit=${limit}&offset=${offset}`, {
			method: 'GET'
		});
		let bod = await f.json();
		if (!f.ok || bod.posts.length === 0) return;

		let cposts: CPost[] = bod.posts;
		posts.push(...cposts);
		loaded += 10;
	};

	onMount(() => {
		document.onscrollend = () => loadItems(10, loaded);
	});
</script>

<div class="bg-gray-100 flex items-center justify-center min-h-screen flex-col">
	<div class="w-full items-center content-center fixed top-0 bg-white">
		<img class="h-20" src="/twatter-logo_2.svg" alt="logo" />
	</div>

	<div class="post-container pt-20 pb-12.5 w-[80%] max-w-[80%]">
		{#each posts as post}
			<Post {post} />
		{/each}
	</div>

	<form method="POST" use:enhance class="sticky bottom-0 bg-white w-full">
		<div class="flex flex-row">
			<input
				name="title"
				type="text"
				class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
				bind:value={postTitle}
				placeholder="Epic Title Here!!"
				maxlength="32"
				required
			/>

			<input
				name="message"
				type="text"
				class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
				bind:value={postMSG}
				placeholder="Your Epic post here!"
				maxlength="128"
				required
			/>

			<button
				type="submit"
				class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-4 bottom-0 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
			>
				Post
			</button>
		</div>
	</form>
</div>

<style>
	* {
		user-select: none;
	}
</style>
