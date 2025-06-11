<script lang="ts">
	import { enhance } from '$app/forms';
	import ErrorBox from "$lib/module/ErrorBox.svelte";

	export let form: any;

	let username = "";
	let password = "";

	$: userInputC = form?.userMessageC || "";
	$: userMessage = form?.userMessage || "";

	$: passInputC = form?.passMessageC || "";
	$: passMessage = form?.passMessage || "";

	let error: string[] = [];

	$: if (form?.userMessage && !error.includes(form.userMessage)) error.push(form.userMessage);
	$: if (form?.passMessage && !error.includes(form.passMessage)) error.push(form.passMessage);
</script>

{#each error as e (e)}
	<ErrorBox message={e} duration={5000} on:close={() => error = error.filter(err => err !== e)} />
{/each}

<div class="bg-gray-100 flex items-center justify-center min-h-screen flex-col">
	<img alt="Twatter Logo" src="/twatter-logo_2.svg" class="pb-10 w-md" />
	<div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
		<h2 class="text-2xl font-bold text-gray-800 text-center mb-6">Login</h2>

		<form method="POST" use:enhance id="register">
			<div>
				<label for="username">
					Username<br />
					<span class={userInputC}>{userMessage}</span>
				</label>
				<input
					type="text"
					id="username"
					name="username"
					bind:value={username}
					placeholder="Bedlessdeus"
					minlength="3"
					maxlength="12"
					class={userInputC}
				/>
			</div>

			<div>
				<label for="password">
					Password<br />
					<span class={passInputC}>{passMessage}</span>
				</label>
				<input
					type="password"
					id="password"
					name="password"
					bind:value={password}
					placeholder="********"
					class={passInputC}
				/>
			</div>

			<div>
				<button type="submit">
					Login
				</button>
			</div>
		</form>

		<p class="text-center">
			Don't have an account?
			<a href="/register" class="text-blue-600 hover:underline">Register here</a>.
		</p>
	</div>
</div>
