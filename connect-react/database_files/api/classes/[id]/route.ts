import connectMongoDB from "../../../libs/mongodb";
import Class from "../../../models/classSchema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { Types } from "mongoose"; // For ObjectId conversion

interface RouteParams{
    params: {
    id?: string;
    }
 }

export async function GET(request: NextRequest, context: { params: {id?: string}}) {
  // Access and await the params
  const { params } = context;
  const id = params?.id;

  await connectMongoDB();


  if (!id) {
    return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
  }

  try {
    const query: any = { id }; // Use 'id' for matching
    console.log("Query:", query);

    const results = await Class.find(query);

    if (!results || results.length === 0) {
      return NextResponse.json(
        { error: "No classes found matching criteria" },
        { status: 404 }
      );
    }

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {

    if (error instanceof Error) {
        console.error("Error fetching class:", error);
    return NextResponse.json(
      { error: "Failed to fetch class", details: error.message },
      { status: 500 }
    );
    }
    
    console.error("Unknown error occurred:", error);
    return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
    );
    
  }
}

  
export async function PUT(request: NextRequest, context: { params: { id?: string } }) {
  // Extract the `id` from params
  const { params } = context;
  const id = params?.id;

  if (!id) {
    return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
  }

  // Parse the request body to get the new user
  const body = await request.json();
  const {action, newUser} = body; // Expecting `user` in the request body

  if (!newUser) {
    return NextResponse.json({ error: "User data is required" }, { status: 400 });
  }

  // Connect to the database
  await connectMongoDB();

  try {
    let updatedClass;

    if (action == 'add') {
        // Find and update the Class object
        updatedClass = await Class.findOneAndUpdate(
        { id }, // Match the document with the given ID
        { $push: { list: newUser } }, // Add `newUser` to the `users` array
        { new: true } // Return the updated document
      );
    }

    else if (action == 'delete') {
        // Find and update the Class object
        updatedClass = await Class.findOneAndUpdate(
        { id }, // Match the document with the given ID
        { $pull: { list: newUser } }, // Add `newUser` to the `users` array
        { new: true } // Return the updated document
      );
    }
    

    if (!updatedClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Class updated successfully", updatedClass },
      { status: 200 }
    );
  } catch (error) {

    if (error instanceof Error) {
        console.error("Error updating Class:", error);
        return NextResponse.json(
        { error: "Internal Server Error", details: error.message },
        { status: 500 }
        );
    }
    console.error("Unknown error occurred:", error);
    return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
    );
    
  }
}

