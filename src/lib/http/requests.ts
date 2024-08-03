import { NextResponse, NextRequest } from "next/server";
import { corsHeaders } from "./corsHeaders";
import { errorResponse } from "./responses";
import { SunoApiError } from "../models/exceptions";
import { queue } from "../queue";
import { CookieInvalidatedEvent } from "../queue/events";

type RequestHandler = (req: NextRequest) => NextResponse | Promise<NextResponse>;
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';

function createHandler(method: HttpMethod, handler: RequestHandler): RequestHandler {
  return async (req: NextRequest) => {
    if (req.method === method) {
      try {
        return await handler(req);
      } catch (error) {
        if (error instanceof SunoApiError) {
          if (error.response?.status === 401 ||
              error.response?.status === 402 || error.response?.status === 403) {
            queue.emit(new CookieInvalidatedEvent({
              sunoUserId: error.sunoUserId,
              noCredits: error.response?.status === 402
            }));
          }

          return errorResponse({
            error: "Cookie is expired or credits are finished",
            details: {
              message: error.response.data?.detail?.message,
              name: error.response.data?.detail?.name,
              stack: error.response.data?.detail?.stack,
            }
          }, error.response.status);
        }

        return errorResponse({ error: 'Internal server error: ', details: error }, 500);
      }
    } else {
      return errorResponse('Method Not Allowed', 405);
    }
  }  
}

export function get(handler: RequestHandler): RequestHandler {
  return createHandler('GET', handler);
}

export function post(handler: RequestHandler): RequestHandler {
  return createHandler('POST', handler);
}

export function put(handler: RequestHandler): RequestHandler {
  return createHandler('PUT', handler);
}

export function del(handler: RequestHandler): RequestHandler {
  return createHandler('DELETE', handler);
}

export function options(request: Request) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
}

export function withRetry(
  handler: RequestHandler,
  retries: number,
  delay: number) {
  
  return async function (req: NextRequest): Promise<NextResponse> {
    for (let i = 0; i < retries; i++) {
      try {
        return await handler(req);
      } catch (error) {
        if (error instanceof SunoApiError) {
          if (i < retries - 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }
        throw error;
      }
    }
    throw new Error('Max retries exceeded');
  };
}