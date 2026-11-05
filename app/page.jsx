"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  CalendarDays,
  Clock3,
  Heart,
  ArrowDown,
  Sparkles,
  Navigation,
  Pause,
  Play
} from "lucide-react";
import { wedding } from "./wedding-data";

// Supports YouTube Live, watch, Shorts, youtu.be and embed URLs.
function getYouTubeEmbedUrl(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    let videoId = "";

    if (host === "youtu.be") {
      videoId = parsed.pathname.split("/").filter(Boolean)[0] || "";
    } else if (host.endsWith("youtube.com")) {
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parsed.pathname === "/watch") videoId = parsed.searchParams.get("v") || "";
      else if (["live", "shorts", "embed"].includes(parts[0])) videoId = parts[1] || "";
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  } catch {
    return "";
  }
}


function useCountdown(targetDate) {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  return useMemo(() => {
    const target = new Date(targetDate).getTime();
    const diff = Math.max(0, target - (now ?? target));
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      complete: now !== null && target <= now
    };
  }, [now, targetDate]);
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
      <div className="ornament"><span /><Heart size={13} fill="currentColor" /><span /></div>
    </div>
  );
}

function VenueCard({ kind, date, time, venue, address, mapsUrl }) {
  return (
    <motion.article className="venue-card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
      <div className="venue-topline"><span>{kind}</span><Sparkles size={16} /></div>
      <div className="venue-date"><CalendarDays size={17} /> {date}</div>
      <h3>{venue}</h3>
      <p className="venue-address"><MapPin size={16} /> <span>{address}</span></p>
      <p className="venue-time"><Clock3 size={16} /> {time}</p>
      <a className="map-button" href={mapsUrl} target="_blank" rel="noreferrer">
        <Navigation size={16} /> Get directions
      </a>
    </motion.article>
  );
}

function ScratchCard() {
  const [revealed, setRevealed] = useState(false);
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [scratchProgress, setScratchProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const bounds = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = bounds.width * dpr;
    canvas.height = bounds.height * dpr;
    ctx.scale(dpr, dpr);
    const gradient = ctx.createLinearGradient(0, 0, bounds.width, bounds.height);
    gradient.addColorStop(0, "#d8c08d");
    gradient.addColorStop(0.5, "#f0e2c1");
    gradient.addColorStop(1, "#b99552");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, bounds.width, bounds.height);
    ctx.fillStyle = "rgba(255,255,255,.26)";
    for (let i = 0; i < 70; i++) {
      ctx.beginPath();
      ctx.arc((i * 47) % bounds.width, (i * 29) % bounds.height, 1.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [revealed]);

  const scratch = (event) => {
    if (!drawing.current || revealed) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    setScratchProgress((p) => {
      const next = p + 1;
      if (next > 34) setRevealed(true);
      return next;
    });
  };

  return (
    <div className={`scratch-wrap ${revealed ? "is-revealed" : ""}`}>
      <div className="scratch-under">
        <span className="small-caps">SAVE THE DATE</span>
        <strong>15 <i>NOV</i> 2026</strong>
        <span className="scratch-time">11:55 AM – 12:25 PM</span>
        <div className="petals" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => <motion.span key={i} initial={{ opacity: 0, y: 0, rotate: 0 }} animate={revealed ? { opacity: [0, 1, 0], y: -70 - (i % 4) * 15, x: Math.sin(i) * 85, rotate: i * 45 } : { opacity: 0 }} transition={{ duration: 1.4, delay: i * 0.035 }} style={{ left: `${44 + (i % 4) * 4}%` }}>✦</motion.span>)}
        </div>
      </div>
      {!revealed && <canvas ref={canvasRef} className="scratch-canvas" onPointerDown={(e) => { drawing.current = true; e.currentTarget.setPointerCapture(e.pointerId); scratch(e); }} onPointerMove={scratch} onPointerUp={() => { drawing.current = false; }} onPointerCancel={() => { drawing.current = false; }} aria-label="Scratch to reveal the wedding date" />}
      {!revealed && <div className="scratch-hint" onClick={() => setRevealed(true)}>Scratch here to reveal <span>✧</span></div>}
      {revealed && <button className="scratch-reset" onClick={() => { setRevealed(false); setScratchProgress(0); }}>Replay reveal</button>}
    </div>
  );
}

