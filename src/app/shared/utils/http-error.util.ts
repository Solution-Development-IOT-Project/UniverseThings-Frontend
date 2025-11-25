import { HttpErrorResponse } from '@angular/common/http';

type DetailItem = {
  msg?: string;
  message?: string;
  detail?: string;
};

export function extractHttpErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (error instanceof HttpErrorResponse) {
    const detail = error.error?.detail ?? error.error?.message ?? error.error?.error;

    if (typeof detail === 'string' && detail.trim().length > 0) {
      return detail;
    }

    if (Array.isArray(detail)) {
      const combined = detail
        .map((item: DetailItem) => item?.msg ?? item?.message ?? item?.detail)
        .filter((value): value is string => Boolean(value));

      if (combined.length > 0) return combined.join(' | ');
    }

    if (typeof error.error === 'string' && error.error.trim().length > 0) {
      return error.error;
    }

    if (error.message) {
      return error.message;
    }
  } else if (error && typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string') {
    return (error as any).message;
  }

  return fallback;
}
