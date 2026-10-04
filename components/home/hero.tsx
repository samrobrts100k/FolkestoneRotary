"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { site } from "@/lib/site";

const TITLE = "Making a difference in Folkestone";
/** Longest a clip plays before the montage cross-fades to the next one. */
const CLIP_MS = 7000;

export function Hero() {
  const videos = site.heroVideos;
  const hasFilm = Boolean(site.filmUrl);
  return (
    <section id="hero" aria-labelledby="hero-title"
      className="on-dark relative isolate flex min-h-[clamp(620px,100svh,900px)] items-end overflow-hidden bg-navy text-white">
      <div aria-hidden className="absolute inset-0 -z-20">
        <div className="hero-poster absolute inset-0 overflow-hidden" />
        {videos.length > 0 && <Montage clips={videos} />}
      </div>
      <div aria-hidden className="hero-shade pointer-events-none absolute inset-0 -z-10" />

      <div className="container w-full pb-9 pt-32 sm:pt-36">
        <h1 id="hero-title" aria-label={TITLE} className="hero-title mb-5 max-w-[10em] text-[clamp(44px,6.8vw,92px)] leading-[1.04] text-white" style={{ letterSpacing: "-0.015em" }}>
          {TITLE.split(" ").map((w, i, all) => (
            <span key={i} aria-hidden><span className="word-rise" style={{ "--i": i } as React.CSSProperties}>{w}</span>{i < all.length - 1 ? " " : ""}</span>
          ))}
        </h1>
        <p className="rise mb-7 max-w-[32em] text-lg text-[#E1ECF8] sm:text-xl" style={{ "--d": "550ms" } as React.CSSProperties}>
          We’re local people who raise money, give time and back the charities, young people and projects that make this town work.
        </p>
        <div className="rise flex flex-wrap items-center gap-x-7 gap-y-4" style={{ "--d": "700ms" } as React.CSSProperties}>
          <ButtonLink href="/join" variant="gold" size="lg">Join us</ButtonLink>
          <Link href="/events" className="font-bold text-white underline">View events</Link>
          <Link href="/funding" className="font-bold text-white underline">Apply for funding</Link>
        </div>
        {(videos.length > 0 || hasFilm) && (
          <div className="rise mt-10 flex flex-wrap items-center gap-4 border-t border-white/30 pt-5" style={{ "--d": "850ms" } as React.CSSProperties}>
            {videos.length > 0 && <PauseButton />}
            {hasFilm && <FilmButton url={site.filmUrl} />}
          </div>
        )}
      </div>
    </section>
  );
}

const pillCls = "inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-white bg-white/10 px-[18px] py-2 text-[15px] font-bold text-white backdrop-blur-sm transition-[transform,background-color] duration-150 hover:bg-white/20 active:scale-[0.97]";

/* ---- Background montage: two stacked <video>s cross-fade between clips ---- */
const montage = { paused: false, listeners: new Set<(p: boolean) => void>() };
const setPaused = (p: boolean) => { montage.paused = p; montage.listeners.forEach((f) => f(p)); };

function Montage({ clips }: { clips: readonly string[] }) {
  const a = useRef<HTMLVideoElement>(null), b = useRef<HTMLVideoElement>(null);
  const [front, setFront] = useState(0);

  useEffect(() => {
    const V = [a.current!, b.current!];
    let cur = 0, idx = 0, t0 = performance.now(), iv = 0;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
    const play = (v: HTMLVideoElement) => { if (!montage.paused) v.play().catch(() => {}); };
    V[0].src = clips[0]; V[0].loop = clips.length === 1; play(V[0]);
    const next = () => {
      idx = (idx + 1) % clips.length;
      const o = V[cur], n = V[1 - cur];
      n.src = clips[idx]; n.currentTime = 0; play(n);
      cur = 1 - cur; setFront(cur); t0 = performance.now();
      setTimeout(() => o.pause(), 1400);
    };
    if (clips.length > 1) iv = window.setInterval(() => {
      if (!montage.paused && (V[cur].ended || performance.now() - t0 > CLIP_MS)) next();
    }, 300);
    const onPause = (p: boolean) => { if (p) V[cur].pause(); else { play(V[cur]); t0 = performance.now(); } };
    montage.listeners.add(onPause);
    return () => { clearInterval(iv); montage.listeners.delete(onPause); V.forEach((v) => v.pause()); };
  }, [clips]);

  const cls = "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1300ms]";
  return (
    <>
      <video ref={a} muted playsInline preload="metadata" className={`${cls} ${front === 0 ? "opacity-100" : "opacity-0"}`} />
      <video ref={b} muted playsInline preload="none" className={`${cls} ${front === 1 ? "opacity-100" : "opacity-0"}`} />
    </>
  );
}

function PauseButton() {
  const [paused, set] = useState(montage.paused);
  useEffect(() => { montage.listeners.add(set); return () => { montage.listeners.delete(set); }; }, []);
  return <button type="button" className={pillCls} aria-pressed={paused} onClick={() => setPaused(!montage.paused)}>{paused ? "Play film" : "Pause film"}</button>;
}

/* ---- Full film window ---- */
function FilmButton({ url }: { url: string }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const shut = () => {
    const d = dlg.current;
    if (!d?.open) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { d.close(); return; }
    d.classList.add("closing");
    setTimeout(() => { d.close(); d.classList.remove("closing"); }, 150);
  };
  const isFile = /\.(mp4|webm|mov)(\?|$)/i.test(url);
  return (
    <>
      <button type="button" className={pillCls} onClick={() => { setOpen(true); dlg.current?.showModal(); }}>
        <svg viewBox="0 0 11 12" aria-hidden className="h-3 w-[11px] fill-current"><path d="M1 1.2v9.6a.6.6 0 0 0 .9.5l8.2-4.8a.6.6 0 0 0 0-1L1.9.7a.6.6 0 0 0-.9.5z" /></svg>
        Watch the full film
      </button>
      <dialog ref={dlg} aria-labelledby="film-title" className="film-dialog w-full max-w-[min(960px,92vw)] overflow-hidden rounded-[18px] p-0"
        onClose={() => setOpen(false)} onCancel={(e) => { e.preventDefault(); shut(); }} onClick={(e) => { if (e.target === e.currentTarget) shut(); }}>
        <div className="flex items-center justify-between gap-4 py-3 pl-5 pr-3 font-bold text-navy">
          <span id="film-title">{site.name}: our year in film</span>
          <button type="button" onClick={shut} className="min-h-11 rounded-full border-2 border-navy px-[18px] text-[15px] font-bold transition-colors hover:bg-mist">Close</button>
        </div>
        <div className="aspect-video bg-navy">
          {open && (isFile
            ? <video src={url} controls autoPlay className="h-full w-full" />
            : <iframe src={url} title={`${site.name} film`} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="h-full w-full border-0" />)}
        </div>
      </dialog>
    </>
  );
}
