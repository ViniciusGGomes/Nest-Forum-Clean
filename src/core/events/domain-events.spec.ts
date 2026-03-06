import { describe, expect, it, vi } from "vitest";
import { AggregateRoot } from "../entities/aggregate-root";
import { UniqueEntityID } from "../entities/unique-entity-id";
import { DomainEvent } from "./domain-event";
import { DomainEvents } from "./domain-events";

// Ele representa um fato que aconteceu no domínio 'uma resposta foi criada no sistema', essa class é a representação de cada objeto que eu tenho dentro da lista de eventos
class CustomAggregateCreated implements DomainEvent {
  public occurredAt: Date;

  // Referência ao agregado que gerou o evento
  private aggregate: CustomAggregate;

  constructor(aggregate: CustomAggregate) {
    // Marca o momento da ocorrência do evento
    this.occurredAt = new Date();
    this.aggregate = aggregate;
  }

  // Retorna o ID do agregado relacionado a esse evento
  // Esse ID é usado pelo DomainEvents para identificar
  // qual agregado disparou o evento
  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id;
  }
}

// Agregado customizado apenas para fins de teste
// Simula um agregado real do domínio(ex: Answer, Question, etc.)
class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null);

    // Registra um evento de domínio no agregado
    // O evento ainda não é despachado aqui,
    // apenas armazenado dentro do agregado e marcado para dispatch
    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

    // Retorna o agregado já com evento pendente
    return aggregate;
  }
}

describe("Domain events", () => {
  it("should be able to to dispatch and listen to events", async () => {
    //Função vazia que retorna informações só quando é chamada
    const callbackSpy = vi.fn();

    // Registra um handler(sub), passo como parâmetros parâmetros(A função que eu quero executar após escutar o evento, qual evento eu quero ouvir)
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

    // Cria o agregado e adiciona um domain event
    const aggregate = CustomAggregate.create();

    // Verifica se o agregado possui um domain event
    expect(aggregate.domainEvents).toHaveLength(1);

    // Dispara os eventos do agregado para que os handlers registrados sejam executados, processo que o DB faz no fluxo, deixa como ready:true
    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    expect(callbackSpy).toHaveBeenCalled();
    expect(aggregate.domainEvents).toHaveLength(0);
  });
});