export default function WeddingInvitation() {
  const [opened, setOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [musicError, setMusicError] = useState(false);
  const audioRef = useRef(null);
  const countdown = useCountdown(wedding.ceremony.dateISO);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicOn) {
      audio.pause();
      setMusicOn(false);
      return;
    }
    try {
      await audio.play();
      setMusicOn(true);
      setMusicError(false);
    } catch {
      setMusicOn(false);
      setMusicError(true);
    }
  };

  const openInvitation = () => {
    setOpened(true);
    // Browsers require a user gesture before audio can start.
    if (audioRef.current) {
     audioRef.current
  .play()
  .then(() => {
    setMusicOn(true);
    setMusicError(false);
  })
  .catch(() => {
    setMusicOn(false);
    setMusicError(true);
  });
    }
  };

  return (
    <main>
      <audio
  ref={audioRef}
  src={wedding.musicSrc}
  loop
  preload="metadata"
  onPause={() => setMusicOn(false)}
  onPlay={() => setMusicOn(true)}
  onError={() => {
    setMusicOn(false);
    setMusicError(true);
  }}
/>

<button
  className="music-toggle"
  onClick={toggleMusic}
  aria-label={musicOn ? "Pause background music" : "Play background music"}
  aria-pressed={musicOn}
>
  {musicOn ? <Pause size={18} /> : <Play size={18} />}

  <span>{musicOn ? "Pause music" : "Play music"}</span>
</button>

      <section className={`hero ${opened ? "hero-opened" : ""}`}>
        <div className="hero-grain" />
        <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
        <div className="hero-stars" aria-hidden="true">{Array.from({ length: 18 }).map((_, i) => <span key={i} style={{ left: `${(i * 37) % 100}%`, top: `${(i * 23) % 100}%`, animationDelay: `${(i % 5) * 0.7}s` }}>✧</span>)}</div>
        <motion.div className="hero-content" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1 }}>
          <div className="monogram">K <span>♡</span> R</div>
          <p className="hero-kicker">{wedding.invitation.kicker}</p>
          <h1 className="hero-names">
  <span className="hero-name">{wedding.couple.groom}</span>
  <em className="hero-ampersand">&</em>
  <span className="hero-name">{wedding.couple.bride}</span>
</h1>
          <div className="gold-rule"><span /></div>
          <p className="hero-date">15 · 11 · 2026</p>
          <p className="hero-location">{wedding.location}</p>
          <AnimatePresence>
            {!opened ? (
              <motion.button className="open-invite" onClick={openInvitation} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: 8 }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                <span className="open-seal">✧</span> Tap to open invitation <ArrowDown size={15} />
              </motion.button>
            ) : (
              <motion.a href="#invitation" className="open-invite opened-link" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                Your invitation awaits <ArrowDown size={15} />
              </motion.a>
            )}
          </AnimatePresence>
          <p className="hero-note">
          {wedding.invitation.coverMessage}
          </p> 
        </motion.div>
        <div className="hero-bottom"><span>WITH LOVE & BLESSINGS</span><span>SCROLL TO EXPLORE ↓</span></div>
      </section>
      
      <section className="feature-photo" aria-label="Our story">
  <img
    src={wedding.storyImage.src}
    alt={wedding.storyImage.alt}
  />
  <div className="feature-overlay">
    <span>{wedding.invitation.storyEyebrow}</span>
    <h2>
      {wedding.invitation.storyLine1}
      <br />
      {wedding.invitation.storyLine2}
    </h2>
    <p>{wedding.couple.groom} &amp; {wedding.couple.bride}</p>
  </div>
</section>

      <section id="invitation" className="intro section-pad">
        <SectionHeading
  eyebrow="WITH THE BLESSINGS OF OUR FAMILIES"
  title={wedding.invitation.heading}
  subtitle={wedding.invitation.description}
/>
        <motion.div
  className="family-grid"
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.7 }}
>
  <div className="family-card">
    <span className="family-label">THE GROOM</span>
    <h3>{wedding.couple.groomFull}</h3>
    <p>{wedding.couple.groomFamily}</p>
    <p>{wedding.couple.groomAddress}</p>
  </div>

  <div className="family-divider">
    <span>✧</span>
  </div>

  <div className="family-card">
    <span className="family-label">THE BRIDE</span>
    <h3>{wedding.couple.brideFull}</h3>
    <p>{wedding.couple.brideFamily}</p>
    <p>{wedding.couple.brideAddress}</p>
  </div>
