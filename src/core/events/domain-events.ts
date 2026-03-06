import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'

type DomainEventCallback = (event: unknown) => void

export class DomainEvents {
  // Mapa de handlers inscritos para cada tipo de evento
  // Ex: {'AnswerCreated': [handler1], [handler2]}
  private static handlersMap: Record<string, DomainEventCallback[]> = {}

  // Lista de agregados que possuem eventos de domínio pendentes
  // Esses eventos ainda não foram despachados
  private static markedAggregates: AggregateRoot<unknown>[] = []

  // Marca um agregado para dispatch
  // Não adiciona duplicado(um agregado pode ter vários eventos)
  public static markAggregateForDispatch(aggregate: AggregateRoot<unknown>) {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id)

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate)
    }
  }

  // Dispara todos os eventos de domínio de uma agregado específico
  // DB vai ser chamado para alterar o [{ready: true}]
  private static dispatchAggregateEvents(aggregate: AggregateRoot<unknown>) {
    aggregate.domainEvents.forEach((event: DomainEvent) => this.dispatch(event))
  }

  // Remove o agregado da lista de agregados marcados após o dispatch
  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<unknown>,
  ) {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate))

    this.markedAggregates.splice(index, 1)
  }

  // Busca um agregado marcado pelo seu ID
  private static findMarkedAggregateByID(
    id: UniqueEntityID,
  ): AggregateRoot<unknown> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id))
  }

  // Usado normalmente após persistência(ex: repository)
  // Dispara os eventos, limpa o agregado e remove ele da fila
  public static dispatchEventsForAggregate(id: UniqueEntityID) {
    const aggregate = this.findMarkedAggregateByID(id)

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate)
      aggregate.clearEvents()
      this.removeAggregateFromMarkedDispatchList(aggregate)
    }
  }

  // Registra um handler para um tipo específico de evento.
  // recebe como parâmetro(A função que eu quero executar, qual evento eu quero ouvir)
  public static register(
    callback: DomainEventCallback,
    eventClassName: string,
  ) {
    const wasEventRegisteredBefore = eventClassName in this.handlersMap

    if (!wasEventRegisteredBefore) {
      this.handlersMap[eventClassName] = []
    }

    this.handlersMap[eventClassName].push(callback)
  }

  // Remove todos os handlers registrados(útil para testes)
  public static clearHandlers() {
    this.handlersMap = {}
  }

  // Limpa todos os agregados marcados(útil para testes)
  public static clearMarkedAggregates() {
    this.markedAggregates = []
  }

  // Dispara um evento individual chamando todos os handlers inscritos
  private static dispatch(event: DomainEvent) {
    const eventClassName: string = event.constructor.name

    const isEventRegistered = eventClassName in this.handlersMap

    if (isEventRegistered) {
      const handlers = this.handlersMap[eventClassName]

      for (const handler of handlers) {
        handler(event)
      }
    }
  }
}
