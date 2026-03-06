import { DomainEvent } from "../events/domain-event";
import { DomainEvents } from "../events/domain-events";
import { Entity } from "./entity";

// Quero que todo o agregado tenha uma forma de anotar dentro dele os eventos que aquele agregado disparou 
export abstract class AggregateRoot<Props> extends Entity<Props> {

  // Lista de eventos de domínio gerados por este agregado,
  // ainda não despachados para os handles
  private _domainEvents: DomainEvent[] = []

  // Exposição somente leitura dos eventos do agregado
  get domainEvents(): DomainEvent[] {
    return this._domainEvents
  }

  // Registra um evento de domínio no agregado
  // e marca o agregado para posterior dispatch(envio) dos eventos 
  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent)
    DomainEvents.markAggregateForDispatch(this)
  }

  // Limpa os eventos de domínio após o dispatch
  public clearEvents(){
    this._domainEvents = []
  }
}
