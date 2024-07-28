import { get, options } from "@/lib/http/requests";
import { errorResponse, okResponse } from "@/lib/http/responses";
import { SunoApiFactory } from "@/lib/services";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export const GET = get(async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const songIds = url.searchParams.get('ids');
    let audioInfo = [];
    
    if (songIds && songIds.length > 0) {
      const idsArray = songIds.split(',');
      const sunoApi = await SunoApiFactory.getInstance().create();
      audioInfo = await sunoApi.get(idsArray);
    } else {
      console.error('Error fetching audio: Missing parameter ids');

      return errorResponse({ error: 'Missing parameter ids' }, 400);
    }

    return okResponse(audioInfo);
  } catch (error) {
    console.error('Error fetching audio:', error);

    return errorResponse({ error: 'Internal server error' }, 500);
  }
});

export { options as OPTIONS };