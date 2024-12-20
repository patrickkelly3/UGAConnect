import connectMongoDB from "../../../../src/libs/mongodb";
import Class from "../../../../src/models/classSchema";
import {User} from "../../../../src/models/userSchema";
import Message from "../../../../database_files/models/messageSchema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { Types } from "mongoose"; // For ObjectId conversion

interface RouteParams{
    params: {
    id?: string;
    }
 }
 type Message = {
  sender: String,
  content: String
}

 export async function GET(request: NextRequest, context: { params: { id?: string; _id?: string } }) {
  const { id } = context.params; // Assume id contains either 'id' or '_id'

  if (!id) {
    return NextResponse.json({ error: "'id' is required" }, { status: 400 });
  }

  await connectMongoDB();

  try {
    let query: any;
    if (id.startsWith("CRN")) {
      // If the first three characters are "CRN", query by 'id'
      query = { id };
      console.log("QUERY BY ID: " + id);
    } else {
      // Otherwise, treat it as '_id' and validate it
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid '_id' format" }, { status: 400 });
      }
      query = { _id: new mongoose.Types.ObjectId(id) };
      console.log("QUERY BY _ID: " + id);
    }

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

  

export async function PUT(
  request: NextRequest,
  context: { params: { id?: string } }
) {
  const { params } = context;
  const id = params?.id;

  if (!id) {
    return NextResponse.json(
      { error: "Class ID parameter is required" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { action, email } = body;

  if (!action || !email) {
    return NextResponse.json(
      { error: "Both `action` and `email` fields are required " },
      { status: 400 }
    );
  }

  await connectMongoDB();

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User with the given email not found" },
        { status: 404 }
      );
    }

    // Determine update action
    let updateQuery;
    if (action === "add") {
      updateQuery = { $addToSet: { list: user } }; // Add user ID to the list
    } else if (action === "delete") {
      updateQuery = { $pull: { list: user } }; // Remove user ID from the list
    } else {
      return NextResponse.json(
        { error: "Invalid `action` specified. Use 'add' or 'delete'" },
        { status: 400 }
      );
    }

  
    let updatedClass;

    
      updatedClass = await Class.findOneAndUpdate({ id }, updateQuery, {
        new: true, // Return the updated document
      });
    

    if (!updatedClass) {
      return NextResponse.json(
        { error: "Class not found" },
        { status: 404 }
      );
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

export async function POST(
  request: NextRequest,
  context: { params: { id?: string } }
) {
  const { id } = context.params;
  if (!id) {
    return NextResponse.json(
      { error: "Class ID parameter is required" },
      { status: 400 }
    );
  }
  const body = await request.json();
  console.log("request: ", body)
  const { message } = body;
  if (!message || !message.sender || !message.content) {
    return NextResponse.json(
      {
        error: "A valid `message` object with `sender` and `content` fields is required",
      },
      { status: 400 }
    );
  }
  await connectMongoDB();
  try {
    // Validate the sender exists
    const senderExists = await User.findById(message.sender);
    if (!senderExists) {
      return NextResponse.json(
        { error: "Sender with the given ID not found" },
        { status: 404 }
      );
    }
    // Validate the class exists
    const targetClass = await Class.findOne({ id });
    if (!targetClass) {
      return NextResponse.json(
        { error: "Class with the given ID not found" },
        { status: 404 }
      );
    }
    // Create a new message document
    const newMessage = await Message.create({
      sender: message.sender,
      content: message.content,
    });
    // Add the new message to the class's chat array
    targetClass.chat.push(newMessage);
    await targetClass.save();
    return NextResponse.json(
      {
        message: "Message added to class chat successfully",
        updatedClass: targetClass,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error adding message to chat:", error);
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
