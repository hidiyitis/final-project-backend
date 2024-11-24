export class BadRequest extends Error{
  constructor(message) {
    super(message||'Bad Request')
  }
}