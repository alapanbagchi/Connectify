<script lang="ts">
	import '../../app.css';
	import Menu from '$lib/Menu/Menu.svelte'
	import Profile from '../../lib/Profile/Profile.svelte';
	import { onMount } from 'svelte';
	import API from '../../utils/API';
	import Spinner from '$lib/Spinner/Spinner.svelte';
	import { user } from '$lib/stores/user';
	import { peopleSearchTerm } from '$lib/PeopleTable/people.store';
	import { page } from '$app/stores';
	let active = false;	
	let name = ''
	$: searchTerm = ''
	onMount(async () => {
		try {
			const response: any = await API.get('/user/me', {});
			$user = response.data
			name = response.data.fullName;
			if(!response.data.verified) {
				window.location.href = '../verify';
			}
		} catch (err) {
			window.location.href = '../login';
		}
	});
	$: currentPage = $page.url.pathname.split('/')[2];
	$: placeholder = ''
	$: if(currentPage === 'contacts'){
		placeholder = 'Search contacts'
	} else if(currentPage === 'reminders'){
		placeholder = 'Search reminders'
	} else {
		placeholder = 'asd'
	}
</script>
{#if name==''}
	<Spinner />	
{:else}
	<section>
		<div class="menu">
			<Menu />
		</div>
		<div class="content">
			<div class="search">
				<div class="searchbar">
					<span class="material-symbols-rounded">search</span>
					<input bind:value={$peopleSearchTerm} type="text" placeholder={placeholder} />
				</div>				
				<div class="profile">
					<Profile {name} />
				</div>
			</div>
			<main>
				<slot />
			</main>
		</div>
	</section>
{/if}
<style>
	section {
		display: flex;
	}
	.menu {
		width: 350px;
		height: 100vh;
	}
	.profile{
		margin-left: auto;
		padding-right: 0;
	}
	.content {
		width: calc(100vw - 350px);
	}
	main {
		padding: 15px 20px;
		height: calc(100vh - 61px);
		overflow: hidden;
	}
	.search {
		width: 100%;
		height: 61px;
		display: flex;
		padding: 10px 20px;
		border-bottom: 1px solid var(--border);
		gap: 3rem;
	}
	.searchbar {
		display: flex;
		align-items: center;
		width: 80%;
		height: 100%;
		border: 1px solid var(--border);
		border-radius: 5px;
		padding: 0 10px;
		background-color: var(--surface);
		padding: 8px 15px;
		gap: 5px;
		border-radius: 7px;
	}
	.searchbar input {
		width: 100%;
		height: 100%;
		border: none;
		outline: none;
		padding: 10px;
		background-color: transparent;
		color: var(--text);
	}
	.material-symbols-rounded {
		font-size: 1.1rem;
		margin-top: 2px;
	}

	@media (max-width: 1200px) {
		.menu {
			width: 80px;
		}
		.content {
			width: calc(100vw - 80px);
		}
	}
	@media (max-width: 600px) {
		.menu {
			width: 100vw;
			position: fixed;
			height: 60px;
			bottom: 0;
		}
		.content {
			width: 100vw;
		}
		.profile{
			padding-right: 0;
		}
	}
</style>
