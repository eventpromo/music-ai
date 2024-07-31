import { get, options } from "@/lib/http/requests";
import { errorResponse, okResponse } from "@/lib/http/responses";
import { sunoApiFactory } from "@/lib/services";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export const GET = get(async (req: NextRequest) => {
  const url = new URL(req.url);
  const songIds = url.searchParams.get('ids');
  let audioInfo = [];
  
  if (!songIds || songIds.length === 0) {
    return errorResponse({ error: 'Missing parameter ids' }, 400);
  }
  
  const idsArray = songIds.split(',');
  const sunoApi = await sunoApiFactory.createBySunoSongId();
  audioInfo = await sunoApi.get(idsArray);

  return okResponse(audioInfo);
});

export { options as OPTIONS };