import { options, get } from "@/lib/http/requests";
import { errorResponse, okResponse } from "@/lib/http/responses";
import { getCurrentSunoUser, sunoApiFactory } from "@/lib/services";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export const GET = get(async (req: NextRequest) => {
  const url = new URL(req.url);
  const sunoUserId = url.searchParams.get('userId');

  if (!sunoUserId) {
    return errorResponse({ error: 'Missing parameter sunoUserId' }, 400);
  }  

  const currentSunoUser = await getCurrentSunoUser({ sunoUserId: sunoUserId});
  const sunoApi = await sunoApiFactory.createBySunoUser(currentSunoUser);
  const limit = await sunoApi.getCredits();

  return okResponse(limit);
});

export { options as OPTIONS };