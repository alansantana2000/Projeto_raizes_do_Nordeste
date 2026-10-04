# Raízes do Nordeste - API RESTful

API RESTful para sistema de autoatendimento multicanal (App, Totem, Balcão, Pickup, Web), desenvolvida como Projeto Multidisciplinar (Trilha Back-End).

## 🛠 Tecnologias Utilizadas
- Node.js + Express (Servidor HTTP)
- TypeScript (Tipagem forte)
- Prisma ORM (Modelagem e manipulação do banco de dados)
- PostgreSQL / Supabase** (Banco de dados relacional)
- JWT & Bcrypt (Autenticação, Hash de senhas e LGPD)
- Swagger UI (Documentação interativa)

## 📁 Organização do Projeto (Arquitetura)
- `/src/API`: Controladores, Rotas e Middlewares de Segurança (Interface).
- `/src/Infrastructure`: Configuração de conexão ao banco de dados (Prisma).
- `/docs`: Diagramas (Casos de Uso, DER) e a Coleção do Postman para testes (`.json`).
- `prisma/schema.prisma`: Modelagem do Domínio (Tabelas, Relações e Enums como `CanalPedido`).

## 🚀 Como executar o projeto localmente

### Pré-requisitos
- Node.js instalado (v18+).
- Conta no Supabase (ou instância local do PostgreSQL).

### Passo a passo
1. **Clone o repositório:**
   ```bash
   git clone https://github.com/alansantana2000/Projeto_raizes_do_Nordeste.git