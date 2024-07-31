import { options, get } from "@/lib/http/requests";
import { errorResponse, okResponse } from "@/lib/http/responses";
import { InvalidCookieError } from "@/lib/models/exceptions";
import { queue } from "@/lib/queue";
import { CookieInvalidatedEvent } from "@/lib/queue/events";
import { sunoApiFactory } from "@/lib/services";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export const GET = get(async (req: NextRequest) => {
  const url = new URL(req.url);
  const sunoUserId = url.searchParams.get('userId');
  const sunoApi = await sunoApiFactory.createBySunoUserId(sunoUserId);
  const limit = await sunoApi.getCredits();

  return okResponse(limit);
});

export { options as OPTIONS };