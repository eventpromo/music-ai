import { NextRequest } from "next/server";
import { sunoApiFactory } from "@/lib/services";
import { options, post } from "@/lib/http/requests";
import { errorResponse, okResponse } from "@/lib/http/responses";

export const dynamic = "force-dynamic";

export const POST = post(async (req: NextRequest) => {
  try {
    const body = await req.json();    
    const { clip_id } = body;

    if (!clip_id) {
      return errorResponse({ error: 'Clip id is required' }, 400);
    }

    const sunoApi = await sunoApiFactory.create(clip_id);
    const audioInfo = await sunoApi.concatenate(clip_id);
    
    return okResponse(audioInfo);
  } catch (error: any) {
    console.error('Error generating concatenating audio:', error.response.data);
    
    if (error.response.status === 402) {
      return errorResponse({ error: error.response.data.detail }, 402);
    }

    return errorResponse({ error: 'Internal server error' }, 500);
  }
});

export { options as OPTIONS };
