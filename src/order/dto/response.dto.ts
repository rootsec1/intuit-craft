export class ResponseDTO {
  status?: Status;

  message?: string = '';

  error?: string = '';

  setStatus(status: Status): ResponseDTO {
    this.status = status;
    return this;
  }

  setMessage(message: string): ResponseDTO {
    this.message = message;
    return this;
  }

  setError(error: string): ResponseDTO {
    this.error = error;
    return this;
  }
}

export enum Status {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}
