"use client";

import {
  MediaPlaybackPause,
  MediaPlaybackStart,
  MediaSeekBackward,
  MediaSeekForward,
} from "@gtk-js/adwaita-icons";
import {
  GtkBox,
  GtkButton,
  GtkHeaderBar,
  GtkLabel,
  GtkScale,
  GtkWindow,
  GtkWindowTitle,
} from "@gtk-js/gtk4";
import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from "react";

export interface SceneStep {
  /** Code snippet shown in the typing panel for this step */
  code: string;
}

const AUDIO_URL =
  "https://archive.org/download/NeverGonnaGiveYouUpOriginal/Never%20Gonna%20Give%20You%20Up%20Original.mp3";
const W = { width: 380, minHeight: 320 };

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ── Audio context ────────────────────────────────────────────────────────────

type AudioState = {
  position: number;
  duration: number;
  playing: boolean;
  scaleValue: number;
  onSeek: (v: number) => void;
  onSeekCommit: (v: number) => void;
  onTogglePlay: () => void;
  onSeekBack: () => void;
  onSeekForward: () => void;
};

const AudioCtx = createContext<AudioState | null>(null);
const useAudio = () => useContext(AudioCtx)!;

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const seekingRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => {
      if (!seekingRef.current) setPosition(audio.currentTime);
    };
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const onTogglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  const onSeek = (v: number) => {
    seekingRef.current = true;
    setPosition((v / 100) * (duration || 1));
  };

  const onSeekCommit = (v: number) => {
    const audio = audioRef.current;
    const time = (v / 100) * (duration || 1);
    if (audio) audio.currentTime = time;
    setPosition(time);
    seekingRef.current = false;
  };

  const onSeekBack = () => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Math.max(0, audio.currentTime - 10);
  };

  const onSeekForward = () => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Math.min(duration, audio.currentTime + 10);
  };

  const scaleValue = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <AudioCtx.Provider
      value={{
        position,
        duration,
        playing,
        scaleValue,
        onSeek,
        onSeekCommit,
        onTogglePlay,
        onSeekBack,
        onSeekForward,
      }}
    >
      <audio ref={audioRef} src={AUDIO_URL} preload="metadata" style={{ display: "none" }} />
      {children}
    </AudioCtx.Provider>
  );
}

// ── Step index constants ─────────────────────────────────────────────────────
// Each constant is the step at which that element first appears (0-indexed).
// visibleSteps >= N means element N is shown.

// Step 0: window + headerbar appear together (one code snippet)
const STEP_WINDOW = 0;
const STEP_HEADERBAR = 0;
const STEP_ALBUM_ART = 1;
const STEP_TRACK_TITLE = 2;
const STEP_TRACK_ARTIST = 3;
const STEP_PROGRESS = 4;
const STEP_PLAY_BTN = 5;
const STEP_SEEK_BTNS = 6;

export const TOTAL_STEPS = 7;

// ── Sub-components ───────────────────────────────────────────────────────────

function LiveProgress() {
  const { scaleValue, position, duration, onSeek, onSeekCommit } = useAudio();
  return (
    <GtkBox orientation="vertical" spacing={0} style={{ width: "100%", marginTop: 16 }}>
      <GtkScale
        value={scaleValue}
        min={0}
        max={100}
        style={{ width: "100%" }}
        onValueChanged={onSeek}
        onPointerUp={(e) => {
          if (e.button === 0) onSeekCommit(scaleValue);
        }}
      />
      <GtkBox orientation="horizontal" style={{ justifyContent: "space-between", width: "100%" }}>
        <GtkLabel
          label={formatTime(position)}
          className="dim-label"
          style={{ fontSize: "0.8rem" }}
        />
        <GtkLabel
          label={duration > 0 ? formatTime(duration) : "--:--"}
          className="dim-label"
          style={{ fontSize: "0.8rem" }}
        />
      </GtkBox>
    </GtkBox>
  );
}

