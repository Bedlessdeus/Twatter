<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

{@render children()}

<footer class="text-black py-4 mt-8">
	<div class="container mx-auto text-center">
		<div class="mt-2 space-x-4">
			<a href="/impressum" class="text-blue-600 hover:underline">Impressum</a>
			<a href="/agb" class="text-blue-600 hover:underline">AGB</a>
			<a href="/datenschutz" class="text-blue-600 hover:underline">Datenschutz</a>
		</div>
		<p>&copy; 2025 Bedless Developments. All rights reserved.</p>
	</div>
</footer>