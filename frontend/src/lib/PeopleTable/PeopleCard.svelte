<script lang="ts">
	import { alert } from "$lib/Notifications/notifications";
	import API from "../../utils/API";
	import { currentPerson, editPeopleDetails, people, viewPeopleDetails } from "./people.store";


    export let person:any
    let isSubmitting = false

    const viewPeople = (person: any) => {
		$currentPerson = person;
		$viewPeopleDetails = true;
	};
	const editPeople = (person: any) => {
		$currentPerson = person;
		$editPeopleDetails = true;
	};
	const deletePeople = async (person: any) => {
		try{
			isSubmitting = true
			$alert.title = 'Deleting Contact';
			$alert.type = 'INFO';
			$alert.description = 'Your contact is being deleted';
			const result = await API.delete(`/contact/delete/${person._id}`,{});
			$people = $people.filter((p: any) => p._id !== person._id);
			$alert.title = 'Contact Deleted';
			$alert.type = 'SUCCESS';
			$alert.description = 'Your contact has been deleted';
			isSubmitting = false
		}catch(err){
			isSubmitting = false
			$alert.title = 'Error Deleting Contact';
			$alert.type = 'ERROR';
			$alert.description = 'Something unexpected happened while deleting your contact. Please try again later';
		}
	};
</script>


<div class="container">
    <main on:click={() => (viewPeople(person))} on:keydown={()=>{}}>
        <header>
            <p class="name">{person.fullName.length>30 ? person.fullName.substring(0,30) + '...' : person.fullName}</p>
        </header>
        <div class="block">
            <div class="dob">
                <div class="label">Date of Birth</div>
                <div class="value">{person.dob !=null ? new Date(person.dob).toDateString().split(' ').slice(1).join(' ') : ''}</div>
            </div>
            <div class="contact_frequency">
                <div class="label">Contact Frequency</div>
                <div class="value">{person.contact_frequency ? person.contact_frequency : ''} {person.contact_frequency ? person.contact_frequcney === "1" ? 'day' : 'days' : ''}</div>
            </div>
        </div>
        <div class="label">Notes</div>
        <div class="value">{person.notes.length > 200 ? person.notes.substring(0,200) + '...' : person.notes}</div>
    </main>
    <div class="btn_grp">
        <button on:click={() => (editPeople(person))}>Edit</button>
        <button disabled={isSubmitting} class="delete" on:click={() => (deletePeople(person))}>
            {#if isSubmitting} 
                <img width="16px" src="/icons/loader.svg" alt="">
            {:else}
                Delete
            {/if}
        </button>
    </div>
</div>

<style>
    button {
		background: none;
		border: none;
		width: fit-content;
	}

	.container {
		display: flex;
		flex-direction: column;
		margin: 0 0 20px 0;
		height: 350px;
		min-height: 350px;
		max-height: 350px;
		padding: 20px;
		background: var(--card);
		border-radius: 5px;
		border: 1px solid var(--border);
		max-width: 350px;
		opacity: 0.7;
		transition: all 0.2s ease-in-out;
	}
	.container:hover {
		opacity: 1;
		transition: all 0.2s ease-in-out;
	}
	main{
		display: flex;
		flex-direction: column;
		width: 100%;
        cursor: pointer;
		height: 100%;
	}
	.container header {
		display: flex;
		flex-direction: column;
		padding-bottom: 20px;
		border-bottom: 1px solid #FFFFFF20;
	}
	.container header .name {
		font-size: 1.1rem;
		font-weight: 400;
	}
	.container .block {
		width: 100%;
		display: flex;
		flex-direction: row;
		margin: 20px 0;
		justify-content: space-between;
	}
	.container .block .dob {
		margin-right: 20px;
	}
	.label {
		font-size: 0.9rem;
		font-weight: 500;
	}
	.value {
		font-size: 0.9rem;
		font-weight: 400;
		color: #FFFFFF;
		opacity: 0.7;
		margin-top: 5px;
	}
	.btn_grp {
		display: flex;
		flex-direction: row;
		margin-top: auto;
	}
	button {
		color: #ffffff;
		font-size: 14px;
		width: 100%;
		padding: 5px 0;
		display: flex;
		border: 2px solid var(--primary);
		background-color: var(--primary);
		justify-content: center;
		align-items: center;
		border-radius: 7px;
		cursor: pointer;
		transition: all 0.3s ease-in-out;
		font-weight: 500;
	}
	button:hover {
		background-color: transparent !important;
		color: white;
		transition: all 0.3s ease-in-out;
	}
	button:active {
		transform: scale(0.95);
		transition: all 0.3s ease-in-out;
	}
	button:disabled {
		color: #9e9e9e;
		cursor: not-allowed;
	}
	.delete{
		margin-left: 10px;
		background-color: #ff6f6f;
		border: 2px solid #ff6f6f;

	}
	@media (max-width: 768px) {
		.container {
			width: 100%;
			max-width: 100%;
			margin: 0 0 20px 0;
		}
	}
</style>