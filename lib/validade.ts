export type AlunoInput = {
  nome: string;
  matricula: string;
  email: string;
  curso: string;
  dataNascimento: Date;
  telefone: string | null;
};

export function validarAluno(body: unknown): { dados?: AlunoInput; erro?: string } {
  if (typeof body !== "object" || body === null) return { erro: "Corpo da requisição inválido." };

  const b = body as Record<string, unknown>;
  const txt = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const nome = txt(b.nome);
  const matricula = txt(b.matricula);
  const email = txt(b.email);
  const curso = txt(b.curso);
  const dataNascimento = new Date(txt(b.dataNascimento));

  if (!nome || !matricula || !email || !curso) return { erro: "Preencha todos os campos obrigatórios." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { erro: "E-mail inválido." };
  if (isNaN(dataNascimento.getTime())) return { erro: "Data de nascimento inválida." };

  return {
    dados: { nome, matricula, email, curso, dataNascimento, telefone: txt(b.telefone) || null },
  };
}