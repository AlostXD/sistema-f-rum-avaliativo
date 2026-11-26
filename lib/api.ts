import { NextResponse } from "next/server";
import { Prisma } from "@/lib/generated/prisma/client";

export function erroPrisma(e: unknown) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") {
      return NextResponse.json({ erro: "Matrícula ou e-mail já cadastrado." }, { status: 409 });
    }
    if (e.code === "P2025") {
      return NextResponse.json({ erro: "Aluno não encontrado." }, { status: 404 });
    }
  }
  console.error(e);
  return NextResponse.json({ erro: "Erro interno do servidor." }, { status: 500 });
}