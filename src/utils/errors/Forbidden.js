export class Forbidden extends Error{
  constructor(message) {
    super(message||'Forbidden')
  }
}