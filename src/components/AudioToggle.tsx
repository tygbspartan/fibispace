import React, { useEffect, useRef, useState } from "react";

const TRACK = "/assets/audio/webaudio.mp3";
const VOLUME = 0.4;

/**
 * Background music toggle. Starts silent — browsers block autoplay without a
 * gesture, and unannounced audio is hostile anyway — and the first click both
 * creates the element and starts playback.
 */
const AudioToggle: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  // Built lazily on first toggle so the 6MB file is never fetched for visitors
  // who leave the music off.
  const getAudio = () => {
    if (!audioRef.current) {
      const audio = new Audio(TRACK);
      audio.loop = true;
      audio.volume = VOLUME;
      audio.preload = "none";
      audioRef.current = audio;
    }
    return audioRef.current;
  };

  const toggle = () => {
    const audio = getAudio();

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    audio
      .play()
      .then(() => setPlaying(true))
      .catch((err) => {
        // Autoplay policy, a decode failure, or a missing file.
        console.error("AudioToggle: playback was blocked or failed.", err);
        setPlaying(false);
      });
  };

  // The loading screen asks whether to play, and says so on this event. It is
  // dispatched inside the click handler, so this still runs within the user
  // gesture and play() is allowed.
  useEffect(() => {
    const start = () => {
      const audio = getAudio();
      audio
        .play()
        .then(() => setPlaying(true))
        .catch((err) => {
          console.error("AudioToggle: playback was blocked or failed.", err);
          setPlaying(false);
        });
    };

    window.addEventListener("fibi:sound", start);
    return () => window.removeEventListener("fibi:sound", start);
    // getAudio only touches a ref, so it is stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the button honest if playback stops for any reason we did not trigger.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);

    audio.addEventListener("pause", onPause);
    audio.addEventListener("play", onPlay);
    return () => {
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("play", onPlay);
    };
  }, [playing]);

  // Stop the music if the component ever unmounts.
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  return (
    <button
      onClick={toggle}
      aria-label={playing ? "Mute background music" : "Play background music"}
      aria-pressed={playing}
      title={playing ? "Mute music" : "Play music"}
      className="w-10 h-10 lg:w-11 lg:h-11 shrink-0 rounded-full bg-white text-primary shadow-sm ring-1 ring-black/[0.06] flex items-center justify-center transition-shadow hover:shadow-md"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 lg:w-[22px] lg:h-[22px] overflow-hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        aria-hidden="true"
      >
        {/* Paused: a flat line. */}
        <path
          d="M3 12 H21"
          style={{
            opacity: playing ? 0 : 1,
            transition: "opacity 220ms ease",
          }}
        />

        {/* Playing: a double-width wave scrolling by exactly one period, so it
            loops seamlessly and reads as the line rippling in place. */}
        <g
          className={playing ? "animate-waveScroll" : undefined}
          style={{
            opacity: playing ? 1 : 0,
            transition: "opacity 220ms ease",
          }}
        >
          <path d="M0 12 q3 -5 6 0 t6 0 t6 0 t6 0 t6 0 t6 0 t6 0 t6 0" />
        </g>
      </svg>
    </button>
  );
};

export default AudioToggle;
