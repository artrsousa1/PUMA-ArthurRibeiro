# Puma code challange - Arthur Ribeiro

## Pré-requisitos
- Docker
- Docker Compose
- Node.js
- NPM

## Como instalar e rodar o projeto

Para instalar e rodar o projeto, siga os passos abaixo:

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
# No diretório backend execute:
# Caso o docker-compose não tenha permissão para criar o volume, execute o comando como sudo ( sudo npm run config)
npm run config
```

5. Inicialize o backend:
```bash
# No diretório backend execute:
npm start
```

6. Inicialize o frontend:
```bash
# No diretório frontend execute:
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
# No diretório backend execute:
npm run config:test
```
2. Rodar os testes:
```bash
# No diretório backend execute:
npm run test
```



