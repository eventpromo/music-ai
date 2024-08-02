import { sunoSongService } from "@/lib/services";
import Section from "../../components/Section";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(async function AdminSongs() {
  const sunoSongs = await sunoSongService.getSunoSongs();

  return (
    <Section className="my-10 flex flex-col w-full gap-4">
      <article className="prose lg:prose-lg max-w-4xl">          
        <h1 className="text-xl text-indigo-900 text-center flex">Suno Songs: </h1>
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
      </article>
    </Section>
  );
}, { returnTo: '/' });