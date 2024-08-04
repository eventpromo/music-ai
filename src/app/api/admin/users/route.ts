import { get, put, post, options } from "@/lib/http/requests";
import { errorResponse, okResponse } from "@/lib/http/responses";
import { sunoUserService } from "@/lib/services";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";

export const dynamic = "force-dynamic";

export const GET = withApiAuthRequired(get(async () => {
  const sunoUsers = await sunoUserService.getSunoUsers();

  return okResponse(sunoUsers);
}));

// Update
export const PUT = withApiAuthRequired(put(async ({ url, body }) => {
  const sunoUserId = url.searchParams.get('id');

  if (!sunoUserId || sunoUserId.length === 0) {
    return errorResponse({ error: 'Missing parameter userId' }, 400);
  }
  
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
export const POST = withApiAuthRequired(post(async({ body }) => {  
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
