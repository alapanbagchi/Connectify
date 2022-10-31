<script lang="ts">
	export let name: string;
	export let label: string;
	export let placeholder: string;
	export let value: string
	export let onInput: (e: Event) => void = () => {};
	export let onBlur: (e: Event) => void = () => {};
	export let onFocus: (e: Event) => void = () => {};
	export let onChange: (e: Event) => void = () => {};
	export let error: string = '';
	export let disabled: boolean = false;
</script>

<div>
	<label for={name}>{label}</label>
	<input
		on:focus={onFocus}
		on:blur={onBlur}
		on:change={onChange}
		on:input={onInput}
		bind:value={value}
		autocomplete="off"
        type="date"
		disabled={disabled}
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
		border-radius: 7px;
		outline: none;
		padding: 10px 16px;
		gap: 15px;
		transition: all 0.3s ease-in-out;
		margin-top: 10px;
		background-color: var(--input);
		color: #ffffff;
		font-size: 0.8rem;
		font-family: inherit;
	}
	::-webkit-calendar-picker-indicator {
    filter: invert(1);
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
		margin-top: 5px;
		font-weight: 500;
	}
</style>
