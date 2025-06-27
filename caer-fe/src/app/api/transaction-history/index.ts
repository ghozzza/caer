import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// CREATE transaction
export async function POST(req: NextRequest) {
  const data = await req.json()
  const tx = await prisma.transactionHistory.create({ data })
  return NextResponse.json(tx)
}

// READ all transactions for a user
export async function GET(req: NextRequest) {
  const user_address = req.nextUrl.searchParams.get("user_address")
  if (!user_address) return NextResponse.json([], { status: 400 })
  const txs = await prisma.transactionHistory.findMany({
    where: { user_address },
    orderBy: { created_at: "desc" },
  })
  return NextResponse.json(txs)
}