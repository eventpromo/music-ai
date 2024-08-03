import { get, put, post, options } from "@/lib/http/requests";
import { errorResponse, okResponse } from "@/lib/http/responses";
import { sunoUserService } from "@/lib/services";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export const GET = withApiAuthRequired(get(async (req: NextRequest) => {
  const sunoUsers = await sunoUserService.getSunoUsers();

  return okResponse(sunoUsers);
}));

// Update
export const PUT = withApiAuthRequired(put(async (req: NextRequest) => {
  const url = new URL(req.url);
  const sunoUserId = url.searchParams.get('id');

  if (!sunoUserId || sunoUserId.length === 0) {
    return errorResponse({ error: 'Missing parameter userId' }, 400);
  }
  
  const body = await req.json();
  const { status, cookie, creditsLeft } = body;

  const sunoUser = {
    id: sunoUserId,
    status,
    cookie,
    creditsLeft
  };

  await sunoUserService.updateSunoUser(sunoUser);

  return okResponse(sunoUser);
}));

// Create
export const POST = withApiAuthRequired(post(async (req: NextRequest) => {  
  const body = await req.json();
  const { id, status, cookie, creditsLeft } = body;

  const sunoUser = {
    id,
    status,
    cookie,
    creditsLeft
  };

  await sunoUserService.createSunoUser(sunoUser);

  return okResponse(sunoUser);
}));

export { options as OPTIONS };
