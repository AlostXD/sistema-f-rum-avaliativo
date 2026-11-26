import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { erroPrisma } from "@/lib/api";
import { validarAluno } from "@/lib/validade";

type Ctx = { params: Promise<{ id: string }> };

async function lerId(ctx: Ctx) {
  const { id } = await ctx.params;
  const n = Number(id);
  return Number.isInteger(n) ? n : null;
}

export async function GET(_req: Request, ctx: Ctx) {
  const id = await lerId(ctx);
  if (id === null) return NextResponse.json({ erro: "ID inválido." }, { status: 400 });

  try {
    const aluno = await prisma.aluno.findUnique({ where: { id } });
    if (!aluno) return NextResponse.json({ erro: "Aluno não encontrado." }, { status: 404 });
    return NextResponse.json(aluno);
  } catch (e) {
    return erroPrisma(e);
  }
}

export async function PUT(req: Request, ctx: Ctx) {
  const id = await lerId(ctx);
  if (id === null) return NextResponse.json({ erro: "ID inválido." }, { status: 400 });

  const { dados, erro } = validarAluno(await req.json().catch(() => null));
  if (!dados) return NextResponse.json({ erro }, { status: 400 });

  try {
    const aluno = await prisma.aluno.update({ where: { id }, data: dados });
    return NextResponse.json(aluno);
  } catch (e) {
    return erroPrisma(e);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const id = await lerId(ctx);
  if (id === null) return NextResponse.json({ erro: "ID inválido." }, { status: 400 });

  try {
    await prisma.aluno.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    return erroPrisma(e);
  }
}