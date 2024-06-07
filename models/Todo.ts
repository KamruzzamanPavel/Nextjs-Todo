// models/Todo.ts
import mongoose, { Document, Schema } from "mongoose";

// Define the ITodo interface extending the Mongoose Document
interface ITodo extends Document {
  title: string;
  completed: boolean;
  createdAt: Date; // Ensure the createdAt field is part of the interface
}

// Define the Todo schema with timestamps enabled
const TodoSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // Enables createdAt and updatedAt fields
);

// Create or retrieve the Todo model
const Todo = mongoose.models.Todo || mongoose.model<ITodo>("Todo", TodoSchema);

export default Todo;