// ── Main player ──────────────────────────────────────────────────────────────

export function ShowcasePlayer({ visibleSteps }: { visibleSteps: number }) {
  const { playing, onTogglePlay, onSeekBack, onSeekForward } = useAudio();

  const show = (step: number) => visibleSteps > step;

  if (!show(STEP_WINDOW)) return null;

  const titlebar = show(STEP_HEADERBAR) ? (
    <GtkHeaderBar titleWidget={<GtkWindowTitle title="Harmonix" subtitle="Music Player" />} />
  ) : undefined;

  return (
    <GtkWindow style={W} titlebar={titlebar}>
      <GtkBox orientation="vertical" spacing={0} style={{ padding: 24, alignItems: "center" }}>
        {show(STEP_ALBUM_ART) && (
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: 12,
              background: "linear-gradient(135deg, #3584e4 0%, #9141ac 100%)",
              marginBottom: 20,
            }}
          />
        )}
        <GtkBox orientation="vertical" spacing={4} style={{ alignItems: "center", width: "100%" }}>
          {show(STEP_TRACK_TITLE) && <GtkLabel label="Midnight Bloom" className="title-2" />}
          {show(STEP_TRACK_ARTIST) && <GtkLabel label="Aurora Waves" className="dim-label" />}
        </GtkBox>
        {show(STEP_PROGRESS) && <LiveProgress />}
        {show(STEP_PLAY_BTN) && (
          <GtkBox spacing={8} style={{ marginTop: 16, alignItems: "center" }}>
            {show(STEP_SEEK_BTNS) && (
              <GtkButton hasFrame={false} onClicked={onSeekBack}>
                <MediaSeekBackward size={20} />
              </GtkButton>
            )}
            <GtkButton
              className="suggested-action"
              style={{ borderRadius: "50%", padding: 12 }}
              onClicked={onTogglePlay}
            >
              {playing ? <MediaPlaybackPause size={24} /> : <MediaPlaybackStart size={24} />}
            </GtkButton>
            {show(STEP_SEEK_BTNS) && (
              <GtkButton hasFrame={false} onClicked={onSeekForward}>
                <MediaSeekForward size={20} />
              </GtkButton>
            )}
          </GtkBox>
        )}
      </GtkBox>
    </GtkWindow>
  );
}

// ── Step code snippets ───────────────────────────────────────────────────────

// The assembled code matches exactly what a user would write.
// The only difference vs the live player is the audio backend wiring
// (useAudio hook, onValueChanged, onClicked handlers) which is app-specific.
export const windowSteps: SceneStep[] = [
  {
    code: `<GtkWindow
  titlebar={
    <GtkHeaderBar
      titleWidget={
        <GtkWindowTitle
          title="Harmonix"
          subtitle="Music Player"
        />
      }
    />
  }
>`,
  },
  {
    code: `  <div style={{
    width: 180, height: 180,
    borderRadius: 12,
    background: "linear-gradient(135deg,
      #3584e4 0%, #9141ac 100%)",
  }} />`,
  },
  {
    code: `  <GtkLabel label="Midnight Bloom" className="title-2" />`,
  },
  {
    code: `  <GtkLabel label="Aurora Waves" className="dim-label" />`,
  },
  {
    code: `  <GtkScale value={position} min={0} max={duration} />
  <GtkLabel label={formatTime(position)} className="dim-label" />
  <GtkLabel label={formatTime(duration)} className="dim-label" />`,
  },
  {
    code: `  <GtkButton className="suggested-action" style={{ borderRadius: "50%", padding: 12 }}>
    {playing ? <MediaPlaybackPause size={24} /> : <MediaPlaybackStart size={24} />}
  </GtkButton>`,
  },
  {
    code: `  <GtkButton hasFrame={false}><MediaSeekBackward size={20} /></GtkButton>
  <GtkButton hasFrame={false}><MediaSeekForward size={20} /></GtkButton>
</GtkWindow>`,
  },
];
