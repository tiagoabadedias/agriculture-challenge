# API de Gestão de Fazendas e Colheitas

API desenvolvida em NestJS para gerenciamento de fazendas, produtores rurais, culturas plantadas e colheitas. API foi desenvolvida utilizando o framework NestJS, com TypeORM para acesso ao banco de dados PostgreSQL, e conta com integração via Docker para facilitar a execução local.

## Foi separado o projeto na pasta API e os serviços utilizando docker na pasta SERVICES



## Tecnologias Utilizadas

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- Docker + Docker Compose
- Swagger (documentação automática da API)
- Jest (Testes)
- Winston Logging (monitoramento e logs)


## Pré-requisitos

- Node.js 20.x
- Docker e Docker Compose
- npm ou yarn

## Instalação e Execução

### Usando Docker (Recomendado)

1. Clone o repositório
2. Na pasta `services`, execute:
```bash
docker-compose up --build
```

Isso vai:

- Subir o container do **PostgreSQL**
- Subir o container da **API NestJS**
- Criar a rede entre eles
- Garantir que a API só inicie depois que o banco estiver pronto


A API estará disponível em `http://localhost:3000`

### Desenvolvimento Local

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=meuusuario
DB_PASSWORD=minhasenha
DB_DATABASE=meubanco
```

3. Execute o projeto:
```bash
npm run start:dev
```

## Testes

### Testes Unitários
```bash
npm run test
```

### Cobertura de Testes
```bash
npm run test:cov
```


## Estrutura do Projeto
API
- `src/modules/` - Módulos da aplicação
  - `farms/` - Gestão de fazendas
  - `producers/` - Gestão de produtores
  - `planted-cultures/` - Gestão de culturas plantadas
  - `harvests/` - Gestão de colheitas
- `src/common/` - Código compartilhado (exceções, logging, etc)
- `src/config/` - Configurações da aplicação

Services
- `docker-compose.yml` - Arquivo para subir ambiente

- 

## Detalhamento das Entidades e Relacionamentos

| Entidade            | Campos principais                                                         | Relacionamento |
| ---                 | ---                                                                       | --- |
| **Producer**        | id, name, document, createdAt, updatedAt                                  | 1 Producer pode ter várias Farms |
| **Farm**            | id, name, city, state, totalArea, arableArea, vegetationArea, producerId  | Cada Farm pertence a 1 Producer. |
| **PlantedCulture**  | id, name, area, farmId, harvestId                                         | Cada PlantedCulture pertence a 1 Farm e 1 Harvest |
| **Harvest**         | id, name, harvestYear, createdAt, updatedAt                               | 1 Harvest pode ter várias PlantedCultures |


## Documentação da API

A documentação Swagger estará disponível em `http://localhost:3000/api` quando a aplicação estiver em execução. 


## Cobertura de código dos testes

A cobertura de código fica disponível no HTML dentro de `api/coverage/lcov-report/index.html`. 
