"use client";

import { useCallback, useEffect, useState } from "react";

type Aluno = {
  id: number;
  nome: string;
  matricula: string;
  email: string;
  curso: string;
  dataNascimento: string;
  telefone: string | null;
};

const CURSOS = [
  "Análise e Desenvolvimento de Sistemas",
  "Ciência da Computação",
  "Engenharia de Software",
  "Sistemas de Informação",
];

const VAZIO = { nome: "", matricula: "", email: "", curso: "", dataNascimento: "", telefone: "" };

const campo =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [form, setForm] = useState(VAZIO);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    const res = await fetch("/api/alunos");
    setAlunos(await res.json());
    setCarregando(false);
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function mudar(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function cancelar() {
    setForm(VAZIO);
    setEditandoId(null);
    setErro("");
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    const res = await fetch(editandoId ? `/api/alunos/${editandoId}` : "/api/alunos", {
      method: editandoId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setErro(data.erro ?? "Erro ao salvar.");
      return;
    }

    cancelar();
    carregar();
  }

  function editar(a: Aluno) {
    setEditandoId(a.id);
    setErro("");
    setForm({
      nome: a.nome,
      matricula: a.matricula,
      email: a.email,
      curso: a.curso,
      dataNascimento: a.dataNascimento.slice(0, 10),
      telefone: a.telefone ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function excluir(a: Aluno) {
    if (!confirm(`Excluir o aluno ${a.nome}?`)) return;
    await fetch(`/api/alunos/${a.id}`, { method: "DELETE" });
    if (editandoId === a.id) cancelar();
    carregar();
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8">
        <header>
          <h1 className="text-3xl font-bold">Gestão de Alunos</h1>
          <p className="text-sm text-gray-500">Cadastro, consulta, edição e exclusão de alunos.</p>
        </header>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">{editandoId ? "Editar aluno" : "Novo aluno"}</h2>

          <form onSubmit={salvar} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input className={campo} name="nome" placeholder="Nome completo" value={form.nome} onChange={mudar} required />
            <input className={campo} name="matricula" placeholder="Matrícula" value={form.matricula} onChange={mudar} required />
            <input className={campo} name="email" type="email" placeholder="E-mail" value={form.email} onChange={mudar} required />

            <select className={campo} name="curso" value={form.curso} onChange={mudar} required>
              <option value="" disabled>Selecione o curso</option>
              {CURSOS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <input className={campo} name="dataNascimento" type="date" value={form.dataNascimento} onChange={mudar} required />
            <input className={campo} name="telefone" placeholder="Telefone (opcional)" value={form.telefone} onChange={mudar} />

            {erro && (
              <p className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700 sm:col-span-2 lg:col-span-3">
                {erro}
              </p>
            )}

            <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                {editandoId ? "Salvar alterações" : "Cadastrar"}
              </button>
              {editandoId && (
                <button
                  type="button"
                  onClick={cancelar}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-300"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Alunos cadastrados ({alunos.length})</h2>

          {carregando ? (
            <p className="mt-4 text-gray-500">Carregando...</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    {["Nome", "Matrícula", "E-mail", "Curso", "Nascimento", "Telefone", "Ações"].map((t) => (
                      <th key={t} className="px-3 py-2 font-semibold">{t}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {alunos.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium">{a.nome}</td>
                      <td className="px-3 py-2">{a.matricula}</td>
                      <td className="px-3 py-2">{a.email}</td>
                      <td className="px-3 py-2">{a.curso}</td>
                      <td className="px-3 py-2">
                        {new Date(a.dataNascimento).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                      </td>
                      <td className="px-3 py-2">{a.telefone ?? "-"}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => editar(a)}
                            className="rounded-md bg-gray-200 px-3 py-1 text-xs font-medium text-gray-800 transition hover:bg-gray-300"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => excluir(a)}
                            className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-red-700"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {alunos.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-3 py-6 text-center text-gray-500">
                        Nenhum aluno cadastrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}