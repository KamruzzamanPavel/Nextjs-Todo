"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AddTodo from "./AddTodo";
import TodoItem from "./TodoItem";

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
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

  const groupedTodos = groupTodosByDate(todos);

  return (
    <div className="container mx-auto max-w-lg bg-gray-700 p-6 rounded-lg shadow-md ">
      <h1 className="text-3xl font-bold text-center text-white mb-6">Todos</h1>
      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>
      )}
      <AddTodo onTodoAdded={onTodoAdded} setError={setError} />
      {Object.keys(groupedTodos).map((date) => (
        <div key={date} className="py-2">
          <h2 className="text-2xl font-bold text-white mb-4">{date}</h2>
          <div className="space-y-4 ">
            {groupedTodos[date].map((todo, i) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onTodoUpdated={onTodoUpdated}
                onTodoDeleted={onTodoDeleted}
                setError={setError}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Utility function to group todos by date
// const groupTodosByDate = (todos: Todo[]) => {
//   return todos.reduce((groups: Record<string, Todo[]>, todo) => {
//     const date = new Date(todo.createdAt).toLocaleDateString();
//     if (!groups[date]) {
//       groups[date] = [];
//     }
//     groups[date].push(todo);
//     return groups;
//   }, {});
// };

const groupTodosByDate = (todos: Todo[]) => {
  return todos.reduce((groups: Record<string, Todo[]>, todo) => {
    const date = new Date(todo.createdAt);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear().toString().slice(-2)}`;
    if (!groups[formattedDate]) {
      groups[formattedDate] = [];
    }
    groups[formattedDate].push(todo);
    return groups;
  }, {});
};

export default TodoList;