</motion.div>
      </section>

      <section className="couple-section section-pad" aria-label="Couple photo gallery">
        <div className="photo-grid">
          {wedding.photos.map((photo, index) => (
            <motion.figure
              key={photo.src}
              className="photo-card"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, delay: index * 0.08 }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </motion.figure>
          ))}
        </div>
      </section>

      <section className="live-stream-section section-pad" aria-labelledby="live-stream-title">
        <div className="live-stream-inner">
          <span className="eyebrow">{wedding.invitation.liveStreamEyebrow}</span>
          <h2 id="live-stream-title">{wedding.invitation.liveStreamTitle}</h2>
          <p className="live-stream-description">
            {wedding.invitation.liveStreamDescription}
          </p>

          {wedding.youtubeLiveUrl ? (
            <div className="live-stream-player">
              {getYouTubeEmbedUrl(wedding.youtubeLiveUrl) ? (
                <iframe
                  src={getYouTubeEmbedUrl(wedding.youtubeLiveUrl)}
                  title="Karthik and Dr. Revathy wedding live stream"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <div className="live-stream-placeholder">
                  <span className="live-stream-pulse" />
                  <p>Your YouTube Live link is saved. Use the button below to watch the stream.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="live-stream-placeholder">
              <span className="live-stream-pulse" />
              <p>{wedding.invitation.liveStreamPendingMessage}</p>
            </div>
          )}

          <a
            className={`live-stream-button ${!wedding.youtubeLiveUrl ? "is-disabled" : ""}`}
            href={wedding.youtubeLiveUrl || undefined}
            target={wedding.youtubeLiveUrl ? "_blank" : undefined}
            rel={wedding.youtubeLiveUrl ? "noreferrer" : undefined}
            aria-disabled={!wedding.youtubeLiveUrl}
            onClick={(event) => {
              if (!wedding.youtubeLiveUrl) event.preventDefault();
            }}
          >
            Watch Live on YouTube <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="date-section section-pad">
        <SectionHeading eyebrow="A MOMENT TO REMEMBER" title="Scratch to reveal" subtitle="A little surprise, just for you. Reveal the day we say “I do”." />
        <ScratchCard />
      </section>

      <section className="countdown-section section-pad">
        <div className="countdown-inner">
          <span className="eyebrow">THE DAY IS APPROACHING</span>
          <h2>{countdown.complete ? "Today, our forever begins." : "Counting down to forever"}</h2>
          <div className="countdown-grid" aria-live="polite">
            {[["days", "Days"], ["hours", "Hours"], ["minutes", "Minutes"], ["seconds", "Seconds"]].map(([key, label]) => (
              <div className="countdown-unit" key={key}><strong>{String(countdown[key]).padStart(2, "0")}</strong><span>{label}</span></div>
            ))}
          </div>
          <p>Sunday · 15 November 2026 · 11:55 AM</p>
        </div>
      </section>

      <section className="venues-section section-pad">
        <SectionHeading eyebrow="JOIN US IN CELEBRATION" title="The places, the moments" subtitle="Your presence will make both celebrations even more special." />
        <div className="venue-grid">
          <VenueCard kind="THE WEDDING CEREMONY" date={wedding.ceremony.dateLabel} time={wedding.ceremony.time} venue={wedding.ceremony.venue} address={wedding.ceremony.address} mapsUrl={wedding.ceremony.mapsUrl} />
          <VenueCard kind="THE RECEPTION" date={wedding.reception.dateLabel} time={wedding.reception.time} venue={wedding.reception.venue} address={wedding.reception.address} mapsUrl={wedding.reception.mapsUrl} />
        </div>
      </section>

      <footer className="footer">
        <div className="footer-flourish">✧</div>
        <p className="eyebrow">WITH LOVE, AND THE BLESSINGS OF OUR FAMILIES</p>
        <h2>
  {wedding.couple.groom}
  <em>&</em>
  {wedding.couple.bride}
</h2>
        <p>{wedding.invitation.closingMessage}</p>
<div className="footer-date">{wedding.footerDate}</div>
        <div className="footer-heart"><Heart size={15} fill="currentColor" /></div>
      </footer>

     {musicError && (
  <div className="music-note" role="status">
    Unable to load the background music.
    Please check that perfect.mp3 is inside the public folder.
  </div>
)}
    </main>
  );
}
