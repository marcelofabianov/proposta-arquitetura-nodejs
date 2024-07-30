# Proposta de Arquietutura

Este repositório venho apresentar algumas opniões sobre a arquitetura de um projeto de software, que pode ser utilizadas em um projeto que inicialmente será monolítico com módulos desacoplados, mas que futuramente pode ser migrado para uma arquitetura de microserviços.

## Comunicação entre módulos

A comunicação entre os módulos será feita através de eventos assíncronos, utilizando um broker de eventos, como o Kafka utilizando arquitetura de eventos EDA. Para comunicação síncrona entre os módulos, será utilizado o gRPC. No processamento de tarefas em fila, quando o módulo precisar de uma resposta imediata, será utilizado o RabbitMQ.

## Arquitetura dentro de um módulo

Dentro de um módulo, será utilizado a arquitetura Ports and Adapters, onde os componentes do sistema são divididos em três camadas: Application, Domain e Adapter. A camada de Application é responsável por orquestrar as chamadas entre os componentes do sistema, a camada de Domain é responsável por implementar as regras de domínio e a camada de Adapter é abstração de recursos do tipo inbounds e outbounds, como banco de dados, serviços externos, etc.

## Consumidores Externos

Para consumidores externos como SPA, BFF, Mobile, etc, será utilizado uma API Gateway, que será responsável por orquestrar as chamadas entre os módulos e os consumidores externos.
