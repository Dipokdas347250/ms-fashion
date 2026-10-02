// Pulls the 11-character video ID out of any common YouTube link format.
function videoId(url) {
  const match = url.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
  return match?.[1] ?? (/^[\w-]{11}$/.test(url) ? url : null);
}

export default function YouTubeVideo({ url, title }) {
  const id = url ? videoId(url) : null;
  const vertical = url?.includes("/shorts/");

  // Browsers only allow autoplay when muted; viewers can tap to unmute.
  // `loop` needs `playlist` set to the same ID to repeat a single video.
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: id ?? "",
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
  });

  return (
    <div
      className={`relative mx-auto overflow-hidden rounded-2xl bg-neutral-800 shadow-2xl ring-1 ring-white/10 ${
        vertical ? "aspect-9/16 w-full max-w-sm" : "aspect-video w-full"
      }`}
    >
      {id ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
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
