# Estudos Microsserviços Docker

Estudos de microserviço em Node.js rodando em containers Docker.

Este projeto simula uma infraestrutura de saúde municipal para gestão de pacientes, utilizando uma arquitetura de microserviços robusta, segura e escalonável.

O objetivo foi aplicar conceitos avançados de **Docker**, **Orquestração de Containers**, **API Gateway**, e **Escalonamento Horizontal**, garantindo que o prontuário eletrônico seja resiliente a falhas e picos de tráfego.

## 🏗️ Arquitetura do Sistema

A solução é composta por 4 serviços principais trabalhando em conjunto dentro de uma rede isolada:

1.  **API Gateway (Porta 4000):** O único ponto de entrada para o mundo exterior. Responsável pelo roteamento de tráfego e validação de tokens de segurança.
2.  **Auth-Service (Interno):** Serviço guardião que valida credenciais e emite tokens de acesso.
3.  **Patient-Service (Escalonado):** Serviço que lida com os dados médicos. Rodando com **3 instâncias (clones)** para garantir alta disponibilidade.
4.  **PostgreSQL (Persistência):** Banco de dados relacional para armazenamento seguro dos pacientes, utilizando volumes Docker para persistência de dados.



## 🛠️ Tecnologias Utilizadas

* **Linguagem:** Node.js (v18+)
* **Containers:** Docker & Docker Compose
* **Banco de Dados:** PostgreSQL 15
* **Segurança:** Autenticação via Token Bearer
* **Infraestrutura:** Load Balancing (Round-Robin nativo do Docker)

## 🚀 Etapas do Desenvolvimento

1.  **Criação dos Microserviços:** Desenvolvimento de APIs independentes em Node.js utilizando apenas módulos nativos para máxima eficiência.
2.  **Conteinerização:** Escrita de `Dockerfiles` otimizados (baseados em Alpine Linux) para cada serviço.
3.  **Orquestração com Docker Compose:** Configuração da rede interna, variáveis de ambiente e volumes para o banco de dados.
4.  **Implementação do API Gateway:** Criação de um ponto centralizado para evitar a exposição direta de serviços sensíveis.
5.  **Persistência Real:** Integração com PostgreSQL, substituindo dados em memória por consultas SQL reais.
6.  **Escalonamento Horizontal:** Configuração de múltiplas réplicas do serviço de pacientes, transformando o Gateway em um Balanceador de Carga.

## 🏁 Como Rodar o Projeto

1.  **Clonar o repositório:**
    ```bash
    git clone https://github.com/Sxmvel/Estudos-Microsservicos-Docker.git
    ```

2.  **Subir a infraestrutura:**
    ```bash
    docker compose up -d --build
    ```

3.  **Testar o Fluxo:**
    * **Login (Obter Token):** `POST http://localhost:4000/login` (Body: email/senha).
    * **Cadastrar Paciente:** `POST http://localhost:4000/paciente` (Com o Token no Header).
    * **Listar Pacientes:** `GET http://localhost:4000/paciente` (Veja o balanceamento de carga nos IDs dos containers no JSON de resposta).

## 📈 Aprendizados Adquiridos

* Comunicação síncrona entre serviços em rede Docker.
* Diferença entre Escalonamento Vertical vs Horizontal.
* Segurança de dados sensíveis (Ocultação de portas internas).
* Manutenção de estado em containers através de Volumes.

---
Desenvolvido por **Samuel Resende Silva** | Estudante de Sistemas de Informação - IFMG.