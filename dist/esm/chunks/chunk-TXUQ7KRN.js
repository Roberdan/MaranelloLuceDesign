/* Maranello Luce Design v4.14.1 | MPL-2.0 | github.com/Roberdan/MaranelloLuceDesign */
import {
  cssVar,
  debounce,
  getAccent
} from "./chunk-GNZ7B5YQ.js";

// src/ts/gauge-engine-palette.ts
function buildGaugePalette(accent) {
  const D = {
    numbers: "#c8c8c8",
    centerValue: "#fafafa",
    centerUnit: "#9e9e9e",
    centerLabel: "#666",
    muted: "#666",
    dimmed: "#555",
    subDialLabel: "#888",
    tickMajor: "#D4A826",
    tickHalf: "#9A7B1C",
    tickMinor: "#5a4a14",
    highlightRing: "rgba(255,255,255,0.04)",
    trackAlpha: "rgba(255,255,255,0.06)",
    arcDot: "#fff",
    needleTail: "#555",
    needleTip: "#fff",
    capOuter: ["#888", "#555", "#333", "#1a1a1a"],
    capInner: ["#aaa", "#666", "#2a2a2a"],
    capCenter: "#444",
    subDialBg: ["#222", "#111"],
    subDialBorder: "#3a3a3a",
    subDialTrack: "rgba(255,255,255,0.08)",
    odometerBg: "#1a1a1a",
    odometerBorder: "#333",
    odometerText: "#fafafa",
    ledLabel: null,
    axisLabel: "#888",
    axisTitle: "#9e9e9e",
    gridScale: "#666",
    sparkMonth: "#555",
    sparkLabel: "#666",
    quadrant: "#888",
    quadrantDim: "#555",
    quadrantHi: accent
  };
  const cl = document.body.classList;
  if (cl.contains("mn-avorio")) {
    return {
      ...D,
      /* Text / numbers — dark on light surface */
      numbers: "#3a3530",
      centerValue: "#1a1a1a",
      centerUnit: "#666660",
      centerLabel: "#4a4540",
      muted: "#666660",
      dimmed: "#7a7570",
      subDialLabel: "#5a5550",
      axisLabel: "#4a4540",
      axisTitle: "#5a5550",
      gridScale: "#8a8580",
      sparkMonth: "#8a8580",
      sparkLabel: "#7a7570",
      quadrant: "#a0a09a",
      quadrantDim: "#b0aba4",
      /* Ticks — darker gold for contrast on ivory */
      tickMajor: "#a07818",
      tickHalf: "#806010",
      tickMinor: "#604808",
      /* Bezel chrome — warm silver instead of dark chrome */
      capOuter: ["#d0cfc9", "#b8b4ae", "#a09e98", "#888582"],
      capInner: ["#d8d4ce", "#c0bcb6", "#a8a49e"],
      capCenter: "#b0aba4",
      /* Needle */
      needleTail: "#a8a49e",
      needleTip: "#1a1a1a",
      /* Highlight / track */
      highlightRing: "rgba(0,0,0,0.04)",
      trackAlpha: "rgba(0,0,0,0.06)",
      /* Sub-dials and odometer */
      subDialBg: ["#e8e4dc", "#ddd8ce"],
      subDialBorder: "#c0b9ad",
      subDialTrack: "rgba(0,0,0,0.08)",
      odometerBg: "#f0ede6",
      odometerBorder: "#ccc",
      odometerText: "#1a1a1a"
    };
  }
  if (cl.contains("mn-sugar")) {
    return {
      ...D,
      numbers: "#333",
      centerValue: "#111",
      centerUnit: "#666",
      centerLabel: "#444",
      muted: "#666",
      dimmed: "#777",
      subDialLabel: "#555",
      axisLabel: "#444",
      axisTitle: "#555",
      gridScale: "#888",
      sparkMonth: "#888",
      sparkLabel: "#777",
      quadrant: "#999",
      quadrantDim: "#aaa",
      tickMajor: "#888",
      tickHalf: "#aaa",
      tickMinor: "#ccc",
      capOuter: ["#D0D0D5", "#C0C0C5", "#B0B0B5", "#A0A0A5"],
      capInner: ["#D8D8DC", "#C8C8CC", "#B0B0B5"],
      capCenter: "#C0C0C5",
      needleTail: "#999",
      needleTip: "#111",
      highlightRing: "rgba(0,0,0,0.06)",
      trackAlpha: "rgba(0,0,0,0.08)",
      subDialBg: ["#d0d0d5", "#c0c0c5"],
      subDialBorder: "#b0b0b5",
      subDialTrack: "rgba(0,0,0,0.10)",
      odometerBg: "#e4e4e8",
      odometerBorder: "#d0d0d5",
      odometerText: "#111"
    };
  }
  if (cl.contains("mn-colorblind")) {
    return {
      ...D,
      tickMajor: "#FFB000",
      tickHalf: "#B87E00",
      tickMinor: "#7A5400",
      quadrantHi: "#0072B2"
    };
  }
  if (cl.contains("mn-nero")) {
    return {
      ...D,
      numbers: "#e0e0e0",
      subDialBg: ["#1a1a1a", "#0a0a0a"],
      subDialBorder: "#2a2a2a",
      odometerBg: "#0a0a0a",
      odometerBorder: "#222"
    };
  }
  return D;
}

