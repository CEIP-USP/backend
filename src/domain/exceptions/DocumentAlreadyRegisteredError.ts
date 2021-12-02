import { IDocument } from '../profile';

export class DocumentAlreadyRegisteredError extends Error {
  constructor(private document: IDocument) {
    super(`document already registered:  ${document?.type} ${document?.value}`);
  }
}
