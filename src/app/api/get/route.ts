import { get, options, MusicApiRequest } from "@/lib/http/requests";
import { errorResponse, okResponse } from "@/lib/http/responses";

export const dynamic = "force-dynamic";

export const GET = get(async (req: MusicApiRequest) => {
  try {
    const url = new URL(req.url);
    const songIds = url.searchParams.get('ids');
    let audioInfo = [];
    if (songIds && songIds.length > 0) {
      const idsArray = songIds.split(',');
      audioInfo = await req.sunoApi.get(idsArray);
    } else {
      audioInfo = await req.sunoApi.get();
    }

    return okResponse(audioInfo);
  } catch (error) {
    console.error('Error fetching audio:', error);

    return errorResponse({ error: 'Internal server error' }, 500);
  }
});

export { options as OPTIONS };