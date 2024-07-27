import { options, get, MusicApiRequest } from "@/lib/http/requests";
import { errorResponse, okResponse } from "@/lib/http/responses";

export const dynamic = "force-dynamic";

export const GET = get(async (req: MusicApiRequest) => {
  try {      
    const limit = await req.sunoApi.get_credits();

    return okResponse(limit);
  } catch (error) {
    console.error('Error fetching limit:', error);

    return errorResponse({ error: 'Internal server error. ' + error }, 500);
  }
});

export { options as OPTIONS };