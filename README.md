# Proposta de Arquietutura

Este repositório venho apresentar algumas opniões sobre a arquitetura de um projeto de software, que pode ser utilizadas em um projeto que inicialmente será monolítico com módulos desacoplados, mas que futuramente pode ser migrado para uma arquitetura de microserviços.

## Comunicação entre módulos

A comunicação entre os módulos será feita através de eventos assíncronos, utilizando um broker de eventos, como o Kafka utilizando arquitetura de eventos EDA. Para comunicação síncrona entre os módulos, será utilizado o gRPC. No processamento de tarefas em fila, quando o módulo precisar de uma resposta imediata, será utilizado o RabbitMQ.

## Arquitetura dentro de um módulo

Dentro de um módulo, será utilizado a arquitetura Ports and Adapters, onde os componentes do sistema são divididos em três camadas: Application, Domain e Adapter. A camada de Application é responsável por orquestrar as chamadas entre os componentes do sistema, a camada de Domain é responsável por implementar as regras de domínio e a camada de Adapter é abstração de recursos do tipo inbounds e outbounds, como banco de dados, serviços externos, etc.

## Consumidores Externos

Para consumidores externos como SPA, BFF, Mobile, etc, será utilizado uma API Gateway, que será responsável por orquestrar as chamadas entre os módulos e os consumidores externos.

## Estrutura de diretórios

```bash
.
src
├── api
│   └── v1
│       ├── gen
│       └── proto
├── config
│   └── env.ts
├── main.ts
├── modules
│   ├── _core
│   │   ├── domain
│   │   │   ├── base-entity.ts
│   │   │   └── error.ts
│   │   ├── error-handle.ts
│   │   ├── infrastructure
│   │   │   ├── database.ts
│   │   │   └── error.ts
│   │   └── tests
│   └── identity-gateway
│       ├── adapter
│       │   ├── inbound
│       │   │   ├── grpc
│       │   │   │   └── user_server.ts
│       │   │   └── kafka
│       │   │       └── consumer.ts
│       │   └── outbound
│       │       ├── kafka
│       │       │   └── producer.ts
│       │       └── postgres
│       │           └── user-repository.ts
│       ├── application
│       │   ├── service
│       │   │   └── user-service.ts
│       │   └── usecase
│       │       └── create-user.ts
│       ├── domain
│       │   ├── error
│       │   │   └── user_error.ts
│       │   ├── event
│       │   │   └── user_created.ts
│       │   └── user.ts
│       ├── port
│       │   ├── inbound
│       │   │   └── user.ts
│       │   └── outbound
│       │       └── user.ts
│       └── tests
│           ├── e2e
│           ├── integration
│           └── unit
├── server.ts
└── services
    ├── audit
    │   └── audit.ts
    ├── database
    │   ├── pg-pool.ts
    │   └── postgres.ts
    ├── event-broker
    │   └── kafka.ts
    ├── grpc
    │   └── server.ts
    ├── hasher
    │   └── argo2-hasher.ts
    ├── identity-provider
    │   └── keycloak.ts
    ├── logger
    │   └── log4js.ts
    ├── message-broker
    │   └── rabbitmq.ts
    ├── metrics
    │   └── metrics.ts
    └── tracing
        └── tracing.ts
storage
├── certs
└── logs
tests
└── testcontainers
    └── postgres.ts
```
