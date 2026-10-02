// Pulls the 11-character video ID out of any common YouTube link format.
function videoId(url) {
  const match = url.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
  return match?.[1] ?? (/^[\w-]{11}$/.test(url) ? url : null);
}

export default function YouTubeVideo({ url, title }) {
  const id = url ? videoId(url) : null;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-neutral-800 shadow-2xl ring-1 ring-white/10">
      {id ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-neutral-400">
          <div className="flex h-16 w-24 items-center justify-center rounded-2xl bg-red-600 text-3xl text-white">
            ▶
          </div>
          <p className="text-sm">ভিডিও শিগগিরই আসছে</p>
        </div>
      )}
    </div>
  );
}
