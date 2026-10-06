// Plays a video file served from /public. Browsers only allow autoplay when muted;
// the controls let viewers unmute.
export default function LocalVideo({ src, title, autoplay = true }) {
  return (
    <div className="mx-auto w-fit max-w-full overflow-hidden rounded-2xl bg-neutral-800 shadow-2xl ring-1 ring-white/10">
      <video
        src={src}
        title={title}
        aria-label={title}
        controls
        playsInline
        preload={autoplay ? "auto" : "metadata"}
        {...(autoplay ? { autoPlay: true, muted: true, loop: true } : {})}
        className="block max-h-[80vh] w-auto max-w-full"
      />
    </div>
  );
}
