<script lang="ts">
	import API from '../../utils/API';
	import { onMount } from 'svelte';
	import {people, peopleSearchTerm, viewPeopleDetails } from './people.store';
	import { alert } from '$lib/Notifications/notifications';
	import PeopleCard from './PeopleCard.svelte';
	import Spinner from '$lib/Spinner/Spinner.svelte';
	let isLoaded = false
	onMount(async ()=>{
		const contacts = await API.get('contact/get',{})
		$people = contacts

		//Sort the contacts by their names alphabetically. People is an array of objects with a name property
		$people.sort((a: any,b: any)=>{
			if(a.fullName.toUpperCase() < b.fullName.toUpperCase()) { return -1; }
			if(a.fullName.toUpperCase() > b.fullName.toUpperCase()) { return 1; }
			return 0;
		})
		isLoaded = true
	})

	//Sort people according to peopleSearchTerm value based on the fullName property of each object
	$: filteredPeople = $people.filter((person: any)=>{
		return person.fullName.toLowerCase().includes($peopleSearchTerm.toLowerCase())
	})
</script>

<section>
	{#if isLoaded}
		{#each filteredPeople as person}
			<PeopleCard person={person}/>
		{/each}
		{:else}
			<Spinner />
	{/if}
</section>

<style>
	section {
		width: 100%;
		height: calc(100vh - 200px);
		overflow: auto;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 10px;
		position: relative;
	}
	
</style>
