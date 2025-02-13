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

	const handleRegister = async () => {
		if(!validPass || userMessageC === "error") return;
		const hashedPassword = await bcrypt.hash(username + password, 10);
		let fe = await fetch(`/api/v1/user/register`, {
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
			document.cookie = `token=${bod.hash}; path=/; max-age=${60 * 60 * 24 * 7}`;
			document.cookie = `userID=${bod.userID}; path=/; max-age=${60 * 60 * 24 * 7}`;
			goto('/');
		}
	};

	const validateUser = async (): Promise<keyof typeof DAT> => {
		let fe = await fetch(`/api/v1/user/check?username=${encodeURIComponent(username)}`);
		let msg = (await fe.json()).message;
		return msg as keyof typeof DAT;
	};

	const verifyUserName = async () => {
		let msg : keyof typeof DAT = await validateUser();

		userMessage = msg in DAT ? DAT[msg] : "Unknown error";

		if(msg === "U01") return userMessageC = userInputC = "success";

		userMessageC = userInputC = "error";
	};

	const handlePassword = () => {
		if(password.length < 8) 
		return setPassMessage("Password must be at least 8 characters long", false);

		if(password.length > 32) 
		return setPassMessage("Password must be less than 32 characters long", false);

		return setPassMessage("Password is valid", true);
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

<div class="bg-gray-100 flex items-center justify-center min-h-screen flex-col">
	<img alt="Twatter Logo" src="/twatter-logo_2.svg" width=20% class="pb-10">
	<div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
		<h2 class="text-2xl font-bold text-gray-800 text-center mb-6">Create an Account</h2>

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
					oninput={verifyUserName}
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
					onclick={handleRegister}
					disabled={!validPass || userMessageC === "error"}
				>
					Register
				</button>
			</div>
		</form>
		<p class="text-center">
			Already have an account?
			<a href="/login" class="text-blue-600 hover:underline">Login here</a>.
		</p>
	</div>
</div>
