// components/TodoItem.tsx
"use client";

import { useState } from "react";
import axios from "axios";

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onTodoUpdated: (updatedTodo: Todo) => void;
  onTodoDeleted: (id: string) => void;
  setError: (error: string | null) => void;
}

const TodoItem = ({
  todo,
  onTodoUpdated,
  onTodoDeleted,
  setError,
}: TodoItemProps) => {
  const [editing, setEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(todo.title);

  const toggleTodo = async () => {
    try {
      const response = await axios.put(`/api/todos/${todo._id}`, {
        completed: !todo.completed,
      });
      onTodoUpdated(response.data);
    } catch (err) {
      setError("Failed to update todo");
    }
  };

  const saveEdit = async () => {
    try {
      const response = await axios.put(`/api/todos/${todo._id}`, {
        title: editingTitle,
      });
      onTodoUpdated(response.data);
      setEditing(false);
    } catch (err) {
      setError("Failed to save todo");
    }
  };

  const deleteTodo = async () => {
    try {
      await axios.delete(`/api/todos`, { params: { id: todo._id } });
      onTodoDeleted(todo._id);
    } catch (err) {
      setError("Failed to delete todo");
    }
  };

  return (
    <li className="flex items-center justify-between p-4 bg-gray-700 rounded-lg shadow-sm">
      {editing ? (
        <input
          type="text"
          value={editingTitle}
          onChange={(e) => setEditingTitle(e.target.value)}
          className="w-full p-2 mr-2 rounded-lg border-none focus:outline-none text-black"
        />
      ) : (
        <span
          className={`flex-grow cursor-pointer text-lg ${
            todo.completed ? "line-through text-gray-400" : "text-white"
          }`}
          onClick={toggleTodo}
        >
          {todo.title}
        </span>
      )}
      <div className="flex items-center space-x-2">
        {editing ? (
          <>
            <button
              onClick={saveEdit}
              className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={deleteTodo}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={toggleTodo}
              className={`${
                todo.completed
                  ? "bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-colors"
                  : "bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
              }`}
            >
              {todo.completed ? "Undone" : "Done"}
            </button>
          </>
        )}
      </div>
    </li>
  );
};

export default TodoItem;
