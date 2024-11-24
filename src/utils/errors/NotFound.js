export class NotFound extends Error{
  constructor(message) {
    super(message||'Not Found')
  }
}