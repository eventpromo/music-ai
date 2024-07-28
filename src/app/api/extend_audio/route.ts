import { NextRequest } from "next/server";
import { sunoApiFactory, sunoSongService } from "@/lib/services";
import { DEFAULT_MODEL } from "@/lib/SunoApi";
import { options, post } from "@/lib/http/requests";
import { errorResponse, okResponse } from "@/lib/http/responses";

export const dynamic = "force-dynamic";

export const POST = post(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { audio_id, prompt, continue_at, tags, title, model } = body;

    if (!audio_id) {
      return errorResponse({ error: 'Audio id is required' }, 400);
    }

    const sunoApi = await sunoApiFactory.create(audio_id);
    const sunoSongInfo = await sunoApi.extendAudio(
      audio_id,
      prompt,
      continue_at,
      tags,
      title,
      model || DEFAULT_MODEL
    );

    const sunoSong = {
      id: sunoSongInfo.id,
      sunoUserId: sunoApi.currentUserId
    };
    await sunoSongService.createSunoSong(sunoSong);

    return okResponse(sunoSongInfo);
  } catch (error: any) {
    console.error('Error extend audio:', JSON.stringify(error.response.data));
    
    if (error.response.status === 402) {
      return errorResponse({ error: error.response.data.detail }, 402);
    }
      
    return errorResponse({ error: 'Internal server error: ' + JSON.stringify(error.response.data.detail) }, 500);
  }
});

export { options as OPTIONS };