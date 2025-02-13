<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	console.log(data)

	let postMSG = $state("")
	let postTitle = $state("")

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

		console.log(f);
	});

</script>

<div class="bg-gray-100 flex items-center justify-center min-h-screen flex-col">
	<div class="post-container">
		{#each data.posts as post}
			<div class="post">
				<div class="flex flex-row">
					<p class="post-author">{post.posterUser}</p>
				</div>
				<p class="post-title">{post.title}</p>
				<p class="post-text">{post.text}</p>
				<div class="icon-box">
					<div class="icon-value">
						<p class="icon-text">{post.like}</p>
						<button><img src="/like.svg" alt="Nothin" class="icon" /></button>
					</div>
				</div>
			</div>
		{/each}
	</div>
	<div>
		<form id="post" class="flex flex-row">
			<input 
			type="text"
			class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
			bind:value={postTitle}
			placeholder="Epic Title Here!!"
			>
			<input 
			type="text"
			class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
			bind:value={postMSG}
			placeholder="Your Epic post here!"
			>
			<button
			type="submit"
			class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
			onclick={handlePost}
			>Post
			</button>
		</form>
	</div>
</div>

<style>
	* {
		user-select: none;
	}
</style>
