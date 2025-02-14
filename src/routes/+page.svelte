<script lang="ts">
	import type { PageProps } from './$types';
	import Post from '$lib/client/component/Post.svelte';
	import type { CPost } from './proxy+page.server.js';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	let { data }: PageProps = $props();

	let posts : CPost[]= $state(data.posts)

	let postMSG = $state("")
	let postTitle = $state("")

	let loaded = $state(10);

	const handlePost = $derived(async () => {
		let f = await fetch("/api/v1/post",
			{
				method: "POST",
				body: JSON.stringify({
					title: postTitle,
					message: postMSG
				})
			}
		)

		await invalidateAll();
	});

	const loadItems = async (limit : number, offset : number) => {
		let f = await fetch(`/api/v1/post/top?limit=${limit}&offset=${offset}`, {
			method: 'GET'
		});

		let bod = await f.json();

		if(!f.ok || bod.posts.length == 0) return {posts: [] };


		let cposts : CPost[] = bod.posts as CPost[]
		posts.push(...cposts)
		loaded += 10;
	}

	onMount(() => {
		document.onscrollend = (event) => {
			loadItems(10, loaded)
		}
	})

</script>

<div class="bg-gray-100 flex items-center justify-center min-h-screen flex-col hover:stroke-blue">
	<div class="w-full items-center content-center fixed top-0 bg-white">
		<img class="h-20" src="/twatter-logo_2.svg" alt="logo">
	</div>
	<div class="post-container pt-20 pb-12.5">
		{#each posts as post}
			<Post post={post} />
		{/each}
	</div>
	<form id="post" class="flex flex-row bg-white w-full p-">
		<input 
		type="text"
		class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
		bind:value={postTitle}
		placeholder="Epic Title Here!!"
		maxlength="32"
		>
		<input 
		type="text"
		class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
		bind:value={postMSG}
		placeholder="Your Epic post here!"
		maxlength="128"
		>
		<button
		type="submit"
		class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-4 bottom-0 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
		onclick={handlePost}
		>Post
		</button>
	</form>
</div>

<style>
	* {
		user-select: none;
	}
</style>
