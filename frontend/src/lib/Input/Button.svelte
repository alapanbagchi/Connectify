<script>
	import Spinner from "$lib/Spinner/Spinner.svelte";
    export let onClick = () => {}
	export let disabled = false
</script>

<button on:click={onClick}>
	{#if disabled}
	<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	width="20px" height="20px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
 		<path fill="#225DBB" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
		<animateTransform attributeType="xml"
			attributeName="transform"
			type="rotate"
			from="0 25 25"
			to="360 25 25"
			dur="0.6s"
			repeatCount="indefinite"/>
   		</path>
 	</svg>
	{:else}
		<slot />
	{/if}
</button>

<style>
    button {
		color: #ffffff;
		border: none;
		font-size: 0.8rem;
		width: 100%;
		padding: 12px 30px;
		display: flex;
		background-color: var(--button);
		justify-content: center;
		align-items: center;
		border-radius: 7px;
		cursor: pointer;
		transition: all 0.3s ease-in-out;
		font-weight: 500;
	}
	button:hover {
		background-color: var(--primary) !important;
        color: #000000 !important;
		transition: all 0.3s ease-in-out;
	}
	button:active {
		transform: scale(0.95);
		transition: all 0.3s ease-in-out;
	}
	button:disabled {
		background-color: #e0e0e0;
		color: #9e9e9e;
		cursor: not-allowed;
	}
</style>

