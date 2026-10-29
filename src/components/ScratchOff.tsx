"use client";

import { useEffect, useRef, useState } from "react";

const REVEAL_RATIO = 0.7;

type Props = {
  code: string;
  onReveal: () => void;
  compact?: boolean;
};

export function ScratchOff({ code, onReveal, compact = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const drawing = useRef(false);
  const done = useRef(false);
  const height = compact ? 88 : 112;

  function finish() {
    if (done.current) return;
    done.current = true;
    setRevealed(true);
    onReveal();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || done.current) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const parent = canvas.parentElement;
    const width = Math.max(parent?.clientWidth ?? 320, 200);
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#cbd5e1");
    gradient.addColorStop(0.5, "#94a3b8");
    gradient.addColorStop(1, "#64748b");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(255,255,255,0.35)";
    for (let i = 0; i < width; i += 16) {
      ctx.fillRect(i, 0, 6, height);
    }

    ctx.fillStyle = "#0f172a";
    ctx.font = "700 15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Rasca para ver el código", width / 2, height / 2 - 6);
    ctx.font = "500 12px sans-serif";
    ctx.fillStyle = "#334155";
    ctx.fillText("Usá el dedo o el mouse", width / 2, height / 2 + 14);
  }, [height]);

  function clearedRatio(): number {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return 0;

    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 16) {
      total += 1;
      if (data[i] < 64) cleared += 1;
    }
    return total === 0 ? 0 : cleared / total;
  }

  function pos(event: React.PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function scratchAt(x: number, y: number) {
    if (done.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    if (clearedRatio() >= REVEAL_RATIO) {
      finish();
    }
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    drawing.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = pos(e);
    scratchAt(p.x, p.y);
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const p = pos(e);
    scratchAt(p.x, p.y);
  }

  function onPointerUp() {
    drawing.current = false;
    if (!done.current && clearedRatio() >= REVEAL_RATIO) {
      finish();
    }
  }

  if (revealed) {
    return (
      <div className="overflow-hidden rounded-2xl border border-line bg-gold-soft">
        <div
          className={`flex items-center justify-center font-mono font-extrabold tracking-[0.28em] text-ink ${
            compact ? "text-xl" : "text-2xl"
          }`}
          style={{ height }}
        >
          {code}
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-gold-soft">
      <div
        className={`flex items-center justify-center font-mono font-extrabold tracking-[0.28em] text-ink ${
          compact ? "text-xl" : "text-2xl"
        }`}
        style={{ height }}
      >
        {code}
      </div>
      <canvas
        ref={canvasRef}
        className="scratch-canvas absolute inset-0 h-full w-full touch-none rounded-2xl"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          drawing.current = false;
        }}
      />
    </div>
  );
}
