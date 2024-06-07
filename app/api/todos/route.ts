import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Todo from "@/models/Todo";

// Middleware to connect to the database
const connectDatabase = async () => {
  try {
    await connectDB();
  } catch (error) {
    throw new Error("Failed to connect to database");
  }
};

// GET /api/todos - Get all todos
export async function GET() {
  try {
    await connectDatabase();
    const todos = await Todo.find().sort({ createdAt: -1 });
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

// POST /api/todos - Add a new todo
export async function POST(req: Request) {
  try {
    await connectDatabase();
    const { title } = await req.json();
    const newTodo = new Todo({
      title,
      completed: false,
    });
    const savedTodo = await newTodo.save();
    return NextResponse.json(savedTodo, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add todo" }, { status: 500 });
  }
}

// DELETE /api/todos/:id - Delete a todo
export async function DELETE(req: Request) {
  try {
    await connectDatabase();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Todo deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
