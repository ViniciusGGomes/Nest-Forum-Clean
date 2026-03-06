import { UniqueEntityID } from '../entities/unique-entity-id'
 
export interface DomainEvent {
  occurredAt: Date
  getAggregateId(): UniqueEntityID
}

// É o contrato de um evento de domínio, que as classes vão extender.