import { sunoSongService } from "@/lib/services";
import Section from "../../components/Section";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(async function AdminSongs() {
  const sunoSongs = await sunoSongService.getSunoSongs();

  return (
    <div className="flex flex-col w-full gap-4">
      <Section><h1 className="font-medium text-xl text-indigo-900 flex items-center">Suno Songs</h1></Section>
      <div className="flex flex-col w-full justify-center items-center gap-4">
          {sunoSongs.map((song) => (
            <div key={song.id} className="flex flex-col gap-1">
              <div>
                <strong>Suno User Id: </strong> {song.sunoUserId}
              </div>
              <div>
                <strong>Song Id: </strong> {song.id}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}, { returnTo: '/' });