// src/ts/gauge-engine-draw-details.ts
function drawNeedle(s, progress, sa, totalSweep, value, max, color) {
  const { ctx, cx, cy, radius } = s;
  const curVal = value * progress;
  const needleAngle = s.rad(sa + curVal / max * totalSweep);
  const needleLen = radius * 0.82, nTail = radius * 0.18;
  const tipX = cx + Math.cos(needleAngle) * needleLen;
  const tipY = cy + Math.sin(needleAngle) * needleLen;
  const perpAngle = needleAngle + Math.PI / 2;
  const bw = Math.max(1.8, s.size * 0.012);
  const tailX = cx - Math.cos(needleAngle) * nTail;
  const tailY = cy - Math.sin(needleAngle) * nTail;
  const tw = bw * 1.5;
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 22;
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(cx + Math.cos(perpAngle) * bw, cy + Math.sin(perpAngle) * bw);
  ctx.lineTo(tailX + Math.cos(perpAngle) * tw, tailY + Math.sin(perpAngle) * tw);
  ctx.lineTo(tailX - Math.cos(perpAngle) * tw, tailY - Math.sin(perpAngle) * tw);
  ctx.lineTo(cx - Math.cos(perpAngle) * bw, cy - Math.sin(perpAngle) * bw);
  ctx.closePath();
  const ng = ctx.createLinearGradient(tailX, tailY, tipX, tipY);
  ng.addColorStop(0, s.palette.needleTail);
  ng.addColorStop(0.3, color);
  ng.addColorStop(0.85, color);
  ng.addColorStop(1, s.palette.needleTip);
  ctx.fillStyle = ng;
  ctx.fill();
  ctx.restore();
  const capR = radius * 0.11;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, capR, 0, Math.PI * 2);
  const cg = ctx.createRadialGradient(cx - capR * 0.2, cy - capR * 0.3, 0, cx, cy, capR);
  s.palette.capOuter.forEach((c, i) => cg.addColorStop(i / 3, c));
  ctx.fillStyle = cg;
  ctx.fill();
  ctx.restore();
  const capR2 = capR * 0.65;
  const cg2 = ctx.createRadialGradient(cx - capR2 * 0.15, cy - capR2 * 0.2, 0, cx, cy, capR2);
  s.palette.capInner.forEach((c, i) => cg2.addColorStop(i / 2, c));
  ctx.beginPath();
  ctx.arc(cx, cy, capR2, 0, Math.PI * 2);
  ctx.fillStyle = cg2;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, capR * 0.2, 0, Math.PI * 2);
  ctx.fillStyle = s.palette.capCenter;
  ctx.fill();
}
function drawCenterText(s, c) {
  const fsCtr = Math.max(16, s.size * 0.15);
  if (c.centerValue) {
    s.ctx.font = `700 ${fsCtr}px 'Barlow Condensed','Outfit',sans-serif`;
    s.ctx.fillStyle = s.palette.centerValue;
    s.ctx.textAlign = "center";
    s.ctx.textBaseline = "middle";
    s.ctx.fillText(c.centerValue, s.cx, s.cy - s.size * 0.02);
  }
  if (c.centerUnit) {
    s.ctx.font = `400 ${Math.max(7, s.size * 0.04)}px 'Inter',sans-serif`;
    s.ctx.fillStyle = s.palette.centerUnit;
    s.ctx.textAlign = "center";
    s.ctx.textBaseline = "middle";
    s.ctx.fillText(c.centerUnit, s.cx, s.cy + s.size * 0.06);
  }
  if (c.centerLabel) {
    s.ctx.font = `600 ${Math.max(6, s.size * 0.035)}px 'Barlow Condensed','Outfit',sans-serif`;
    s.ctx.fillStyle = s.palette.centerLabel;
    s.ctx.textAlign = "center";
    s.ctx.textBaseline = "middle";
    s.ctx.fillText(c.centerLabel, s.cx, s.cy - s.size * 0.14);
  }
}
function drawSubDials(s, c, progress) {
  const subs = c.subDials;
  if (!subs) return;
  subs.forEach((sd) => {
    const sx = s.cx + sd.x * s.size;
    const sy = s.cy + sd.y * s.size;
    const sr = s.size * 0.1;
    const bg = s.ctx.createRadialGradient(sx, sy - 1, sr * 0.2, sx, sy, sr);
    bg.addColorStop(0, s.palette.subDialBg[0]);
    bg.addColorStop(1, s.palette.subDialBg[1]);
    s.ctx.beginPath();
    s.ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    s.ctx.fillStyle = bg;
    s.ctx.fill();
    s.ctx.strokeStyle = s.palette.subDialBorder;
    s.ctx.lineWidth = 1.5;
    s.ctx.stroke();
    const sSa = s.rad(-225), sEa = s.rad(45);
    s.ctx.beginPath();
    s.ctx.arc(sx, sy, sr * 0.72, sSa, sEa);
    s.ctx.strokeStyle = s.palette.subDialTrack;
    s.ctx.lineWidth = 2.5;
    s.ctx.lineCap = "round";
    s.ctx.stroke();
    const val = sd.value / sd.max * 270 * progress;
    s.ctx.beginPath();
    s.ctx.arc(sx, sy, sr * 0.72, sSa, s.rad(-225 + val));
    s.ctx.strokeStyle = sd.color;
    s.ctx.lineWidth = 2.5;
    s.ctx.lineCap = "round";
    s.ctx.stroke();
    const sfs = Math.max(8, sr * 0.55);
    s.ctx.font = `700 ${sfs}px 'Barlow Condensed','Outfit',sans-serif`;
    s.ctx.fillStyle = sd.color;
    s.ctx.textAlign = "center";
    s.ctx.textBaseline = "middle";
    s.ctx.fillText(Math.round(sd.value * progress).toString(), sx, sy - sr * 0.05);
    if (s.density !== "sm") {
      const lfs = Math.max(5, sr * 0.32);
      s.ctx.font = `500 ${lfs}px 'Barlow Condensed',sans-serif`;
      s.ctx.fillStyle = s.palette.axisLabel;
      s.ctx.fillText(sd.label, sx, sy + sr * 0.45);
    }
  });
}
function drawOdometer(s, c) {
  const od = c.odometer;
  if (!od) return;
  const oy = s.cy + s.radius * 0.62;
  const dw = Math.max(10, s.size * 0.055);
  const dh = Math.max(14, s.size * 0.07);
  const digits = od.digits;
  const highlightLast = od.highlightLast;
  const totalW = digits.length * (dw + 1);
  let ox = s.cx - totalW / 2;
  digits.forEach((d, i) => {
    const isLast = i === digits.length - 1 && highlightLast;
    s.ctx.fillStyle = isLast ? "#DC0000" : s.palette.odometerBg;
    s.ctx.strokeStyle = isLast ? "#DC0000" : s.palette.odometerBorder;
    s.ctx.lineWidth = 0.8;
    s.ctx.beginPath();
    s.ctx.roundRect(ox, oy - dh / 2, dw, dh, 2);
    s.ctx.fill();
    s.ctx.stroke();
    s.ctx.font = `600 ${Math.max(7, dw * 0.6)}px 'Barlow Condensed',sans-serif`;
    s.ctx.fillStyle = s.palette.centerValue;
    s.ctx.textAlign = "center";
    s.ctx.textBaseline = "middle";
    s.ctx.fillText(String(d), ox + dw / 2, oy);
    ox += dw + 1;
  });
}
function drawStatusLed(s, c) {
  const led = c.statusLed;
  if (!led) return;
  const lx = s.cx - s.radius * 0.25;
  const ly = s.cy + s.radius * 0.38;
  s.ctx.save();
  s.ctx.shadowColor = led.color;
  s.ctx.shadowBlur = 6;
  s.ctx.beginPath();
  s.ctx.arc(lx, ly, 3, 0, Math.PI * 2);
  s.ctx.fillStyle = led.color;
  s.ctx.fill();
  s.ctx.restore();
  s.ctx.font = `500 ${Math.max(5, s.size * 0.03)}px 'Barlow Condensed',sans-serif`;
  s.ctx.fillStyle = led.color;
  s.ctx.textAlign = "left";
  s.ctx.textBaseline = "middle";
  s.ctx.fillText(led.label, lx + 7, ly);
}
function drawTrend(s, c) {
  const t = c.trend;
  if (!t) return;
  const tx = s.cx + s.radius * 0.25;
  const ty = s.cy + s.radius * 0.38;
  s.ctx.font = `600 ${Math.max(6, s.size * 0.035)}px 'Barlow Condensed',sans-serif`;
  s.ctx.fillStyle = t.color;
  s.ctx.textAlign = "right";
  s.ctx.textBaseline = "middle";
  const arrow = t.direction === "up" ? "\u25B2" : "\u25BC";
  s.ctx.fillText(arrow + " " + t.delta, tx, ty);
}

