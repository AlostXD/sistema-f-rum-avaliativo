# CRUD Acadêmico – Gestão de Alunos (FÓRUM AVALIATIVO)

Sistema web para cadastro de alunos de uma instituição acadêmica (UNIPAM).

## Tecnologias
Next.js, TypeScript, Tailwind CSS, Prisma ORM e PostgreSQL.

## Campos do aluno
Nome, matrícula, e-mail, curso, data de nascimento e telefone.

## Como rodar
1. `npm install`
2. Ajuste p `.env` com a `DATABASE_URL`
3. `npx prisma migrate dev`
4. `npm run dev`
5. Acesse http://localhost:3000

## Rotas da API
| Método | Rota | Ação |
|---|---|---|
| GET | /api/alunos | Lista os alunos |
| POST | /api/alunos | Cadastra um aluno |
| GET | /api/alunos/:id | Busca um aluno |
| PUT | /api/alunos/:id | Atualiza um aluno |
| DELETE | /api/alunos/:id | Exclui um aluno |