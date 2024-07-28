import { NextResponse, NextRequest } from "next/server";
import { corsHeaders } from "./corsHeaders";

type RequestHandler = (req: NextRequest) => NextResponse | Promise<NextResponse>;
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';

function createHandler(method: HttpMethod, handler: RequestHandler): RequestHandler {
  return async (req: NextRequest) => {
    if (req.method === method) {
      return await handler(req);
    } else {
      return new NextResponse('Method Not Allowed', {
        headers: {
          Allow: method,
          ...corsHeaders
        },
        status: 405
      });
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
