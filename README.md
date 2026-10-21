# Technologic — catálogo de séries

Aplicativo Expo/React Native com uma API REST Express e MongoDB. Visitantes consultam séries, episódios e imagens. Usuários cadastrados podem gerenciar o catálogo.

## Pré-requisitos

- Node.js 20 ou superior
- MongoDB local em execução
- Expo Go para abrir o app em um celular, ou um emulador

## Backend

```sh
cd backend
npm install
cp .env.example .env
npm run dev
```

Edite `backend/.env` se necessário. A API usa `mongodb://127.0.0.1:27017/atividade_template` por padrão e inicia na porta `3000`. Verifique em `http://localhost:3000/api/health`.

## Aplicativo

Na raiz do projeto:

```sh
npm install
npx expo start
```

O app usa o endereço de API definido em `expo.extra.apiUrl` no `app.json`. O valor inicial (`http://192.168.15.18:3000/api`) corresponde ao computador usado no desenvolvimento deste projeto. Para testar em outro computador ou rede, altere o endereço para o IP local da máquina que executa a API e reinicie o Expo. Em celular e computador, ambos precisam estar na mesma rede.

Se a porta 3000 já estiver ocupada, ajuste `PORT` no `backend/.env` e inicie o Expo com `EXPO_PUBLIC_API_URL=http://IP_DA_MAQUINA:PORTA/api npx expo start --port 8082`. Essa variável substitui o endereço do `app.json` sem alterar arquivos versionados.

## Rotas principais

| Método | Rota | Acesso | Função |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Público | Criar conta e iniciar sessão |
| POST | `/api/auth/login` | Público | Autenticar e obter token |
| GET | `/api/auth/me` | Autenticado | Consultar usuário da sessão |
| GET | `/api/content?q=termo&category=Séries` | Público | Listar e pesquisar conteúdos |
| GET | `/api/content/:id/image` | Público | Exibir imagem |
| POST | `/api/content` | Autenticado | Cadastrar conteúdo, com imagem opcional |
| PUT | `/api/content/:id` | Autenticado | Alterar conteúdo ou imagem |
| DELETE | `/api/content/:id` | Autenticado | Excluir conteúdo e imagem |

As imagens aceitas são JPG, PNG e WEBP, até 8 MB; ficam armazenadas no MongoDB via GridFS. O token JWT é enviado no cabeçalho `Authorization: Bearer <token>` nas operações administrativas.

## Git

- `origin`: `maiconmaul/AtividadeTemplate` (fork do projeto de atividade)
- `upstream`: `Emerson-Rocha/AtividadeTemplate` (template original)

O `.gitignore` exclui arquivos `.env`, dependências e logs do backend.
