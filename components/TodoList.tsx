// components/TodoList.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AddTodo from "./AddTodo";
import TodoItem from "./TodoItem";

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("/api/todos");
        setTodos(response.data);
      } catch (err) {
        setError("Failed to fetch todos");
      }
    };
    fetchTodos();
  }, []);

  const onTodoAdded = (newTodo: Todo) => {
    setTodos([...todos, newTodo]);
  };

  const onTodoUpdated = (updatedTodo: Todo) => {
    setTodos(
      todos.map((todo) => (todo._id === updatedTodo._id ? updatedTodo : todo))
    );
  };

  const onTodoDeleted = (id: string) => {
    setTodos(todos.filter((todo) => todo._id !== id));
  };

  return (
    <div className="container mx-auto max-w-lg bg-gray-800 p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center text-white mb-6">
        Todo List
      </h1>
      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>
      )}
      <AddTodo onTodoAdded={onTodoAdded} setError={setError} />
      <ul className="space-y-4">
        {todos.map((todo) => (
          <TodoItem
            key={todo._id}
            todo={todo}
            onTodoUpdated={onTodoUpdated}
            onTodoDeleted={onTodoDeleted}
            setError={setError}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
