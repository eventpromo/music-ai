import { NextRequest } from "next/server";
import { sunoApiFactory } from "@/lib/services";
import { DEFAULT_MODEL } from "@/lib/SunoApi";
import { options, post } from "@/lib/http/requests";
import { errorResponse, okResponse } from "@/lib/http/responses";

export const dynamic = "force-dynamic";

export const POST = post(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { prompt, make_instrumental, model, wait_audio } = body;
    const sunoApi = await sunoApiFactory.create();

    const audioInfo = await sunoApi.generate(
      prompt,
      Boolean(make_instrumental),
      model || DEFAULT_MODEL,
      Boolean(wait_audio)
    );

    return okResponse(audioInfo);
  } catch (error: any) {
    console.error('Error generating custom audio:', JSON.stringify(error.response.data));
    
    if (error.response.status === 402) {
      return errorResponse({ error: error.response.data.detail }, 402);
    }

    return errorResponse({ error: 'Internal server error: ' + JSON.stringify(error.response.data.detail) }, 500);
  }
});


export { options as OPTIONS };