<script lang="ts">
	import type { UUID } from "crypto";
	import Like from "./Like.svelte";
	import { onMount } from "svelte";

    type CPost = {
	poster: UUID;
	posterUser: string;
	post: UUID;
	title: string;
	text: string;
	like: number;
	dislike: number;
    }

    let { post } : {post : CPost } = $props()

    let css = $state("stroke-black")

    onMount(async () => {
        let lik = await fetch("/api/v1/post/like", {
            method: "POST",
            body: JSON.stringify({
                method: "HAS",
                post: post.post,
                poster: post.poster
            })
        })
        if(!lik.ok) return
        let js = await lik.json();
        if(js.message == true) css = "stroke-blue-500"
    })

    const handleLike = async  () => {
        let lik = await fetch("/api/v1/post/like", {
            method:"POST",
            body: JSON.stringify({
                method: "ADD",
                post: post.post,
                poster: post.poster
            })
        })

        if(lik.status == 400) {
            css = "stroke-blue-500";
            return;
        }

        console.log(JSON.stringify(lik))

        post.like++;
    }

</script>

<div class="post">
    <div class="flex flex-row justify-between items-center">
        <p class="post-title">{post.title}</p>
        <p class="post-author"><span class="text-gray-600">by</span> {post.posterUser}</p>
    </div>
    <p class="post-text">{post.text}</p>
    <div class="icon-box">
            <p class="icon-text">{post.like}</p>
            <button
                id="{post.post}"
                onclick={handleLike}
            ><Like width=32 height=32 cls="hover:stroke-blue-500 {css}"/></button>
    </div>
</div>