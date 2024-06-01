import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Todo from "@/models/Todo";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const { id } = params;
  const data = await request.json();
  const updatedTodo = await Todo.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(updatedTodo);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const { id } = params;
  await Todo.findByIdAndDelete(id);
  return NextResponse.json({}, { status: 204 });
}
