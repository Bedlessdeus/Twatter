<script lang="ts">
	import { DAT } from "$lib/client/message";
	import bcrypt from 'bcryptjs';
	import ErrorBox from "$lib/module/ErrorBox.svelte";
	import { goto } from '$app/navigation';

	let username = $state('');
	let password = $state('');

	let userInputC = $state("");
	let userMessageC = $state("");
	let userMessage = $state("");

	let passInputC = $state("");
	let passMessageC = $state("");
	let passMessage = $state("");

	let validPass = $state(false);

	let error = $state<string[]>([]);

	const handleLogin = async () => {
		if(!validPass || userMessageC === "error") return;
		const hashedPassword = await bcrypt.hash(username + password, 10);
		let fe = await fetch(`/api/v1/user/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, hash: hashedPassword })
		});
		let bod = await fe.json()
		if(!fe.ok) {
			userMessage = bod.message;
			if(error.includes(bod.message)) delete error[error.indexOf(bod.message)];
			error.push(bod.message);
			username = "";
			password = "";

			userMessageC = "";
			userInputC = "";
			userMessage = "";

			passMessageC = "";
			passInputC = "";
			passMessage = "";
			
			validPass = false;
		} else {
			console.log(bod);
			document.cookie = `userHash=${bod.token}; path=/; max-age=${60 * 60 * 24 * 7}`;
			document.cookie = `userId=${bod.userID}; path=/; max-age=${60 * 60 * 24 * 7}`;
			goto('/');
		}
	};

	const handlePassword = () => {
		if(password.length < 8 || password.length > 32) 
		return setPassMessage("Invalid Password", false);

		return setPassMessage("", true);
	};

	const setPassMessage = (msg: string, valid: boolean) => {
		passMessage = msg;
		passMessageC = passInputC = valid ? "success" : "error";
		validPass = valid;
	};
</script>

{#each error as e (e)}
	<ErrorBox message={e} duration={5000} on:close={() => error = error.filter(err => err !== e)} />
{/each}

<div class="bg-gray-100 flex items-center justify-center min-h-screen">
	<div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
		<h2 class="text-2xl font-bold text-gray-800 text-center mb-6">Login</h2>

		<form id="register">
			<div>
				<label for="username">Username<br><span class={userMessageC}>{userMessage}</span></label>
				<input
					type="text"
					id="Username"
					bind:value={username}
					placeholder="Bedlessdeus"
					min="3"
					max="12"
					class={userInputC}
				/>
			</div>

			<div>
				<label for="password">Password<br><span class={passMessageC}>{passMessage}</span></label>
				<input
					type="password"
					id="password"
					bind:value={password}
					placeholder="********"
					class={passInputC}
					oninput={handlePassword}
				/>
			</div>

			<div>
				<button
					type="submit"
					onclick={handleLogin}
					disabled={!validPass || userMessageC === "error"}
				>
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
