<script lang="ts">
	import { onMount } from 'svelte';
	export let name: string;
	export let type: 'text' | 'number' | 'email' | 'password' = 'text';
	export let placeholder: string;
	export let error: any;
	export let value: string;
	export let change: (event: Event) => void;
	let touched: boolean = false;
	function typeAction(node: { type: string }) {
		node.type = type;
	}
	let otpInput: NodeListOf<HTMLInputElement>;
	onMount(() => {
		otpInput = document.querySelectorAll('input');
	});
	$: console.log(otpInput);
	const errorValidateAction = (e: any) => {
		if (e.target.value != '') touched = true;
		if (touched) change;
	};
	const handleInput = (e: any, field: any) => {
		e.target.select();
		if (e.target.value !== '') {
			otpInput[field] = e.target.value.split('')[e.target.value.length - 1];
			otpInput.forEach((item: any, i: any) => {
				if (item.name === field) {
					if (i == otpInput.length - 1) return;
					otpInput[i + 1].focus();
                    change
				}
			});
		}
		if (e.inputType == 'deleteContentBackward') {
			otpInput.forEach((item: any, i) => {
				if (item.name === field) {
					if (i == 0) return;
					otpInput[i - 1].focus();
                    change
				}
			});
		}

		
	};
</script>

<label class="label  {error ? 'error' : ''}">
	<input
		{name}
		on:blur={errorValidateAction}
		on:input={(e) => handleInput(e, e.target?.name)}
        on:change = {change}
		use:typeAction
		bind:value
		{placeholder}
	/>
</label>

<style>
	.label {
		width: auto;
		font-size: 1.3rem;
		font-weight: 500;
	}
	input {
		width: 100%;
		font-size: 1rem;
		outline: none;
		display: flex;
		align-items: center;
		background-color: var(--surface);
		padding: 10px;
		border-radius: 7px;
		transition: all 0.2s ease-in-out;
		margin-top: 15px;
		border: 1px solid transparent;
		background-color: var(--input_background);
		text-align: center;
	}
	input:hover,
	input:focus {
		border: var(--input_hover_border);
		box-shadow: var(--input_boxshadow);
	}

	.error input {
		background-color: var(--input_error_background);
		color: var(--error);
	}
	.error input:hover,
	.error input:focus {
		border: var(--input_error_border);
		box-shadow: var(--input_error_boxshadow);
	}
</style>
