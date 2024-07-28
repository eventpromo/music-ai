import { NextResponse, NextRequest } from "next/server";
import SunoApi from "@/lib/SunoApi";
import SunoApiFactory from "../services/SunoApiFactory";
import { corsHeaders } from "./corsHeaders";

type RequestHandler = (req: MusicApiRequest) => NextResponse | Promise<NextResponse>;
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';

export interface MusicApiRequest extends NextRequest {
  sunoApi: SunoApi;
}

function createHandler(method: HttpMethod, handler: RequestHandler): RequestHandler {
  return async (req: NextRequest) => {
    if (req.method === method) {
      const musicApiRequest = req as MusicApiRequest;
      musicApiRequest.sunoApi = await SunoApiFactory.getInstance().create();
      
      return await handler(musicApiRequest);
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
