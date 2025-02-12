<script lang="ts">
	import { U01, U02, U03, U04 } from "$lib/client/message";

	let username = '';
	let password = '';
	let confirmPassword = '';
	const HANDLESUBMIT = () => {};

	const isTaken = async (): Promise<string> => {
		let fe = await fetch(`/api/v1/user/check?USERNAME=${encodeURIComponent(username)}`);
		let msg = (await fe.json()).message;
		return msg;
	};

	let userInputC = "";
	let userMessageC = "";
	let userMessage = "";

	let passInputC = "";
	let passMessageC = "";
	let passMessage = "";

	const verifyUserName = async () => {
		if (username.length < 3) {
			userMessageC = userInputC = "error";
			userMessage = "Username must be at least 3 characters long";
			return;
		}

		if (username.length > 12) {
			userMessageC = userInputC = "error";
			userMessage = "Username must be less than 12 characters long";
			return;
		}

		let msg : string = await isTaken();

		if(msg === "U03") {
			userMessageC = userInputC = "error";
			userMessage = U03;
			return;
		}

		if(msg === "U04") {
			userMessageC = userInputC = "error";
			userMessage = U04;
			return;
		}

		if(msg === "U02") {
			userMessageC = userInputC = "error";
			userMessage = U02;
			return;
		}

		if(msg === "U01") {
			userMessageC = userInputC = "success";
			userMessage = U01;
			return;
		}
	};

	const handlePassword = () => {
		if(password.length < 8) {
			passInputC = passMessageC = "error";
			passMessage = "Password must be at least 8 characters long";
			return;
		}

		if(password.length > 32) {
			passInputC = passMessageC = "error";
			passMessage = "Password must be less than 32 characters long";
			return;
		}

		if (password != confirmPassword) {
			passInputC = passMessageC = "error";
			passMessage = "Passwords do not match";
			return;
		}
	};
</script>

<div class="bg-gray-100 flex items-center justify-center min-h-screen">
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
				<label for="confirm-password">Confirm Password<br><span class={passMessageC}>{passMessage}</span></label>
				<input
					type="password"
					id="confirm-password"
					bind:value={confirmPassword}
					placeholder="********"
					class={passInputC}
					oninput={handlePassword}
				/>
			</div>

			<div>
				<button
					type="submit"
					onclick={HANDLESUBMIT}
					class=""
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
