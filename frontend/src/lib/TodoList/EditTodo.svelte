<script lang="ts">
	import Input from '$lib/Input/Input.svelte';
	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';
	import DateInput from '$lib/Input/DateInput.svelte';
	import API from '../../utils/API';
	import { currentTodo, showEditTodo, todoStore } from './todo.store';
	import { editPeopleDetails } from '$lib/PeopleTable/people.store';
	import { alert } from '$lib/Notifications/notifications';
	//Get date in yyyy-mm-dd format
	let date = new Date()
	let year = date.getFullYear()
	let month = date.getMonth() + 1
	let day = date.getDate()
	let dateFormatted = `${year}-${month}-${day}`
	let isSubmitting = false

	const formatDate = (date: Date) => {
		let month = '' + (date.getMonth() + 1),
			day = '' + date.getDate(),
			year = date.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		return [year, month, day].join('-');
	}
	const { form, handleChange, errors, touched, handleSubmit } = createForm({
		initialValues: {
			todo: $currentTodo.todo,
			date: formatDate(new Date($currentTodo.date)),
		},
		onSubmit: async (values) => {
			try {
				isSubmitting = true
				$alert.title = 'Updating To Do';
				$alert.type = 'INFO';
				$alert.description = 'Please wait while we update your to do';
				// Make an API call to update the todo with 4 variables: date, index, newTodo and newDate
				const response: any = await API.patch('/todo/update', {
					date: new Date($currentTodo.date),
					index: $currentTodo.index,
					newTodo: values.todo,
					newDate: new Date(values.date)
				});
				//Sort the todo list
				response.data.sort((a: any, b: any) => {
					return new Date(a.date).getTime() - new Date(b.date).getTime();
				})
				$todoStore = response.data;
				$showEditTodo = false
				$alert.title = 'To Do Updated';
				$alert.type = 'INFO';
				$alert.description = 'Your to do has been updated';
				isSubmitting = false
			} catch (err) {
				$alert.title = 'Error';
				$alert.type = 'ERROR';
				$alert.description = 'There was an error updating your to do';
				isSubmitting = false
			}
		},
		validationSchema: yup.object().shape({
			todo: yup.string().required('Todo is required'),
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

<div class="wrapper">
	<div class="title">
		<p>Edit To Do</p>
		<button class="close" on:click={() => ($showEditTodo = false)}>
			<img width="18px" src="../icons/close.svg" alt="" />
		</button>
	</div>
	<form on:submit={handleSubmit}>
		<Input
			label="Todo"
			name="todo"
			value={$form.todo}
			onChange={handleChange}
			error={$errors.todo}
			placeholder="Todo"
		/>
		<DateInput
			label="Date"
			name="date"
			value={$form.date}
			onChange={handleChange}
			error={$errors.date}
			placeholder="Date"
		/>
		<button disabled={isSubmitting}>Edit</button>
	</form>
</div>

<style>
	.wrapper {
		width: fit-content;
		padding: 20px;
		background-color: var(--surface);
		width: 400px;
		border-radius: 5px;
	}
	.close {
		width: fit-content;
		height: fit-content;
		background-color: transparent;
		outline: none;
		padding: 0;
		margin: 0;
	}
	.title {
		font-size: 1.2rem;
		font-weight: 600;
		margin-bottom: 30px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.title img {
		cursor: pointer;
	}
	button {
		color: #ffffff;
		font-size: 14px;
		padding: 12px 25px;
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
		color: black;
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
	form {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	@media only screen and (max-width: 600px) {
		.wrapper {
			width: 100%;
		}
	}
</style>
