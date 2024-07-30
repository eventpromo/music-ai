import { options, get } from "@/lib/http/requests";
import { errorResponse, okResponse } from "@/lib/http/responses";
import { sunoApiFactory } from "@/lib/services";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export const GET = get(async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const sunoUserId = url.searchParams.get('userId');
    const sunoApi = await sunoApiFactory.createBySunoUserId(sunoUserId);
    const limit = await sunoApi.get_credits();

    return okResponse(limit);
  } catch (error) {
    console.error('Error fetching limit:', error);

    return errorResponse({ error: 'Internal server error. ' + error }, 500);
  }
});

export { options as OPTIONS };