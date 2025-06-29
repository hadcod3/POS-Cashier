import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/database"
import User from "@/lib/database/models/user.model"

export async function POST(req: Request) {
  const { username, email, password } = await req.json()

  await connectToDatabase()

  const existing = await User.findOne({ email })
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    email,
    password: hashedPassword,
  })

  await user.save()

  return NextResponse.json({ success: true })
}
