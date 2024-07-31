import { get, options } from "@/lib/http/requests";
import { errorResponse, okResponse } from "@/lib/http/responses";
import { sunoApiFactory } from "@/lib/services";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export const GET = get(async (req: NextRequest) => {
  const url = new URL(req.url);
  const clipId = url.searchParams.get('id');
  if (clipId == null) {
    return errorResponse({ error: 'Missing parameter id' }, 400);
  }

  const sunoApi = await sunoApiFactory.createBySunoSongId(clipId);
  const audioInfo = await sunoApi.getClip(clipId);

  return okResponse(audioInfo);
});

export { options as OPTIONS };