// src/ts/gauge-engine-draw.ts
function drawGauge(state, progress) {
  const { ctx, cx, cy, radius, size, config: cfg, palette: P } = state;
  const c = cfg.complications || {};
  ctx.clearRect(0, 0, size, size);
  const shadowGrad = ctx.createRadialGradient(cx, cy, radius * 0.78, cx, cy, radius * 1.1);
  shadowGrad.addColorStop(0, "rgba(0,0,0,0)");
  shadowGrad.addColorStop(0.25, "rgba(0,0,0,0.15)");
  shadowGrad.addColorStop(0.5, "rgba(0,0,0,0.4)");
  shadowGrad.addColorStop(0.75, "rgba(0,0,0,0.2)");
  shadowGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.94, 0, Math.PI * 2);
  ctx.strokeStyle = shadowGrad;
  ctx.lineWidth = radius * 0.28;
  ctx.stroke();
  const vigGrad = ctx.createRadialGradient(cx, cy * 0.95, radius * 0.1, cx, cy, radius * 0.95);
  vigGrad.addColorStop(0, "rgba(0,0,0,0)");
  vigGrad.addColorStop(0.6, "rgba(0,0,0,0)");
  vigGrad.addColorStop(0.85, "rgba(0,0,0,0.15)");
  vigGrad.addColorStop(1, "rgba(0,0,0,0.4)");
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.95, 0, Math.PI * 2);
  ctx.fillStyle = vigGrad;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.02, 0, Math.PI * 2);
  ctx.strokeStyle = P.highlightRing;
  ctx.lineWidth = 1;
  ctx.stroke();
  const sa = cfg.startAngle ?? -135;
  const ea = cfg.endAngle ?? 135;
  const ticks = cfg.ticks ?? 0;
  const subticks = cfg.subticks ?? 1;
  const value = cfg.value ?? 0;
  const max = cfg.max ?? 100;
  const color = cfg.color ?? "#FFC72C";
  const showNeedle = cfg.showNeedle ?? true;
  const numbers = cfg.numbers ?? [];
  const totalSweep = ea - sa;
  drawInnerRing(state, c, progress, sa, totalSweep);
  drawTicks(state, ticks, subticks, sa, totalSweep);
  drawNumbers(state, numbers, sa, totalSweep, max);
  drawArcBar(state, c, progress, sa, totalSweep);
  if (showNeedle && ticks > 0) {
    drawNeedle(state, progress, sa, totalSweep, value, max, color);
  }
  drawCenterText(state, c);
  drawSubDials(state, c, progress);
  drawOdometer(state, c);
  drawStatusLed(state, c);
  drawTrend(state, c);
}
function drawInnerRing(s, c, progress, sa, totalSweep) {
  const ir = c.innerRing;
  if (!ir) return;
  const irR = s.radius * 0.48;
  s.ctx.beginPath();
  s.ctx.arc(s.cx, s.cy, irR, s.rad(sa), s.rad(sa + totalSweep));
  s.ctx.strokeStyle = s.palette.trackAlpha;
  s.ctx.lineWidth = 3;
  s.ctx.lineCap = "round";
  s.ctx.stroke();
  const val = ir.value / ir.max * totalSweep * progress;
  s.ctx.beginPath();
  s.ctx.arc(s.cx, s.cy, irR, s.rad(sa), s.rad(sa + val));
  s.ctx.strokeStyle = ir.color;
  s.ctx.lineWidth = 3;
  s.ctx.lineCap = "round";
  s.ctx.stroke();
  const fs = Math.max(7, s.size * 0.04);
  s.ctx.font = `500 ${fs}px 'Barlow Condensed','Outfit',sans-serif`;
  s.ctx.fillStyle = ir.color;
  s.ctx.textAlign = "center";
  s.ctx.textBaseline = "middle";
  s.ctx.fillText(ir.label, s.cx, s.cy + s.radius * 0.5);
}
function drawTicks(s, ticks, subticks, sa, totalSweep) {
  if (ticks <= 0) return;
  const total = ticks * subticks;
  const skipMinor = s.density === "sm";
  for (let i = 0; i <= total; i++) {
    const angle = s.rad(sa + i / total * totalSweep);
    const isMajor = i % subticks === 0;
    const isHalf = subticks > 1 && i % Math.floor(subticks / 2) === 0 && !isMajor;
    if (skipMinor && !isMajor && !isHalf) continue;
    let innerR, outerR, lw, tc;
    if (isMajor) {
      innerR = 0.7;
      outerR = 0.92;
      lw = 2.2;
      tc = s.palette.tickMajor;
    } else if (isHalf) {
      innerR = 0.78;
      outerR = 0.92;
      lw = 1;
      tc = s.palette.tickHalf;
    } else {
      innerR = 0.84;
      outerR = 0.92;
      lw = 0.6;
      tc = s.palette.tickMinor;
    }
    s.ctx.beginPath();
    s.ctx.moveTo(s.cx + Math.cos(angle) * s.radius * innerR, s.cy + Math.sin(angle) * s.radius * innerR);
    s.ctx.lineTo(s.cx + Math.cos(angle) * s.radius * outerR, s.cy + Math.sin(angle) * s.radius * outerR);
    s.ctx.strokeStyle = tc;
    s.ctx.lineWidth = lw;
    s.ctx.lineCap = "butt";
    s.ctx.stroke();
  }
}
function drawNumbers(s, numbers, sa, totalSweep, max) {
  if (!numbers.length) return;
  const fs = Math.max(8, s.size * 0.055);
  s.ctx.font = `500 ${fs}px 'Barlow Condensed','Outfit',sans-serif`;
  s.ctx.textAlign = "center";
  s.ctx.textBaseline = "middle";
  const step = s.density === "sm" && numbers.length > 5 ? 2 : 1;
  numbers.forEach((num, idx) => {
    if (step > 1 && idx % step !== 0 && idx !== numbers.length - 1) return;
    const angle = s.rad(sa + num / max * totalSweep);
    s.ctx.fillStyle = s.palette.numbers;
    s.ctx.fillText(
      num.toString(),
      s.cx + Math.cos(angle) * s.radius * 0.56,
      s.cy + Math.sin(angle) * s.radius * 0.56
    );
  });
}
function drawArcBar(s, c, progress, sa, totalSweep) {
  const ab = c.arcBar;
  if (!ab) return;
  const arcR = s.radius * 0.96;
  s.ctx.beginPath();
  s.ctx.arc(s.cx, s.cy, arcR, s.rad(sa), s.rad(sa + totalSweep));
  s.ctx.strokeStyle = s.palette.trackAlpha;
  s.ctx.lineWidth = 5;
  s.ctx.lineCap = "round";
  s.ctx.stroke();
  const val = ab.value / ab.max * totalSweep * progress;
  const fillEnd = s.rad(sa + val);
  const arcFrac = totalSweep / 360;
  const g = s.ctx.createConicGradient(s.rad(sa), s.cx, s.cy);
  const stops = ab.colorStops || ["#DC0000", "#FFC72C", "#00A651"];
  stops.forEach((col, i) => g.addColorStop(i / (stops.length - 1) * arcFrac, col));
  s.ctx.beginPath();
  s.ctx.arc(s.cx, s.cy, arcR, s.rad(sa), fillEnd);
  s.ctx.strokeStyle = g;
  s.ctx.lineWidth = 5;
  s.ctx.lineCap = "round";
  s.ctx.stroke();
  const na = s.rad(sa + val);
  s.ctx.beginPath();
  s.ctx.arc(s.cx + Math.cos(na) * arcR, s.cy + Math.sin(na) * arcR, 3, 0, Math.PI * 2);
  s.ctx.fillStyle = s.palette.arcDot;
  s.ctx.fill();
  const fs = Math.max(7, s.size * 0.04);
  if (ab.labelCenter) {
    s.ctx.font = `600 ${fs}px 'Barlow Condensed',sans-serif`;
    s.ctx.fillStyle = "#00A651";
    s.ctx.textAlign = "center";
    s.ctx.textBaseline = "middle";
    s.ctx.fillText(ab.labelCenter, s.cx, s.cy + s.radius * 0.78);
  }
  const sfs = Math.max(6, s.size * 0.03);
  if (ab.labelLeft) {
    s.ctx.font = `400 ${sfs}px 'Inter',sans-serif`;
    s.ctx.fillStyle = s.palette.muted;
    s.ctx.textAlign = "left";
    s.ctx.fillText(ab.labelLeft, s.cx - s.radius * 0.65, s.cy + s.radius * 0.92);
  }
  if (ab.labelRight) {
    s.ctx.textAlign = "right";
    s.ctx.fillText(ab.labelRight, s.cx + s.radius * 0.65, s.cy + s.radius * 0.92);
  }
}

