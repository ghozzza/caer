import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// UPDATE transaction by id
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { status, tx_hash, error_message } = await req.json()
  const tx = await prisma.transactionHistory.update({
    where: { id: params.id },
    data: { status, tx_hash, error_message },
  })
  return NextResponse.json(tx)
}