import { useState, useEffect } from 'react';

import logo from './logo.svg';
import './App.css';

function getTodos(callback) {
	fetch('/graphql', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: `query{
				todos {
					success
					errors
					todos {
						id
						completed
						description
						dueDate
					}
				}
			}`,
		}),
	})
		.then(res => res.json())
		.then(res => callback(res.data.todos.todos))
		.catch(console.error)
}

function createTodo(description, dueDate, callback) {
	fetch(`/graphql`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: `mutation {
				createTodo(description: "${description}", dueDate: "${dueDate}") {
					success
					errors
					todo {
						id
						completed
						description
						dueDate
					}
				}
			}`,
		}),
	})
		.then(res => res.json())
		.then(res => callback(res.data))
		.catch(console.error)
}

function deleteTodo(todoId, callback) {
	fetch(`/graphql`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: `mutation {
				deleteTodo(todoId: ${todoId}) {
					success
					errors
				}
			}`,
		}),
	})
		.then(res => res.json())
		.then(res => callback(res.data))
		.catch(console.error)
}

function App() {
	const [myTodos, setMyTodos] = useState([])
	const [todo, setTodo] = useState({
		description: "",
		dueDate: ""
	})

	useEffect(() => {
		getTodos((data) => setMyTodos(data));
	}, []);


	function onSubmitTodoForm(e) {
		e.preventDefault()

		// Let's create this API call shortly
		createTodo(todo.description, todo.dueDate, ({ createTodo }) => 
		{
			setMyTodos([...myTodos, createTodo.todo])
		})
	}


	return (
		<div className="App">
			<header className="App-header">
				<form onSubmit={onSubmitTodoForm}>
					<label>
						Description:{""}
						<input
							type="text"
							onChange={({ target }) =>
								setTodo({ ...todo, description: target.value })
							}
						/>
					</label>
					<label>
						DueDate:{""}
						<input
							type="text"
							onChange={({ target }) =>
								setTodo({ ...todo, dueDate: target.value })
							}
						/>
					</label>
					<input type="submit" value="createTodo" />
				</form>
				<ul>
					{myTodos.map(todo => (
						<li key={todo.id}>
							{todo.description} - {todo.dueDate}
							<button onClick={() => deleteTodo(todo.id, () =>
								{
									getTodos((data) => setMyTodos(data));
								})}>
								delete
							</button>
						</li>
					))}
				</ul>
			</header>
		</div>
	)
}
export default App;

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React if you darte
//         </a>
//       </header>
//     </div>
//   );
// }
