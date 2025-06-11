<script lang="ts">
	import { enhance } from '$app/forms';
	import ErrorBox from '$lib/module/ErrorBox.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	let username = $state(''),
		password = $state('');

	let userInputC = $state(''),
		userMessageC = $state(''),
		userMessage = $state('');

	let passInputC = $state(''),
		passMessageC = $state(''),
		passMessage = $state('');

	let validPass = $state(false);

	let error: string[] = $state([]);

	$effect(() => {
		if (form?.error) {
			error = [form.error];
		}
	});

	const handlePassword = () => {
		if (password.length < 8)
			return setPassMessage('Password must be at least 8 characters long', false);
		if (password.length > 32)
			return setPassMessage('Password must be less than 32 characters long', false);
		return setPassMessage('Password is valid', true);
	};

	const testUser = async () => {
		if (username.length < 3) {
			userMessage = 'Username must be at least 3 characters long';
			userInputC = userMessageC = 'error';
			return;
		}
		if (username.length > 12) {
			userMessage = 'Username must be less than 12 characters long';
			userInputC = userMessageC = 'error';
			return;
		}
		if (!/^[a-zA-Z0-9_]+$/.test(username)) {
			userMessage = 'Username can only contain letters, numbers, and underscores';
			userInputC = userMessageC = 'error';
			return;
		}

		let req = await (await fetch(`/api/v1/user/check?username=${username}`)).json();
		if(req['valid'] === false) {
			userMessage = req['message'] || 'Username is already taken';
			userInputC = userMessageC = 'error';
			return;
		}
		if (req['valid'] === undefined) {
			userMessage = 'An error occurred while checking the username';
			userInputC = userMessageC = 'error';
			return;
		}
		if (req['valid'] === true) {
			if (req['message']) userMessage = req['message'];
			else userMessage = 'Username is valid';
		} else {
			userMessage = 'An error occurred while checking the username';
		}
		userMessage = 'Username is valid';
		userInputC = userMessageC  = 'success';
	}

	const setPassMessage = (msg: string, valid: boolean) => {
		passMessage = msg;
		passMessageC = passInputC = valid ? 'success' : 'error';
		validPass = valid;
	};
</script>

{#each error as e (e)}
	<ErrorBox
		message={e}
		duration={5000}
		on:close={() => (error = error.filter((err) => err !== e))}
	/>
{/each}

<div class="bg-gray-100 flex items-center justify-center min-h-screen flex-col">
	<img alt="Twatter Logo" src="/twatter-logo_2.svg" width="20%" class="pb-10" />
	<div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
		<h2 class="text-2xl font-bold text-gray-800 text-center mb-6">Create an Account</h2>

		<form method="POST" use:enhance id="register">
			<div>
				<label for="username">Username<br /><span class={userMessageC}>{userMessage}</span></label>
				<input
					type="text"
					id="username"
					name="username"
					bind:value={username}
					placeholder="Bedlessdeus"
					minlength="3"
					maxlength="12"
					class={userInputC}
					oninput={testUser}
				/>
			</div>

			<div>
				<label for="password">Password<br /><span class={passMessageC}>{passMessage}</span></label>
				<input
					type="password"
					id="password"
					name="password"
					bind:value={password}
					placeholder="********"
					class={passInputC}
					oninput={handlePassword}
				/>
			</div>

			<div>
				<button type="submit" disabled={!validPass || userMessageC === 'error'}> Register </button>
			</div>
		</form>

		<p class="text-center">
			Already have an account?
			<a href="/login" class="text-blue-600 hover:underline">Login here</a>.
		</p>
	</div>
</div>
