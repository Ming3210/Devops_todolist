import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)

  const API_URL = 'http://localhost:8080/api/todos'

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo, completed: false })
      })
      const data = await response.json()
      setTodos([...todos, data])
      setNewTodo('')
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const toggleTodo = async (todo) => {
    try {
      const response = await fetch(`${API_URL}/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...todo, completed: !todo.completed })
      })
      const updated = await response.json()
      setTodos(todos.map(t => t.id === updated.id ? updated : t))
    } catch (error) {
      console.error('Error toggling todo:', error)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      setTodos(todos.filter(t => t.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  return (
    <div className="container">
      <header className="header">
        <div className="logo-text">Todo<span>Lancer</span></div>
        <div className="status-badge glass">
          {loading ? 'Connecting...' : `Tasks: ${todos.length}`}
        </div>
      </header>

      <main className="todo-section">
        <div className="todo-card glass">
          <form className="add-todo-form" onSubmit={addTodo}>
            <input 
              type="text" 
              placeholder="What needs to be done?" 
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="todo-input"
            />
            <button type="submit" className="btn-primary">Add Task</button>
          </form>

          {loading ? (
            <div className="loader">Loading Tasks...</div>
          ) : (
            <ul className="todo-list">
              {todos.map(todo => (
                <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <div className="todo-content" onClick={() => toggleTodo(todo)}>
                    <div className={`checkbox ${todo.completed ? 'checked' : ''}`}></div>
                    <span className="todo-title">{todo.title}</span>
                  </div>
                  <button className="btn-delete" onClick={() => deleteTodo(todo.id)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                    </svg>
                  </button>
                </li>
              ))}
              {todos.length === 0 && !loading && (
                <div className="empty-state">No tasks yet. Start by adding one above!</div>
              )}
            </ul>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>Spring Boot + ReactJS Todo List</p>
      </footer>
    </div>
  )
}

export default App
