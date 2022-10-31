<script lang="ts">
	import { onDestroy } from 'svelte';
	import { alert } from './notifications';

	export let ms = 30;
	let timeout: any;
	let width = 0;
	const onMessageChange = (message: any, ms: any) => {
		if (message != '') {
			width = 100;
			clearTimeout(timeout);
			//Set Interval to reduce width to 0
			if (ms > 0) timeout = setInterval(() => (width != 0 ? width-- : null), ms);
		}
	};
	$: onMessageChange($alert.title, ms);
	onDestroy(() => clearTimeout(timeout));

	const icon = (type: string) => {
		if (type === 'SUCCESS') return `data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath opacity='0.12' d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z' fill='%2300AF66' /%3E%3Cpath d='M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z' stroke='%2300AF66' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' /%3E%3C/svg%3E`;

		else if (type === 'ERROR') return `data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath opacity='0.12' d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z' fill='%23EC5557' /%3E%3Cpath d='M15 9L9 15M9 9L15 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z' fill='%23EC555720' stroke='%23EC5557' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' /%3E%3C/svg%3E`;
			
		else if (type === 'INFO') return `data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath opacity='0.12' d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z' fill='black' /%3E%3Cpath d='M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' /%3E%3C/svg%3E`
    
	};
</script>

<div class="wrapper {width == 0 ? 'hide' : ''}">
	<div class="container">
		<div style="width:{width}%" class="progressbar" />
		<div class="content">
			<div class="icon">
				<img src={icon($alert.type)} alt="icon" />
			</div>
			<div class="text">
				<div class="title">{$alert.title}</div>
				<div class="description">
					{$alert.description}
				</div>
			</div>
		</div>
	</div>
	<slot />
</div>

<style>
	.container {
		display: flex;
		position: absolute;
		width: 400px;
		z-index: 99999999999999;
		bottom: 0;
		right: 0;
		border-radius: 7px;
		background-color: var(--surface);
		box-shadow: 20px 20px 60px var(--surface), -20px -20px 60px var(--bg);
		display: flex;
		line-height: 25px;
		align-items: flex-start;
		flex-direction: column;
	}
	.content {
		width: 100%;
		display: flex;
		gap: 20px;
		padding: 20px 25px;
	}
	.progressbar {
		height: 4px;
		width: 100%;
		background-color: var(--primary);
	}
	.hide {
		display: none;
		opacity: 0;
		transition: all 0.3s ease-in-out;
	}
	.hide .container{
		z-index: -1;
	}
	.icon {
		width: 30px;
		height: 30px;
		min-width: 30px;
		min-height: 30px;
		max-width: 30px;
		max-height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 5px;
		border-radius: 50%;
	}
	.title {
		font-weight: 600;
		font-size: 0.9em;
		margin-bottom: 5px;
		opacity: 1 !important;
	}
	.description {
		font-size: 0.9rem;
		opacity: 0.7;
		margin-top: 10px;
	}
</style>
