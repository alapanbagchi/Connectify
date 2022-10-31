<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import API from '../../utils/API';
	const path = $page.url.pathname;

	$: active = $page.url.pathname.split('/')[2];
	const logout = async () =>{
		await API.post('/user/logout',{})
		goto('../')
	}

	const options = [
		{
			name: 'Contacts',
			icon: 'contacts'
		},
		{
			name: 'Reminders',
			icon: 'schedule'
		},
		{
			name: 'Profile',
			icon: 'account_circle'
		},
		{
			name: 'Logout',
			icon: 'logout'
		}
	]

</script>

<div class="wrapper">
	<header>
		<div class="logo">Connectify</div>
		<div class="collapsedlogo">C</div>
	</header>
	<div class="menu">
		{#each options as option}
			<div on:click={() => goto('/dashboard/' + option.name.toLowerCase().replace(' ','_'))} on:keydown={()=>{}} class="option {active === option.name.toLowerCase().replace(' ','_') ? 'active' : ''}">
				<span class="material-symbols-rounded icons">
					{option.icon}
				</span>
				<p class="menu_name">{option.name}</p>
			</div>
		{/each}
	</div>
</div>

<style>
	.wrapper {
		height: 100%;
		background-color: var(--menu);
		border-right: 2px solid var(--border);
	}
	header {
		width: 100%;
		height: 40px;
		display: flex;
		align-items: center;
		padding: 30px 10px;
		display: flex;
		align-items: center;
		border-bottom: 1px solid var(--border);
	}
	.logo {
		width: 100%;
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text);
		padding-left: 8px;
	}
	.option {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.8rem;
		font-weight: 400;
		margin-top: 1rem;
		padding: 10px 15px;
		opacity: 0.6;
		font-size: 0.95rem;
		border-radius: 7px;
	}
	.active .menu_name{
		opacity: 1;
	}
	.menu{
		padding: 0 10px;
	}
	.icons{
		font-weight: 400;
		opacity: 0.6;
	}
	.option:hover {
		cursor: pointer;
		opacity: 1;
		transition: all 0.2s ease;
	}
	.collapsedlogo{
		display: none;
		font-weight: 600;
	}
	.active {
		background-color: var(--surface);
		opacity: 1;
	}
	@media (max-width: 1200px) {
		header{
			justify-content: center;
			border-top: 2px solid var(--border);
		}
		.menu{
			width: 100%;
		}
		.option{
			padding: 10px 0;
			display: flex;
			justify-content: center;
		}
		.option p{
			display: none;
		}
		.collapsedlogo{
			display: flex;
		}
		.logo{
			display: none;
		}
	}
	@media (max-width: 600px) {
		.collapsedlogo{
			display: none;
		}
		.option{
			width: 50px;
			display: flex;
			justify-content: center;
			margin-top: 0;
			height: fit-content;
		}
		.logo{
			display: none;
		}
		.wrapper{
			display: flex;
    		justify-content: center;
		}
		.menu {
			width: fit-content;
			position: fixed;
			height: 60px;
			bottom: 0;
			flex-direction: row;
			display: flex;
			align-items: center;
			width: 70%;
			justify-content: space-between;
		}
		.logo{
			display: none;
		}
	}
</style>
