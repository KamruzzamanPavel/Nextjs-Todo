import axios from "axios";
import { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaCheckSquare,
  FaSquare,
  FaTimes,
  FaCheck,
} from "react-icons/fa";

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

interface TodoItemProps {
  todo: Todo;
  onTodoUpdated: (updatedTodo: Todo) => void;
  onTodoDeleted: (id: string) => void;
  setError: (error: string | null) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onTodoUpdated,
  onTodoDeleted,
  setError,
}) => {
  const [editingTitle, setEditingTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);

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

  const deleteTodo = async () => {
    try {
      await axios.delete(`/api/todos?id=${todo._id}`);
      onTodoDeleted(todo._id);
    } catch (err) {
      setError("Failed to delete todo");
    }
  };

  const saveEdit = async () => {
    try {
      const response = await axios.put(`/api/todos/${todo._id}`, {
        title: editingTitle,
      });
      onTodoUpdated(response.data);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save todo");
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingTitle(todo.title);
  };

  return (
    <li className="flex items-center justify-between p-4 bg-gray-800 border-gray-600 border rounded-lg shadow-sm ">
      <div className="flex items-center flex-grow overflow-hidden">
        {isEditing ? (
          <input
            type="text"
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            className="w-full p-2 mr-2 rounded-lg border-none focus:outline-none text-black"
          />
        ) : (
          <div className="flex items-center overflow-hidden">
            <span
              className={`cursor-pointer text-lg ${
                todo.completed ? "text-gray-300 " : " text-white"
              }`} // Conditionally apply line-through style
              onClick={toggleTodo}
            >
              {todo.completed ? (
                <FaCheckSquare size={24} />
              ) : (
                <FaSquare size={24} />
              )}
            </span>
            <span
              className={`ml-2 overflow-hidden text-ellipsis whitespace-nowrap ${
                todo.completed ? "line-through text-gray-400" : "text-white"
              }`}
            >
              {todo.title}
            </span>{" "}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={saveEdit}
              className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors"
            >
              <FaCheck />
            </button>
            <button
              onClick={cancelEdit}
              className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <FaTimes />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-3 py-1  rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaEdit />
            </button>
            <button
              onClick={deleteTodo}
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
            >
              <FaTrash />
            </button>
          </>
        )}
      </div>
    </li>
  );
};

export default TodoItem;
