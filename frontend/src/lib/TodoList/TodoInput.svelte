<script lang="ts">
	import API from "../../utils/API";
	import { todoStore } from "./todo.store";
	import * as yup from "yup";
	import { createForm } from "svelte-forms-lib";
	import { alert } from "$lib/Notifications/notifications";
	import { user } from "$lib/stores/user";
	import Button from "$lib/Input/Button.svelte";
	//create the variable to store the current date inthe format 2022-01-01 and increment it by 1 day
	let date = new Date(new Date().toLocaleString('en-US',{timeZone: $user.timezone}).split(',')[0])
	let year = date.getFullYear()
	let month = date.getMonth() + 1
	let day = date.getDate()
	let dateFormatted = `${year}-${month}-${day}`
	let isSubmitting = false
	const { form, handleChange, errors, touched, handleSubmit } = createForm({
		initialValues: {
			todo: '',
			date: dateFormatted,
		},
		onSubmit: async (values: any) => {
			try {
			isSubmitting = true
			$alert.title = 'Adding To Do';
			$alert.type = 'INFO';
			$alert.description = 'Please wait while we add your to do';
			const response: any = await API.post('/todo/add', values);
			response.data.sort((a: any, b: any) => {
				return new Date(a.date).getTime() - new Date(b.date).getTime();
			})
			$todoStore = response.data
			$alert.title = 'To Do Added';
			$alert.type = 'SUCCESS';
			$alert.description = 'Your to do has been added';
			isSubmitting = false
		} catch (err) {
			$alert.title = 'Adding To Do Failed';
			$alert.type = 'INFO';
			$alert.description = 'Your to do could not be added. Please try again later.';
			isSubmitting = false
		}
		},
		validationSchema: yup.object().shape({
			todo: yup.string().required('Todo is required'),
			// Check if the date is in the past using something other than .min
			date: yup
				.string()
				.required('Date is required')
				.matches(/^\d{4}-\d{2}-\d{2}$/, 'Date is invalid')
				.test('date', 'Date must be in the future', (value: any) => {
					return value >= dateFormatted
				}),
		})
	});
	

</script>
<div class="container">
<form on:submit={handleSubmit} class="wrapper">
	<input name="todo" class="todo" on:change={handleChange} bind:value={$form.todo} placeholder="Add a task" type="text" />
	<div class="block">
		<input name="date" on:change={handleChange} bind:value={$form.date} class="date" type="date" />
		<button disabled={isSubmitting}>Add task</button>
	</div>
</form>
	<p class="error">{$errors.todo || $errors.date }</p>
</div>
<style>
	.container{
		width: 100%;
	}
	.wrapper {
		width: 100%;
		display: flex;
		align-items: center;
		border: 1px solid var(--border);
		padding: 10px 20px;
	}
	.block {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.todo{
		width: calc(100% - 31ch);
	}
	.block{
		width:  31ch;
		justify-content: space-between;
	}
	.date {
		font-family: inherit;
		cursor: pointer;
		width: fit-content;
	}
	input {
		width: 100%;
		height: 100%;
		border: none;
		outline: none;
		background-color: transparent;
		display: flex;
		color: #FFFFFF;
	}

	::-webkit-calendar-picker-indicator {
    	filter: invert(1);
	}
	.error{
		color: var(--error);
		font-weight: 600;
		font-size: 0.9rem;
	}
	button{
		background-color: var(--primary);
		color: #000000;
		border: none;
		border-radius: 5px;
		padding: 10px 20px;
		font-size: 0.8rem;
		cursor: pointer;
		white-space: nowrap;
		font-weight: 500;
	}
	@media only screen and (max-width: 600px) {
		.wrapper {
			flex-direction: column;
		}
		input {
			padding: 10px 20px;
		}
		.block {
			flex-direction: column;
			width: 100%;
		}
		button {
			width: 100%;
		}
		.date {
			border-left: none;
			border-top: 2px solid var(--border);
			border-bottom: 2px solid var(--border);
			margin-bottom: 20px;
		}
		.todo{
			width: 100%;
		}
		.block{
			width:  100%;
		}
		.date{
			width: 100%;
		}
		input{
			padding: 15px 0;
		}
	}
</style>
