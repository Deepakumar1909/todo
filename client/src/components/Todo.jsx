
import './todo.css';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthProvider';
import axios from 'axios';
import { Pencil, Trash2, Plus, X, SortAsc, Filter } from 'lucide-react';

const Todo = () => {
  const { authToken, logout } = useAuth();
  const [todos, setTodos] = useState([]);
  const initialFormData = {
    title: '',
    description: '',
    duedate: '',
    status: 'to-do'
  };
  const [formData, setFormData] = useState(initialFormData);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortBy, setSortBy] = useState('duedate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchTodos();
  }, [authToken]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("https://todo-server-urcf.onrender.com/todo/gettodo", {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setTodos(response.data.todos);
    } catch (error) {
      console.error("Error fetching todos", error);
    }
  };

  // Sorting and filtering logic
  const getSortedAndFilteredTodos = () => {
    let filteredTodos = [...todos];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filteredTodos = filteredTodos.filter(todo => todo.status === statusFilter);
    }

    // Apply sorting
    return filteredTodos.sort((a, b) => {
      if (sortBy === 'duedate') {
        const dateA = new Date(a.duedate);
        const dateB = new Date(b.duedate);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortBy === 'status') {
        const statusOrder = { 'to-do': 1, 'in progress': 2, 'completed': 3 };
        return sortOrder === 'asc' 
          ? statusOrder[a.status] - statusOrder[b.status]
          : statusOrder[b.status] - statusOrder[a.status];
      } else if (sortBy === 'title') {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      return 0;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const response = await axios.post("https://todo-server-urcf.onrender.com/todo/updatetodo", 
          { ...formData, id: editingId },
          { headers: { Authorization: `Bearer ${authToken}` }}
        );
        if (response.status === 200) {
          setTodos(todos.map(todo => 
            todo._id === editingId ? { ...todo, ...formData } : todo
          ));
        }
      } else {
        const response = await axios.post("https://todo-server-urcf.onrender.com/todo/settodo", 
          formData,
          { headers: { Authorization: `Bearer ${authToken}` }}
        );
        if (response.status === 207) {
          alert("Description of two todos can't be same");
          return;
        }
        fetchTodos();
      }
      resetForm();
    } catch (error) {
      console.error("Error saving todo", error);
    }
  };

  const handleEdit = (todo) => {
    setFormData({
      title: todo.title,
      description: todo.description,
      duedate: todo.duedate.split('T')[0],
      status: todo.status
    });
    setEditingId(todo._id);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await axios.post("https://todo-server-urcf.onrender.com/todo/deletetodo",
          { id },
          { headers: { Authorization: `Bearer ${authToken}` }}
        );
        setTodos(todos.filter(todo => todo._id !== id));
      } catch (error) {
        console.error("Error deleting todo", error);
      }
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setIsFormVisible(false);
    setEditingId(null);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
        <button 
        onClick={logout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Todos</h1>
        <div>
          <button 
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            {isFormVisible ? <X /> : <Plus />}
            {isFormVisible ? 'Cancel' : 'Create New Task'}
          </button>
        </div>
      </div>

      {/* Sorting and Filtering Controls */}
      <div className="mb-6 flex flex-wrap gap-4 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <SortAsc className="text-gray-500" size={20} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="duedate">Sort by Due Date</option>
            <option value="status">Sort by Status</option>
            <option value="title">Sort by Title</option>
          </select>
          <button
            onClick={toggleSortOrder}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            {sortOrder.toUpperCase()}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="text-gray-500" size={20} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All Status</option>
            <option value="to-do">To-Do</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input
                required
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                required
                type="date"
                name="duedate"
                value={formData.duedate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="to-do">To-Do</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <button 
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {editingId ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {getSortedAndFilteredTodos().map((todo) => (
          <div key={todo._id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{todo.title}</h2>
                <p className="text-gray-600 mt-1">{todo.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Due Date: {new Date(todo.duedate).toLocaleDateString()}
                </p>
                <span className={`inline-block px-2 py-1 rounded text-sm mt-2 ${
                  todo.status === 'completed' ? 'bg-green-100 text-green-800' :
                  todo.status === 'in progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {todo.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(todo)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => handleDelete(todo._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default Todo;