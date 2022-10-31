<script lang="ts">
	import { onMount } from "svelte";


	export let name: string;
	export let label: string;
	export let placeholder: string;
	export let value: string
	export let onFocus: (e: Event) => void = () => {};
	export let onChange: (e: Event) => void = () => {};
	export let error: string = '';
	export let disabled: boolean = false;
	let touched: boolean = false
	export let type: 'text' | 'number' | 'email' | 'password' = 'text';
	function typeAction(node: { type: string }) {
		node.type = type;
	}
	const errorValidateAction = (e: any) => {
		if (e.target.value != '') touched = true;
		if (touched) onChange;
	};


</script>

<div>
	<label for={name}>{label}</label>
	<input
		use:typeAction
		on:focus={onFocus}
		on:blur={errorValidateAction}
		on:change={onChange}
		on:input={touched || error ? onChange : undefined}
		bind:value={value}
		disabled={disabled}
		autocomplete="off"
		{name}
		{placeholder}
	/>
	{#if error}
		<p class="error">{error}</p>
	{/if}
</div>

<style>
	label {
		font-size: 0.85rem;
		font-weight: 400;
		opacity: 0.8;
	}
	input {
		width: 100%;
		display: flex;
		align-items: center;
		border: 2px solid transparent;
		background-color: var(--input);
		border-radius: 7px;
		outline: none;
		padding: 10px 16px;
		gap: 15px;
		transition: all 0.3s ease-in-out;
		margin-top: 10px;
		color: #ffffff;
	}
	input:hover {
		border: 2px solid var(--primary);
		transition: all 0.2s ease-in-out;
	}
	input:focus {
		border: 2px solid var(--primary);
		box-shadow: 0 0 0 3px #225dbb50;
	}
	.error {
		color: var(--error);
		font-size: 0.8rem;
		margin-top: 10px;
		font-weight: 500;
	}
</style>
