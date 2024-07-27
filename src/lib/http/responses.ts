import { NextResponse } from "next/server";
import { corsHeaders } from "./corsHeaders";

export function okResponse<TData>(data: TData) {
  return new NextResponse(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

export function errorResponse<TData>(data: TData, status = 500) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}