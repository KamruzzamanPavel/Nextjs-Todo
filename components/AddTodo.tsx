// components/AddTodo.tsx
"use client";

import { useState } from "react";
import axios from "axios";

interface AddTodoProps {
  onTodoAdded: (todo: {
    _id: string;
    title: string;
    completed: boolean;
  }) => void;
  setError: (error: string | null) => void;
}

const AddTodo = ({ onTodoAdded, setError }: AddTodoProps) => {
  const [newTodo, setNewTodo] = useState("");

  const addTodo = async () => {
    try {
      const response = await axios.post("/api/todos", { title: newTodo });
      onTodoAdded(response.data);
      setNewTodo("");
    } catch (err) {
      setError("Failed to add todo");
    }
  };

  return (
    <div className="mb-6 flex items-center">
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new task"
        className="w-full p-3 rounded-l-lg border-none focus:outline-none text-black"
      />
      <button
        onClick={addTodo}
        className="bg-blue-500 text-white px-4 py-3 rounded-r-lg hover:bg-blue-600 transition-colors"
      >
        Add
      </button>
    </div>
  );
};

export default AddTodo;
