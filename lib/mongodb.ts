import mongoose, { type Mongoose } from "mongoose";

const MONGODB_URI: string = process.env.MONGODB_URI ?? "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  var __mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.__mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!globalThis.__mongooseCache) {
  globalThis.__mongooseCache = cached;
}

export async function connectToDatabase(): Promise<Mongoose> {
  // Reuse the active connection when it exists, especially during Next.js hot reloads.
  if (cached.conn) {
    return cached.conn;
  }

  // Cache the pending promise so parallel requests do not open duplicate connections.
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}
