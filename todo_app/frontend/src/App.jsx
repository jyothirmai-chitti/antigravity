import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Trash2, Plus, Sparkles } from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './index.css';

const API_URL = 'http://localhost:8000/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTodo }),
      });
      const data = await response.json();
      setTodos([...todos, data]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (todo) => {
    try {
      const response = await fetch(`${API_URL}/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      const updatedTodo = await response.json();
      setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      setTodos(todos.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="app-container">
      <div className="glass-panel">
        <header className="header">
          <h1>
            <Sparkles className="icon-main" />
            Task Master
          </h1>
          <p className="subtitle">Stay organized, stay creative.</p>
        </header>

        <form onSubmit={addTodo} className="input-group">
          <input
            type="text"
            className="todo-input"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button type="submit" className="btn-add" disabled={!newTodo.trim()}>
            <Plus className="icon-plus" />
          </button>
        </form>

        <div className="todo-list">
          {loading ? (
            <div className="loading">Loading tasks...</div>
          ) : todos.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet. Add one above!</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
                onClick={() => toggleTodo(todo)}
              >
                <button
                  className="btn-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTodo(todo);
                  }}
                >
                  {todo.completed ? (
                    <CheckCircle2 className="icon-check" />
                  ) : (
                    <Circle className="icon-circle" />
                  )}
                </button>
                <span className="todo-text">{todo.title}</span>
                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTodo(todo.id);
                  }}
                >
                  <Trash2 className="icon-trash" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <SpeedInsights />
    </div>
  );
}

export default App;
