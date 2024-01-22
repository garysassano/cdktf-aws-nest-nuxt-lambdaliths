<script>
	import { enhance } from '$app/forms';

	let { data } = $props();
</script>

<div class="container">
	<h1>Click Counter</h1>
	<div class="counter">
		<span class="count">{data.clicks}</span>
		<span class="label">clicks</span>
	</div>
	<form method="POST" action="?%2Fincrement" use:enhance>
		<button type="submit">Add Your Click!</button>
	</form>
</div>

<style>
	.container {
		background: white;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		padding: 2rem;
		text-align: center;
		max-width: 400px;
		width: 100%;
		margin: 20px auto;
	}
	h1 {
		color: #333;
		margin-bottom: 1.5rem;
	}
	.counter {
		margin-bottom: 1.5rem;
	}
	.count {
		font-size: 4rem;
		font-weight: bold;
		color: #ff8c00;
	}
	.label {
		display: block;
		font-size: 1.2rem;
		color: #666;
		margin-top: 0.5rem;
	}
	button {
		background-color: #ffa500;
		color: white;
		border: none;
		padding: 0.8rem 1.5rem;
		font-size: 1rem;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}
	button:hover {
		background-color: #ff8c00;
	}
</style>
