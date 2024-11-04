# Puma code challange - Arthur Ribeiro

## Descrição

Esse repositório tem como objetivo a resolução do desafio puma code challange.

## Pré-requisitos
- Docker
- Docker Compose
- Node.js
- NPM

## Como instalar e rodar o projeto

- Antes de tudo, certifique-se de que as portas `5432` e `5433` estão disponíveis em sua máquina, pois elas serão utilizadas para rodar o banco de dados de desenvolvimento e de testes.

- Para instalar e rodar o projeto, siga os passos abaixo:

1. Clone o repositório:
```bash
git clone https://github.com/artrsousa1/PUMA-ArthurRibeiro.git
```

2. Instale as dependências do backend:
```bash
cd backend
npm install
```

3. Instale as dependências do frontend:
```bash
cd frontend
npm install
```

4. Inicialize o container do banco de dados e execute as migrations:
```bash
cd backend
# Caso o docker-compose não tenha permissão para criar o volume, execute o comando como sudo ( sudo npm run config )
npm run config
```

5. Inicialize o backend:
```bash
cd backend
npm start
```

6. Inicialize o frontend:
```bash
cd frontend
npm run dev
```

## Rotas

A API desenvolvida possui as seguintes rotas:

```js
router.get('/users', async (req, res) => await userController.getUsers(req,res));

router.post('/users', async (req, res) => await userController.addUser(req,res));

router.delete('/users/:username', async (req, res) => await userController.deleteUser(req,res));

router.patch('/users/:username/toggle-star', async (req, res) => await userController.favoriteUser(req,res));
```

## Testes

Para rodar os testes execute os seguintes comandos:

1. Configuração do ambiente de testes:
```bash
cd backend
# Caso o docker-compose não tenha permissão para criar o volume, execute o comando como sudo ( sudo npm run config:test )
npm run config:test
```
2. Rodar os testes:
```bash
npm run test
```



