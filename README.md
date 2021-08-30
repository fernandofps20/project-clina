## Requisitos

NodeJS, NestJS, PostgreSQL, Insomnia

## Description

Projeto Clina para agendamento de horarios

## Instalação


$ npm install


## Primeiros Passos

Após todos os requisitos instalados, preencha os valores da variavel de ambiente .env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

Logo após, importe o arquivo ClinaInsomnia.json de rotas no insomnia para testar, e executar o programa.
OBS: É necessário criar um usuário para executar as rotas conforme insomnia, não é necessário autenticação para criar usuário.

OBS: Deverá ser inserido os dados nesta sequencia: Usuário -> Sala -> Agendamento.

# Rotas

## User

Create User: Cadastra usuário
Update User Avatar: Insere uma avatar no usuário cadastrado, id do usuário deverá ser informado na rota e upload da imagem deverá ser feita no insomnia.

## Auth

Auth: Esta é a rota de autenticação de usuário, e seu retorno é o access_token utilizado para validar as consultas, ao efetuar o login é necessario inserir o token na variavel de ambiente do insomnia.

## Schedules

Post Schedules: Está é a rota de agendamento de sala, É nessesário informar o id do usuário e o id da sala que será reservada, e para isso ambas devem ser criadas via insomnia conforme corpo em JSON.

ATENÇÃO: Existem dois atribudos de reserva, 'period' para agendar um período especifico (manhã = 'M', tarde='T', noite='N' e o dia todo='A'), e 'interval' para agendar um horário especifico: 9 às 10, ou 21 às 22.
Quando o atributo 'period' é preenchido, 'interval' deve estar vazio e vice-versa.
Os valores de interval são os descritos abaixo e devem ser preenchidos desta forma:
interval: '8-9', '9-10', '10-11', '11-12'
interval: '14-15', '15-16', '16-17', '17-18'
interval: '18-19', '19-20', '20-21', '21-22'

DEVE SER PREENCHIDO COM APENAS UM DOS VALORES DE HORÁRIO

Por ultimo informar a data que deseja realizar o agendamento no formato descrito conforme corpo JSON no insomnia.

## Rooms
Post Room: Cadastra uma sala.
Get Rooms: Lista todas as salas cadastradas.
Get Room: Lista uma sala cadastrada, id da sala deverá ser informada na rota
Get Available Rooms Per Date: Lista todas as salas disponiveis na data determinada conforme insomnia.
Update Room Image: Insere uma imagem na sala cadastrada, id da sala deverá ser informada na rota e upload da imagem deverá ser feita no insomnia.

## Rodando o app

$ npm run start

## OBS
Devido o curto espaço de tempo, nem todos os erros foram validados, por gentileza realizar os testes conforme documentação.