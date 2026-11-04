export type ApiFailure = {
  status: number;
  message: string;
  errors: Record<string, string[]>;
  retryAfter: number | null;
};

export class ApiError extends Error {
  readonly status: number;
  readonly errors: Record<string, string[]>;
  readonly retryAfter: number | null;

  constructor(failure: ApiFailure) {
    super(failure.message);
    this.name = "ApiError";
    this.status = failure.status;
    this.errors = failure.errors;
    this.retryAfter = failure.retryAfter;
  }
}

export class ApiContractError extends Error {
  constructor(message = "A resposta da API não segue o contrato esperado.") {
    super(message);
    this.name = "ApiContractError";
  }
}

export class ApiUnavailableError extends Error {
  constructor(
    message = "A loja não conseguiu falar com o servidor. Tente de novo em instantes.",
  ) {
    super(message);
    this.name = "ApiUnavailableError";
  }
}

export function failureCopy(failure: ApiFailure): {
  title: string;
  detail: string;
} {
  switch (failure.status) {
    case 401:
      return { title: "Acesso não autorizado.", detail: failure.message };
    case 403:
      return {
        title: "Sem permissão para esta ação.",
        detail: failure.message,
      };
    case 404:
      return {
        title: "Não encontramos o que você pediu.",
        detail: failure.message,
      };
    case 409:
      return { title: "Não foi possível continuar.", detail: failure.message };
    case 422:
      return {
        title: "Os dados enviados são inválidos.",
        detail: failure.message,
      };
    case 429:
      return {
        title: "Muitas tentativas.",
        detail:
          failure.retryAfter === null
            ? "Espere um pouco antes de tentar de novo."
            : `Espere ${failure.retryAfter} segundos antes de tentar de novo.`,
      };
    default:
      return {
        title: "Não foi possível concluir agora.",
        detail:
          failure.status >= 500
            ? "O servidor não concluiu a solicitação."
            : failure.message,
      };
  }
}
