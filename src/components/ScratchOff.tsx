"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  code: string;
  onReveal: () => void;
};

export function ScratchOff({ code, onReveal }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const parent = canvas.parentElement;
    const width = parent?.clientWidth ?? 320;
    const height = 112;
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
    ctx.font = "700 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Rasca aquí para ver el código", width / 2, height / 2 - 6);
    ctx.font = "500 12px sans-serif";
    ctx.fillStyle = "#334155";
    ctx.fillText("Usá el dedo o el mouse", width / 2, height / 2 + 16);
  }, []);

  function pos(event: React.PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function scratch(event: React.PointerEvent<HTMLCanvasElement>) {
    if (revealed) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;
    const { x, y } = pos(event);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    const sample = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    for (let i = 3; i < sample.length; i += 16) {
      if (sample[i] < 40) cleared += 1;
    }
    const ratio = cleared / (sample.length / 16);
    if (ratio > 0.48) {
      setRevealed(true);
      onReveal();
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-gold-soft">
      <div className="flex h-28 items-center justify-center font-mono text-2xl font-extrabold tracking-[0.28em] text-ink">
        {code}
      </div>
      {!revealed ? (
        <canvas
          ref={canvasRef}
          className="scratch-canvas absolute inset-0 h-full w-full rounded-2xl"
          onPointerDown={(e) => {
            drawing.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            scratch(e);
          }}
          onPointerMove={(e) => {
            if (drawing.current) scratch(e);
          }}
          onPointerUp={() => {
            drawing.current = false;
          }}
        />
      ) : null}
    </div>
  );
}
