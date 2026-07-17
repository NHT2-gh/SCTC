export class MomoError extends Error {
  constructor(
    public readonly resultCode: number,
    message: string,
  ) {
    super(message);
  }
}
