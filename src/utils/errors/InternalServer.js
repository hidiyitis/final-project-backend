export class InternalServer extends Error{
  constructor(message) {
    super(message||'Internal Server Error');
  }
}