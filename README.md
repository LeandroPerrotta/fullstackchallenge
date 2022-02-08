# Instruções para instalação

Live demo: http://leandro-perrotta.ddns.net:4200/

## Configuração banco Postgres (backend)

Alterar o arquivo backend/db_pgsql.js para os dados de seu banco ou imagem.

## Backend

`npm install`

`npm start`

## Frontend

`npm install`

`npm install -g ember-cli`

`ember serve`

## Tecnologias utilizadas backend

- Node.js
- Express
- pg (conector Pgsql)
- fetch (para comunicação com a API publica dos veiculos)

## Tecnologias utizadas no frontend 

- Ember JS
- Ember-Table (apenas visualização)
- EasyUI (UI para o Datagrid CRUD)
- Bootstrap
