import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { erroPrisma } from "@/lib/api";
import { validarAluno } from "@/lib/validade";

export async function GET() {
  try {
    const alunos = await prisma.aluno.findMany({ orderBy: { nome: "asc" } });
    return NextResponse.json(alunos);
  } catch (e) {
    return erroPrisma(e);
  }
}

export async function POST(req: Request) {
  const { dados, erro } = validarAluno(await req.json().catch(() => null));
  if (!dados) return NextResponse.json({ erro }, { status: 400 });

  try {
    const aluno = await prisma.aluno.create({ data: dados });
    return NextResponse.json(aluno, { status: 201 });
  } catch (e) {
    return erroPrisma(e);
  }
}