// src/ts/gauge-engine-complications.ts
function drawComplications(state, progress) {
  const c = state.config;
  const comp = c.complications || c;
  const { ctx, size } = state;
  const cx = size / 2, cy = size / 2, radius = size * 0.44;
  const P = state.palette;
  if (comp.crosshair) {
    drawCrosshair(
      ctx,
      comp.crosshair,
      cx,
      cy,
      radius,
      size,
      progress,
      P,
      c
    );
  }
  if (comp.multigraph) {
    drawMultigraph(
      ctx,
      comp.multigraph,
      cx,
      cy,
      radius,
      size,
      progress,
      P
    );
  }
}
function drawCrosshair(ctx, ch, cx, cy, radius, size, progress, P, cfg) {
  const gridR = radius * 0.78;
  ctx.strokeStyle = ch.gridColor || "#5a4a20";
  ctx.lineWidth = 0.8;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.moveTo(cx - gridR, cy);
  ctx.lineTo(cx + gridR, cy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy - gridR);
  ctx.lineTo(cx, cy + gridR);
  ctx.stroke();
  ctx.globalAlpha = 0.25;
  for (let i = 1; i <= 4; i++) {
    const d = gridR * i / 4;
    ctx.beginPath();
    ctx.moveTo(cx - gridR, cy - d);
    ctx.lineTo(cx + gridR, cy - d);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - gridR, cy + d);
    ctx.lineTo(cx + gridR, cy + d);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - d, cy - gridR);
    ctx.lineTo(cx - d, cy + gridR);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + d, cy - gridR);
    ctx.lineTo(cx + d, cy + gridR);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const sfs = Math.max(5, size * 0.028);
  ctx.font = `400 ${sfs}px 'Inter', sans-serif`;
  ctx.fillStyle = P.muted;
  for (let i = 1; i <= 4; i++) {
    const d = gridR * i / 4;
    const lbl = (i * 0.25).toFixed(2);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(lbl, cx - gridR - 3, cy - d);
    ctx.fillText(lbl, cx - gridR - 3, cy + d);
  }
  const lfs = Math.max(6, size * 0.035);
  ctx.font = `600 ${lfs}px 'Barlow Condensed', 'Outfit', sans-serif`;
  ctx.fillStyle = P.axisLabel;
  ctx.textAlign = "center";
  if (ch.labelTop) {
    ctx.textBaseline = "bottom";
    ctx.fillText(ch.labelTop, cx, cy - gridR - 4);
  }
  if (ch.labelBottom) {
    ctx.textBaseline = "top";
    ctx.fillText(ch.labelBottom, cx, cy + gridR + 4);
  }
  if (ch.labelLeft) {
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(ch.labelLeft, cx - gridR - 4, cy);
  }
  if (ch.labelRight) {
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(ch.labelRight, cx + gridR + 4, cy);
  }
  if (ch.title) {
    const tfs = Math.max(6, size * 0.04);
    ctx.font = `600 ${tfs}px 'Barlow Condensed', 'Outfit', sans-serif`;
    ctx.fillStyle = P.axisTitle;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(ch.title, cx, cy - gridR - lfs - 6);
  }
  const dotCol = ch.dotColor || cssVar("--mn-accent");
  const dotX = cx + ch.x * gridR * progress;
  const dotY = cy + ch.y * gridR * progress;
  ctx.setLineDash([3, 3]);
  ctx.strokeStyle = dotCol;
  ctx.lineWidth = 0.8;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(cx - gridR, dotY);
  ctx.lineTo(cx + gridR, dotY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(dotX, cy - gridR);
  ctx.lineTo(dotX, cy + gridR);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
  ctx.save();
  ctx.shadowColor = dotCol;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
  ctx.fillStyle = dotCol;
  ctx.fill();
  ctx.restore();
  ctx.beginPath();
  ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  if (ch.scatterDots) {
    ch.scatterDots.forEach((sd) => {
      const sdx = cx + sd.x * gridR * progress;
      const sdy = cy + sd.y * gridR * progress;
      const sdR = sd.r || 3;
      ctx.save();
      ctx.globalAlpha = 0.6 + 0.4 * progress;
      ctx.shadowColor = sd.color;
      ctx.shadowBlur = sdR * 2;
      ctx.beginPath();
      ctx.arc(sdx, sdy, sdR, 0, Math.PI * 2);
      ctx.fillStyle = sd.color;
      ctx.fill();
      ctx.restore();
      ctx.beginPath();
      ctx.arc(sdx, sdy, sdR * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fill();
    });
  }
  if (cfg.quadrantCounts) {
    const qc = cfg.quadrantCounts;
    const qfs = Math.max(8, size * 0.05);
    const off = gridR * 0.5;
    ctx.font = `700 ${qfs}px 'Barlow Condensed', 'Outfit', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = P.axisLabel;
    ctx.fillText(qc.tl, cx - off, cy - off);
    ctx.fillStyle = cssVar("--mn-accent");
    ctx.fillText(qc.tr, cx + off, cy - off);
    ctx.fillStyle = P.dimmed;
    ctx.fillText(qc.bl, cx - off, cy + off);
    ctx.fillStyle = P.axisLabel;
    ctx.fillText(qc.br, cx + off, cy + off);
    ctx.globalAlpha = 1;
  }
}
function drawMultigraph(ctx, mg, cx, cy, radius, size, progress, P) {
  const data = mg.data;
  const gLeft = cx - radius * 0.65, gRight = cx + radius * 0.65;
  const gTop = cy - radius * 0.15, gBottom = cy + radius * 0.55;
  const gWidth = gRight - gLeft, gHeight = gBottom - gTop;
  const dataMin = Math.min(...data) * 0.8, dataMax = Math.max(...data) * 1.1;
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 4; i++) {
    const y = gTop + i / 4 * gHeight;
    ctx.beginPath();
    ctx.moveTo(gLeft, y);
    ctx.lineTo(gRight, y);
    ctx.stroke();
  }
  const visiblePoints = Math.max(1, Math.ceil(data.length * progress));
  ctx.beginPath();
  ctx.moveTo(gLeft, gBottom);
  for (let i = 0; i < visiblePoints; i++) {
    const x = gLeft + i / (data.length - 1) * gWidth;
    const y = gBottom - (data[i] - dataMin) / (dataMax - dataMin) * gHeight;
    ctx.lineTo(x, y);
  }
  const lastX = gLeft + (visiblePoints - 1) / (data.length - 1) * gWidth;
  ctx.lineTo(lastX, gBottom);
  ctx.closePath();
  const areaGrad = ctx.createLinearGradient(0, gTop, 0, gBottom);
  areaGrad.addColorStop(0, mg.color + "30");
  areaGrad.addColorStop(1, mg.color + "05");
  ctx.fillStyle = areaGrad;
  ctx.fill();
  ctx.beginPath();
  for (let i = 0; i < visiblePoints; i++) {
    const x = gLeft + i / (data.length - 1) * gWidth;
    const y = gBottom - (data[i] - dataMin) / (dataMax - dataMin) * gHeight;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = mg.color;
  ctx.lineWidth = 1.8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
  if (visiblePoints > 0) {
    const endI = visiblePoints - 1;
    const ex = gLeft + endI / (data.length - 1) * gWidth;
    const ey = gBottom - (data[endI] - dataMin) / (dataMax - dataMin) * gHeight;
    ctx.save();
    ctx.shadowColor = mg.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(ex, ey, 3, 0, Math.PI * 2);
    ctx.fillStyle = mg.color;
    ctx.fill();
    ctx.restore();
  }
  if (mg.label) {
    const lfs = Math.max(6, size * 0.035);
    ctx.font = `600 ${lfs}px 'Barlow Condensed', 'Outfit', sans-serif`;
    ctx.fillStyle = P.sparkLabel;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(mg.label, cx, gTop - 4);
  }
}

// src/ts/gauge-engine.ts
var SIZES = { sm: 120, md: 220, lg: 320 };
var FerrariGauge = class {
  constructor(canvas) {
    this.srSpan = null;
    this._resizeObserver = null;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.config = JSON.parse(canvas.dataset.gauge || "{}");
    this.applyColorMode();
    this.dpr = window.devicePixelRatio || 1;
    this.init();
    if (canvas.dataset.size === "fluid") this._attachFluidObserver();
  }
  get palette() {
    const accent = getAccent();
    return buildGaugePalette(accent);
  }
  /** Initialize canvas size from data attribute or parent bounds. */
  init() {
    const sizeKey = this.canvas.dataset.size;
    let size;
    if (sizeKey && sizeKey !== "fluid" && SIZES[sizeKey]) {
      size = SIZES[sizeKey];
    } else {
      const rect = (this.canvas.parentElement || this.canvas).getBoundingClientRect();
      size = Math.min(rect.width, rect.height);
    }
    this.canvas.width = size * this.dpr;
    this.canvas.height = size * this.dpr;
    this.canvas.style.width = size + "px";
    this.canvas.style.height = size + "px";
    this.ctx.scale(this.dpr, this.dpr);
    this.size = size;
    this.cx = size / 2;
    this.cy = size / 2;
    this.radius = size * 0.4;
    this.density = size <= 140 ? "sm" : size <= 260 ? "md" : "lg";
    this.initA11y();
    this.animate();
  }
  /** Set up ARIA attributes and screen-reader helpers on the canvas. */
  initA11y() {
    this.canvas.setAttribute("role", "img");
    const label = this.buildA11yLabel();
    this.canvas.setAttribute("aria-label", label);
    this.canvas.textContent = label;
    if (!this.srSpan) {
      this.srSpan = document.createElement("span");
      this.srSpan.className = "mn-sr-only";
      this.canvas.parentElement?.insertBefore(this.srSpan, this.canvas.nextSibling);
    }
    this.srSpan.textContent = label;
  }
  /** Build an accessible label from gauge config values. */
  buildA11yLabel() {
    const c = this.config;
    const value = c.value ?? 0;
    const unit = c.unit || "";
    const label = c.label || "";
    const suffix = unit ? `${value}${unit}` : String(value);
    return label ? `Gauge: ${suffix}, ${label}` : `Gauge: ${suffix}`;
  }
  /** Sync aria-label and sr-only span with current config. */
  updateA11y() {
    const label = this.buildA11yLabel();
    this.canvas.setAttribute("aria-label", label);
    this.canvas.textContent = label;
    if (this.srSpan) this.srSpan.textContent = label;
  }
  /** Redraw at full progress. */
  redraw() {
    this.updateA11y();
    this.draw(1);
  }
  /** Animate from 0 to full with ease-in-out-cubic. */
  animate() {
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches || document.documentElement.classList.contains("mn-reduced-motion") || document.body.classList.contains("mn-a11y-reduced-motion");
    if (prefersReducedMotion) {
      this.draw(1);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      this.draw(ease(p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  /** Convert degrees to radians. */
  rad(deg) {
    return deg * Math.PI / 180;
  }
  /** Draw the gauge at a given animation progress (0..1). */
  draw(progress) {
    const state = {
      ctx: this.ctx,
      cx: this.cx,
      cy: this.cy,
      radius: this.radius,
      size: this.size,
      config: this.config,
      palette: this.palette,
      density: this.density,
      rad: this.rad
    };
    drawGauge(state, progress);
    drawComplications(state, progress);
  }
  /** Attach ResizeObserver for size='fluid' mode. */
  _attachFluidObserver() {
    if (typeof window === "undefined" || !window.ResizeObserver) return;
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const handler = debounce(() => {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.init();
    }, 150);
    this._resizeObserver = new ResizeObserver(handler);
    this._resizeObserver.observe(parent);
  }
  /** Clean up ResizeObserver and screen reader helpers. */
  destroy() {
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
    if (this.srSpan) {
      this.srSpan.remove();
      this.srSpan = null;
    }
  }
  /**
   * Apply colorMode to arcBar colorStops if not explicitly set.
   * 'higher-better': green at high values (red→yellow→green)
   * 'lower-better': green at low values (green→yellow→red)
   */
  applyColorMode() {
    const mode = this.config.colorMode;
    if (!mode) return;
    const c = this.config.complications || {};
    const ab = c.arcBar || {};
    if (!ab.colorStops) {
      ab.colorStops = mode === "lower-better" ? ["#00A651", "#FFC72C", "#DC0000"] : ["#DC0000", "#FFC72C", "#00A651"];
    }
    if (!ab.value) ab.value = this.config.value;
    if (!ab.max) ab.max = this.config.max;
    c.arcBar = ab;
    this.config.complications = c;
  }
};

// src/ts/speedometer-palette.ts
var SPEEDO_FONT = "'Barlow Condensed', 'Outfit', sans-serif";
var SPEEDO_SIZES = { sm: 120, md: 220, lg: 320 };
var SWEEP = Math.PI * 1.5;
var START = Math.PI * 0.75;
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
function valueToAngle(v, max) {
  return START + Math.min(Math.max(v, 0), max) / max * SWEEP;
}
function speedoPalette() {
  const cl = document.body.classList;
  const isCB = cl.contains("mn-colorblind");
  const isNero = cl.contains("mn-nero");
  const isAvorio = cl.contains("mn-avorio");
  const D = {
    needle: null,
    arc: null,
    barStops: null,
    bg: ["#0d0d0d", "#1a1a1a", "#2c2c2c"],
    border: "#3a3a3a",
    minorTick: "#444",
    majStroke: "#aaa",
    majText: "#c8c8c8",
    capFill: "#2a2a2a",
    capStroke: "#555",
    value: "#fafafa",
    unit: "#888",
    subLabel: "#666",
    barBg: "#1a1a1a",
    barDim: "#666",
    barBright: "#aaa"
  };
  const isSugar = cl.contains("mn-sugar");
  if (isCB) {
    return {
      ...D,
      needle: "#4D9DE0",
      arc: "#7EC8E3",
      barStops: ["#E15759", "#EDC948", "#59A14F"]
    };
  }
  if (isSugar) {
    return {
      ...D,
      bg: ["#f8f8fa", "#f0f0f4", "#e4e4ea"],
      border: "#d0d0d8",
      minorTick: "#999",
      majStroke: "#555",
      majText: "#333",
      capFill: "#333",
      capStroke: "#555",
      value: "#1a1a1a",
      unit: "#555",
      subLabel: "#777",
      barBg: "#e4e4ea",
      barDim: "#777",
      barBright: "#444",
      needle: "#DC0000",
      arc: "#DC0000"
    };
  }
  if (isAvorio) {
    return {
      ...D,
      bg: ["#faf3e6", "#f0e4cc", "#e8d5b0"],
      border: "#c4b99a",
      minorTick: "#999",
      majStroke: "#555",
      majText: "#333",
      capFill: "#333",
      capStroke: "#555",
      value: "#1a1a1a",
      unit: "#555",
      subLabel: "#777",
      barBg: "#e8d5b0",
      barDim: "#777",
      barBright: "#444",
      needle: "#DC0000",
      arc: "#DC0000"
    };
  }
  if (isNero) {
    return {
      ...D,
      bg: ["#050505", "#111", "#1a1a1a"],
      border: "#2a2a2a",
      minorTick: "#333",
      capFill: "#1a1a1a",
      capStroke: "#444",
      barBg: "#111"
    };
  }
  return D;
}

// src/ts/speedometer.ts
var FONT = "'Barlow Condensed', 'Outfit', sans-serif";
function drawSpeedo(ctx, dim, s, cx, cy, R, curAngle, curVal, barVal, options) {
  const p = speedoPalette();
  const needleCol = p.needle || options.needleColor;
  const arcCol = p.arc || options.arcColor;
  const bg = p.bg;
  ctx.save();
  ctx.clearRect(0, 0, dim, dim);
  const bgGrad = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 1.15);
  bgGrad.addColorStop(0, bg[0]);
  bgGrad.addColorStop(0.82, bg[1]);
  bgGrad.addColorStop(1, bg[2]);
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.12, 0, Math.PI * 2);
  ctx.fillStyle = bgGrad;
  ctx.fill();
  ctx.strokeStyle = p.border;
  ctx.lineWidth = 1.5 * s;
  ctx.stroke();
  const aEnd = options.arcEnd != null ? options.arcEnd : curVal;
  if (aEnd > options.arcStart) {
    ctx.beginPath();
    ctx.arc(
      cx,
      cy,
      R * 1.03,
      valueToAngle(options.arcStart, options.max),
      valueToAngle(aEnd, options.max)
    );
    ctx.strokeStyle = arcCol;
    ctx.lineWidth = 4 * s;
    ctx.lineCap = "round";
    ctx.globalAlpha = 0.85;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.lineCap = "butt";
  }
  const ticks = options.ticks;
  const minorTicks = options.minorTicks;
  const max = options.max;
  const tOut = R * 0.95, majL = 12 * s, minL = 6 * s;
  const segs = ticks.length - 1, totalMinor = segs * (minorTicks + 1);
  ctx.strokeStyle = p.minorTick;
  ctx.lineWidth = 1 * s;
  for (let i = 0; i <= totalMinor; i++) {
    const mv = i / totalMinor * max;
    if (ticks.indexOf(Math.round(mv)) !== -1) continue;
    const ma = valueToAngle(mv, max);
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(ma) * tOut, cy + Math.sin(ma) * tOut);
    ctx.lineTo(cx + Math.cos(ma) * (tOut - minL), cy + Math.sin(ma) * (tOut - minL));
    ctx.stroke();
  }
  ctx.strokeStyle = p.majStroke;
  ctx.lineWidth = 2.5 * s;
  ctx.fillStyle = p.majText;
  ctx.font = "bold " + Math.round(11 * s) + "px " + FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let t = 0; t < ticks.length; t++) {
    const tv = ticks[t], ta = valueToAngle(tv, max);
    const c1 = Math.cos(ta), s1 = Math.sin(ta);
    ctx.beginPath();
    ctx.moveTo(cx + c1 * tOut, cy + s1 * tOut);
    ctx.lineTo(cx + c1 * (tOut - majL), cy + s1 * (tOut - majL));
    ctx.stroke();
    ctx.fillText(String(tv), cx + c1 * (tOut - majL - 10 * s), cy + s1 * (tOut - majL - 10 * s));
  }
  const nLen = R * 0.78, nTail = R * 0.18, nW = 4 * s;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(curAngle);
  ctx.beginPath();
  ctx.moveTo(nLen, 0);
  ctx.lineTo(-nTail, -nW);
  ctx.lineTo(-nTail, nW);
  ctx.closePath();
  ctx.fillStyle = needleCol;
  ctx.shadowColor = needleCol;
  ctx.shadowBlur = 8 * s;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();
  ctx.beginPath();
  ctx.arc(cx, cy, 6 * s, 0, Math.PI * 2);
  ctx.fillStyle = p.capFill;
  ctx.fill();
  ctx.strokeStyle = p.capStroke;
  ctx.lineWidth = 1.5 * s;
  ctx.stroke();
  ctx.fillStyle = p.value;
  ctx.font = "bold " + Math.round(32 * s) + "px " + FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(Math.round(curVal)), cx, cy + 20 * s);
  ctx.fillStyle = p.unit;
  ctx.font = Math.round(11 * s) + "px " + FONT;
  ctx.fillText(options.unit, cx, cy + 37 * s);
  if (options.subLabel) {
    ctx.fillStyle = p.subLabel;
    ctx.font = Math.round(9 * s) + "px " + FONT;
    ctx.fillText(options.subLabel, cx, cy + 50 * s);
  }
  const bar = options.bar;
  if (bar) {
    const bW = R * 1.2, bH = 6 * s, bR = bH / 2;
    const bX = cx - bW / 2, bY = cy + R * 0.72;
    const stops = p.barStops || bar.colorStops || [cssVar("--signal-danger", "#DC0000"), cssVar("--signal-warning", "#FFC72C"), cssVar("--signal-ok", "#00A651")];
    ctx.beginPath();
    ctx.roundRect?.(bX, bY, bW, bH, bR);
    ctx.fillStyle = p.barBg;
    ctx.fill();
    const fW = bW * Math.max(0, Math.min(1, barVal));
    if (fW > 1) {
      const gr = ctx.createLinearGradient(bX, 0, bX + bW, 0);
      stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c));
      ctx.save();
      ctx.beginPath();
      ctx.roundRect?.(bX, bY, fW, bH, bR);
      ctx.clip();
      ctx.fillStyle = gr;
      ctx.fillRect(bX, bY, bW, bH);
      ctx.restore();
    }
    ctx.font = Math.round(8 * s) + "px " + FONT;
    ctx.textBaseline = "top";
    const lY = bY + bH + 3 * s;
    if (bar.labelLeft) {
      ctx.fillStyle = p.barDim;
      ctx.textAlign = "left";
      ctx.fillText(bar.labelLeft, bX, lY);
    }
    if (bar.labelRight) {
      ctx.fillStyle = p.barDim;
      ctx.textAlign = "right";
      ctx.fillText(bar.labelRight, bX + bW, lY);
    }
    if (bar.label) {
      ctx.fillStyle = p.barBright;
      ctx.textAlign = "center";
      ctx.fillText(bar.label, cx, lY);
    }
  }
  ctx.restore();
}
function speedometer(canvas, opts) {
  const options = {
    value: 0,
    max: 100,
    unit: "",
    size: "md",
    ticks: [0, 25, 50, 75, 100],
    minorTicks: 4,
    needleColor: cssVar("--signal-danger", "#DC0000"),
    arcColor: cssVar("--mn-accent"),
    arcStart: 0,
    arcEnd: null,
    bar: null,
    subLabel: null,
    animate: true,
    ...opts
  };
  const isFluid = options.size === "fluid";
  let dim;
  if (isFluid) {
    const rect = (canvas.parentElement || canvas).getBoundingClientRect();
    dim = Math.min(rect.width, rect.height) || SPEEDO_SIZES.md;
  } else if (typeof options.size === "number") {
    dim = options.size;
  } else {
    dim = SPEEDO_SIZES[options.size] || SPEEDO_SIZES.md;
  }
  const dpr = window.devicePixelRatio || 1;
  canvas.width = dim * dpr;
  canvas.height = dim * dpr;
  canvas.style.width = dim + "px";
  canvas.style.height = dim + "px";
  const _ctx = canvas.getContext("2d");
  if (!_ctx) {
    console.warn("[Maranello] speedometer: 2D context unavailable");
    return;
  }
  const ctx = _ctx;
  ctx.scale(dpr, dpr);
  const s = dim / 220;
  const cx = dim / 2, cy = dim / 2, R = dim * 0.4;
  const max = options.max, unit = options.unit || "";
  const buildLabel = (v) => `Speedometer: ${unit ? `${Math.round(v)}${unit}` : Math.round(v)} of ${max}`;
  canvas.setAttribute("role", "img");
  const initLabel = buildLabel(options.value);
  canvas.setAttribute("aria-label", initLabel);
  canvas.textContent = initLabel;
  canvas.nextSibling?.classList?.contains("mn-sr-only") && canvas.nextSibling.remove();
  const srSpan = document.createElement("span");
  srSpan.className = "mn-sr-only";
  srSpan.textContent = initLabel;
  canvas.parentElement?.insertBefore(srSpan, canvas.nextSibling);
  function updateA11y(v) {
    const l = buildLabel(v);
    canvas.setAttribute("aria-label", l);
    canvas.textContent = l;
    srSpan.textContent = l;
  }
  let curAngle = valueToAngle(options.value, max);
  let curVal = options.value;
  let barVal = options.bar ? options.bar.value || 0 : 0;
  let animId = null;
  function draw() {
    drawSpeedo(ctx, dim, s, cx, cy, R, curAngle, curVal, barVal, options);
  }
  function animateTo(toAngle, toVal) {
    if (animId) cancelAnimationFrame(animId);
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches || document.documentElement.classList.contains("mn-reduced-motion") || document.body.classList.contains("mn-a11y-reduced-motion");
    if (prefersReducedMotion) {
      curAngle = toAngle;
      curVal = toVal;
      draw();
      updateA11y(toVal);
      animId = null;
      return;
    }
    const fromA = curAngle, fromV = curVal, t0 = performance.now(), dur = 800;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur), ep = easeOutCubic(p);
      curAngle = fromA + (toAngle - fromA) * ep;
      curVal = fromV + (toVal - fromV) * ep;
      draw();
      if (p < 1) animId = requestAnimationFrame(tick);
      else {
        animId = null;
        updateA11y(toVal);
      }
    };
    tick(performance.now());
  }
  if (options.animate) {
    curAngle = START;
    curVal = 0;
    animateTo(valueToAngle(options.value, max), options.value);
  } else {
    draw();
  }
  let resizeObs = null;
  if (isFluid && window.ResizeObserver && canvas.parentElement) {
    const p = canvas.parentElement;
    resizeObs = new ResizeObserver(debounce(() => {
      const r = p.getBoundingClientRect();
      const nd = Math.min(r.width, r.height);
      if (nd <= 0 || nd === dim) return;
      if (animId) cancelAnimationFrame(animId);
      resizeObs?.disconnect();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      speedometer(canvas, { ...opts || {}, size: nd, value: curVal, animate: false });
    }, 150));
    resizeObs.observe(p);
  }
  return {
    setValue(v) {
      const ta = valueToAngle(v, max);
      if (options.animate) animateTo(ta, v);
      else {
        curAngle = ta;
        curVal = v;
        draw();
        updateA11y(v);
      }
    },
    setBar(v) {
      barVal = Math.max(0, Math.min(1, v));
      if (!animId) draw();
    },
    destroy() {
      if (animId) cancelAnimationFrame(animId);
      resizeObs?.disconnect();
      ctx.clearRect(0, 0, dim * dpr, dim * dpr);
      srSpan.remove();
    }
  };
}

export {
  buildGaugePalette,
  FerrariGauge,
  SPEEDO_FONT,
  SPEEDO_SIZES,
  SWEEP,
  START,
  easeOutCubic,
  valueToAngle,
  speedoPalette,
  speedometer
};
//# sourceMappingURL=chunk-TXUQ7KRN.js.map
