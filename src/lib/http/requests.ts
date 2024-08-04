import { NextResponse, NextRequest } from "next/server";
import { corsHeaders } from "./corsHeaders";
import { errorResponse } from "./responses";
import { SunoApiError } from "../models/exceptions";
import { queue } from "../queue";
import { CookieInvalidatedEvent } from "../queue/events";
import pino from "pino";

type RequestHandler = (req: SunoApiRequest) => NextResponse | Promise<NextResponse>;
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
type RequestHandlerOptions = {
  retries: number,
  delay: number
}
export type SunoApiRequest = {
  url: URL,
  body: any
}

const HttpErrorCodes = [
  401, // Unauthorized
  402, // Payment Required
  403 // Forbidden
];

const logger = pino();

async function readBody(req: NextRequest) {
  const contentLength = req.headers.get('content-length');
  
  if (contentLength && parseInt(contentLength, 10) > 0) {
    try {
      return await req.json();
    } catch (error: any) {
      logger.error(`Failed to parse request body: ${error.message}`, { error });
      throw error;
    }
  }

  return {};
}

async function allowedHandler(req: NextRequest, handler: RequestHandler, options?: RequestHandlerOptions) {
  const { retries, delay } = options || { retries: 1, delay: 0 };
  let lastError: any;

  const sunoApiRequest = {
    url: new URL(req.url),
    body: await readBody(req),
  };
  
  for (let i = 0; i < retries; i++) {
    try {
      return await handler(sunoApiRequest);
    }
    catch (error: any) {
      lastError = error;

      logger.error(`Attempt ${i + 1} failed: ${error.message}`, { error });

      if (error instanceof SunoApiError) {          
        if (HttpErrorCodes.includes(error.response?.status)) {
          queue.emit(new CookieInvalidatedEvent({
            sunoUserId: error.sunoUserId,
            noCredits: error.response.status === 402
          }));
        }
      }

      if (i < retries - 1 && delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  logger.error(`All ${retries} attempts failed: ${lastError.message}`, { lastError });

  return errorResponse({
    error: lastError?.message ? `Something went wrong: ${lastError?.message}` : 'Server error',
    details: {
      message: lastError.response?.data?.detail?.message,
      name: lastError.response?.data?.detail?.name,
      stack: lastError.response?.data?.detail?.stack,
    }
  }, lastError?.response?.status || 500);
}

function createHandler(method: HttpMethod, handler: RequestHandler, options?: RequestHandlerOptions) {
  return async (req: NextRequest) => {
    if (req.method === method) {
      return await allowedHandler(req, handler, options);
    } else {
      return errorResponse('Method Not Allowed', 405);
    }
  }  
}

export function get(handler: RequestHandler, options?: RequestHandlerOptions) {
  return createHandler('GET', handler, options);
}

export function post(handler: RequestHandler, options?: RequestHandlerOptions) {
  return createHandler('POST', handler, options);
}

export function put(handler: RequestHandler, options?: RequestHandlerOptions) {
  return createHandler('PUT', handler, options);
}

export function del(handler: RequestHandler, options?: RequestHandlerOptions) {
  return createHandler('DELETE', handler, options);
}

export function options(request: Request) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
}
