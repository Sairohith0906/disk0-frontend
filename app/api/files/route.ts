import { NextResponse } from "next/server";
import { files } from "@/data/files";

export async function GET() {
  return NextResponse.json(files);
}