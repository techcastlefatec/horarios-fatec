# Estrutura do Projeto

| Diretório/Arquivo | Descrição                                           |
|-------------------|-----------------------------------------------------|
| `src/`            | Código-fonte para o funcionamento do servidor       |
| `config/`         | Arquivos de configuração do servidor                |
| `controllers/`    | Arquivos que controlam o fluxo de dados e lógica    |
| `models/`         | Modelos para representar as entidades de dados      |
| `routes/`         | Arquivos que definem as rotas das páginas           |
| `db/`             | Arquivos SQL                                        |
| `package.json`    | Dependências e scripts                              |

---

# Rotas

## Professores - Público

| Método | Rota       | Descrição                          |
|--------|------------|------------------------------------|
| GET    | `/`        | Lista todos os professores         |
| GET    | `/:id`     | Lista um professor pelo seu ID     |

## Quadro - Público

| Método | Rota               | Descrição                         |
|--------|--------------------|-----------------------------------|
| GET    | `/:turma_id`       | Lista uma turma pelo seu ID       |

## Salas

| Método | Rota                             | Descrição                                |
|--------|----------------------------------|------------------------------------------|
| GET    | `/:sala_id/aulas-hoje`           | Lista as aulas de hoje na sala especificada |

---

# Dependências Utilizadas

| Pacote     | Versão   | Tipo                 |
|------------|----------|----------------------|
| `cors`     | 2.8.5    | Dependência comum    |
| `dotenv`   | 16.5.0   | Dependência comum    |
| `express`  | 5.1.0    | Dependência comum    |
| `pg`       | 8.15.2   | Dependência comum    |
| `nodemon`  | 3.1.10   | Dependência de desenvolvimento |

---

# Comandos para Utilização

1. Abra o terminal do VS Code  
2. Digite `git clone` com o URL do projeto no GitHub  
3. Digite `cd horarios-fatec/server` (se já estiver na pasta `server`, pule esta etapa)  
4. Digite `npm install` para instalar as dependências necessárias  
5. Crie um arquivo `.env` para a conexão com o banco de dados e cole a URL fornecida  
6. Digite `npm start`  
7. Acesse a URL `localhost:3000` no navegador  

