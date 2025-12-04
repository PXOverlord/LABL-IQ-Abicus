'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { analysisAPI } from '../../lib/api';

type IndexItem = {
  id: string;
  timestamp?: string;
  filename?: string | null;
  merchant?: string | null;
  summary?: { total_savings?: number };
  shipment_count?: number;
};

type Analysis = {
  id: string;
  timestamp: string;
  filename?: string | null;
  merchant?: string | null;
  title?: string | null;
  tags?: string[] | null;
  results: any[];
  summary: any;
  settings: any;
};

const COLORS = {
  bg: '#f6f7fb',
  panel: '#ffffff',
  text: '#0f172a',
  subtext: '#64748b',
  border: '#e2e8f0',
  primary: '#111827',
  accent: '#2563eb',
  accentSoft: '#dbeafe',
  success: '#059669',
  grid: '#eef2f7',
};

type Mode = 'dashboard' | 'analyses' | 'detail';

export default function PreviewPage() {
  const [mode, setMode] = useState<Mode>('dashboard');
  const [analyses, setAnalyses] = useState<IndexItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [detail, setDetail] = useState<Analysis | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await analysisAPI.getHistory({ limit: 20 });
        const mapped: IndexItem[] = data.map((item) => ({
          id: item.id,
          timestamp: item.createdAt,
          filename: item.fileName ?? item.filename ?? null,
          merchant: item.merchant ?? null,
          summary: { total_savings: item.totalSavings ?? item.summary?.total_savings },
          shipment_count: item.totalPackages ?? (Array.isArray(item.results) ? item.results.length : undefined),
        }));
        setAnalyses(mapped);
        if (!selectedId && mapped.length) setSelectedId(mapped[0].id);
      } catch {
        const sample: IndexItem[] = [
          { id: 'demo-1', timestamp: new Date().toISOString(), filename: 'acme_july.csv', merchant: 'ACME', summary: { total_savings: 372.11 }, shipment_count: 498 },
          { id: 'demo-2', timestamp: new Date().toISOString(), filename: 'globo_aug.csv', merchant: 'Globo', summary: { total_savings: 118.64 }, shipment_count: 203 },
          { id: 'demo-3', timestamp: new Date().toISOString(), filename: 'windfall.csv', merchant: 'Windfall', summary: { total_savings: 42.8 }, shipment_count: 77 },
        ];
        setAnalyses(sample);
        if (!selectedId && sample.length) setSelectedId(sample[0].id);
      }
    };
    run();
  }, []);

  useEffect(() => {
    if (mode !== 'detail' || !selectedId) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    const run = async () => {
      try {
        if (selectedId.startsWith('demo-')) {
          const fake: Analysis = {
            id: selectedId,
            timestamp: new Date().toISOString(),
            filename: selectedId === 'demo-1' ? 'acme_july.csv' : 'demo.csv',
            merchant: selectedId === 'demo-1' ? 'ACME' : 'Globo',
            title: 'Q3 Rate Analysis',
            tags: ['q3', 'pilot'],
            summary: { total_savings: 372.11, avg_zone: 5.2, avg_weight: 3.1 },
            settings: { das_surcharge: 1.98, edas_surcharge: 3.92, remote_surcharge: 14.15, markup_percent: 8 },
            results: Array.from({ length: 120 }).map((_, i) => ({
              shipment_id: `S${i + 1}`,
              zone: 1 + (i % 8),
              weight: Math.round((Math.random() * 5 + 0.2) * 10) / 10,
              final_rate: Math.round((Math.random() * 8 + 4) * 100) / 100,
            })),
          };
          if (!cancelled) setDetail(fake);
          return;
        }
        const data = await analysisAPI.getResults(selectedId);
        if (!cancelled) setDetail(data);
      } catch {
        if (!cancelled) setDetail(null);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [mode, selectedId]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const logicalWidth = 1200;
    const logicalHeight = 800;
    const dpr = window.devicePixelRatio || 1;
    const drawScale = scale;

    c.width = Math.floor(logicalWidth * dpr * drawScale);
    c.height = Math.floor(logicalHeight * dpr * drawScale);
    c.style.width = `${logicalWidth * drawScale}px`;
    c.style.height = `${logicalHeight * drawScale}px`;

    const ctx = c.getContext('2d');
    if (!ctx) return;

    ctx.resetTransform();
    ctx.scale(dpr * drawScale, dpr * drawScale);
    drawBackground(ctx, logicalWidth, logicalHeight, showGrid);

    drawSidebar(ctx, 0, 0, 240, logicalHeight);
    drawTopbar(ctx, 240, 0, logicalWidth - 240, 64);

    const bodyX = 240;
    const bodyY = 64;
    const bodyW = logicalWidth - 240;
    const bodyH = logicalHeight - 64;

    if (mode === 'dashboard') {
      drawDashboard(ctx, bodyX, bodyY, bodyW, bodyH, analyses.slice(0, 5));
    } else if (mode === 'analyses') {
      drawAnalyses(ctx, bodyX, bodyY, bodyW, bodyH, analyses);
    } else {
      drawDetail(ctx, bodyX, bodyY, bodyW, bodyH, detail, selectedId);
    }
  }, [mode, analyses, detail, scale, showGrid]);

  const header = useMemo(() => {
    if (mode === 'dashboard') return 'Dashboard preview';
    if (mode === 'analyses') return 'Analyses list preview';
    return 'Analysis detail preview';
  }, [mode]);

  return (
    <div className="p-6 space-y-4">
      <div className="text-xl">{header}</div>
      <div className="flex items-center gap-2 flex-wrap">
        <select className="border rounded px-2 py-1" value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
          <option value="dashboard">Dashboard</option>
          <option value="analyses">Analyses</option>
          <option value="detail">Analysis detail</option>
        </select>

        <select
          className="border rounded px-2 py-1"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          disabled={mode !== 'detail'}
          title={mode !== 'detail' ? 'Switch to detail mode to choose analysis' : ''}
        >
          <option value="">Select analysis…</option>
          {analyses.map((a) => (
            <option key={a.id} value={a.id}>
              {a.timestamp?.slice(0, 16)} • {a.filename || a.id}{a.merchant ? ` • ${a.merchant}` : ''}
            </option>
          ))}
        </select>

        <label className="ml-2 text-sm text-gray-600">
          Scale
          <select className="ml-1 border rounded px-2 py-1" value={String(scale)} onChange={(e) => setScale(Number(e.target.value))}>
            <option value="0.8">0.8×</option>
            <option value="1">1×</option>
            <option value="1.25">1.25×</option>
            <option value="1.5">1.5×</option>
            <option value="2">2×</option>
          </select>
        </label>

        <label className="ml-2 text-sm text-gray-600 flex items-center gap-2">
          <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} />
          Show grid
        </label>

        <button
          className="border rounded px-3 py-1"
          onClick={() => {
            const c = canvasRef.current;
            if (!c) return;
            c.toBlob((blob) => {
              if (!blob) return;
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = `labl_iq_preview_${mode}.png`;
              a.click();
              URL.revokeObjectURL(a.href);
            });
          }}
        >
          Download PNG
        </button>
      </div>

      <div className="border rounded bg-white overflow-hidden inline-block">
        <canvas ref={canvasRef} />
      </div>

      <div className="text-sm text-gray-600">
        This is a canvas mock using your live data when available. It does not alter any state.
      </div>
    </div>
  );
}

/* drawing helpers */

function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number, showGrid: boolean) {
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, w, h);
  if (!showGrid) return;
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 16) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(w, y + 0.5);
    ctx.stroke();
  }
}

function drawSidebar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  roundRect(ctx, x, y, w, h, 0, COLORS.panel);
  ctx.fillStyle = COLORS.text;
  ctx.font = '600 16px Inter, system-ui, -apple-system, sans-serif';
  ctx.fillText('LABL IQ', x + 16, y + 32);
  const items = ['Dashboard', 'Upload', 'Analysis', 'History', 'Export', 'Reports', 'Settings'];
  ctx.font = '500 12px Inter, system-ui, -apple-system, sans-serif';
  ctx.fillStyle = COLORS.subtext;
  items.forEach((label, i) => {
    const yy = y + 64 + i * 28;
    ctx.fillText(label, x + 16, yy);
  });
}

function drawTopbar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  roundRect(ctx, x, y, w, h, 0, COLORS.panel);
  ctx.fillStyle = COLORS.text;
  ctx.font = '600 14px Inter, system-ui, -apple-system, sans-serif';
  ctx.fillText('Shipping Intelligence Preview', x + 16, y + 24);
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 1;
  roundStroke(ctx, x + w - 320, y + 12, 300, 36, 8);
  ctx.fillStyle = COLORS.subtext;
  ctx.font = '500 12px Inter, system-ui, -apple-system, sans-serif';
  ctx.fillText('Search…', x + w - 300, y + 34);
}

function drawDashboard(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, recent: IndexItem[]) {
  const colW = (w - 48) / 3;
  const top = y + 16;
  const cardH = 120;
  drawStatCard(ctx, x + 16, top, colW, cardH, 'Total savings', sumSavings(recent), '$');
  drawStatCard(ctx, x + 16 + colW + 8, top, colW, cardH, 'Shipments analyzed', sumShipments(recent), '');
  const avg = recent.length ? (sumSavings(recent) / recent.length) : 0;
  drawStatCard(ctx, x + 16 + (colW + 8) * 2, top, colW, cardH, 'Avg savings per analysis', avg, '$');

  const listY = top + cardH + 16;
  drawPanel(ctx, x + 16, listY, w - 32, h - (listY - y) - 16, 'Recent analyses');

  const rowX = x + 32;
  const rowY0 = listY + 48;
  const rowH = 34;

  ctx.fillStyle = COLORS.subtext;
  ctx.font = '600 12px Inter, system-ui, -apple-system, sans-serif';
  ctx.fillText('Timestamp', rowX, rowY0 - 14);
  ctx.fillText('Filename', rowX + 240, rowY0 - 14);
  ctx.fillText('Merchant', rowX + 540, rowY0 - 14);
  ctx.fillText('Shipments', rowX + 740, rowY0 - 14);
  ctx.fillText('Savings', rowX + 860, rowY0 - 14);

  ctx.font = '500 12px Inter, system-ui, -apple-system, sans-serif';
  ctx.fillStyle = COLORS.text;
  recent.slice(0, 8).forEach((a, i) => {
    const yy = rowY0 + i * rowH;
    ctx.strokeStyle = COLORS.border;
    ctx.beginPath();
    ctx.moveTo(rowX, yy - rowH + 8);
    ctx.lineTo(rowX + 980, yy - rowH + 8);
    ctx.stroke();

    ctx.fillStyle = COLORS.text;
    ctx.fillText((a.timestamp || '').slice(0, 16), rowX, yy);
    ctx.fillText(trim(a.filename || a.id, 28), rowX + 240, yy);
    ctx.fillText(trim(a.merchant || '—', 18), rowX + 540, yy);
    ctx.fillText(String(a.shipment_count ?? 0), rowX + 740, yy);
    const s = a.summary?.total_savings ?? 0;
    ctx.fillStyle = s >= 0 ? COLORS.success : COLORS.text;
    ctx.fillText(`$${fmtMoney(s)}`, rowX + 860, yy);
  });
}

function drawAnalyses(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, items: IndexItem[]) {
  drawPanel(ctx, x + 16, y + 16, w - 32, h - 32, 'Analyses');

  const rowX = x + 32;
  const rowY0 = y + 64;
  const rowH = 38;

  ctx.fillStyle = COLORS.subtext;
  ctx.font = '600 12px Inter, system-ui, -apple-system, sans-serif';
  ctx.fillText('Timestamp', rowX, rowY0);
  ctx.fillText('Filename', rowX + 220, rowY0);
  ctx.fillText('Merchant', rowX + 520, rowY0);
  ctx.fillText('Shipments', rowX + 720, rowY0);
  ctx.fillText('Savings', rowX + 840, rowY0);

  ctx.font = '500 12px Inter, system-ui, -apple-system, sans-serif';
  items.slice(0, 14).forEach((a, i) => {
    const yy = rowY0 + 26 + i * rowH;
    roundRect(ctx, rowX - 12, yy - 22, 980, 32, 6, '#fff');

    ctx.fillStyle = COLORS.text;
    ctx.fillText((a.timestamp || '').slice(0, 16), rowX, yy);
    ctx.fillText(trim(a.filename || a.id, 28), rowX + 220, yy);
    ctx.fillText(trim(a.merchant || '—', 18), rowX + 520, yy);
    ctx.fillText(String(a.shipment_count ?? 0), rowX + 720, yy);
    const s = a.summary?.total_savings ?? 0;
    ctx.fillStyle = s >= 0 ? COLORS.success : COLORS.text;
    ctx.fillText(`$${fmtMoney(s)}`, rowX + 840, yy);
  });
}

function drawDetail(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, a: Analysis | null, id: string) {
  drawPanel(ctx, x + 16, y + 16, w - 32, h - 32, 'Analysis detail');

  ctx.font = '600 14px Inter, system-ui, -apple-system, sans-serif';
  ctx.fillStyle = COLORS.text;
  ctx.fillText(`ID: ${id}`, x + 32, y + 56);

  ctx.font = '500 12px Inter, system-ui, -apple-system, sans-serif';
  ctx.fillStyle = COLORS.subtext;
  const meta = a
    ? `${(a.timestamp || '').slice(0, 16)} • ${(a.filename || a.id)}${a.merchant ? ' • ' + a.merchant : ''}${a.title ? ' • ' + a.title : ''}`
    : 'Loading or not found…';
  ctx.fillText(trim(meta, 90), x + 32, y + 76);

  if (a?.tags?.length) {
    let cx = x + 32, cy = y + 96;
    a.tags.forEach((t) => {
      const label = String(t);
      const w = measureText(ctx, label, '500 11px Inter, system-ui, -apple-system, sans-serif') + 16;
      roundRect(ctx, cx, cy - 12, w, 22, 10, COLORS.accentSoft);
      ctx.fillStyle = COLORS.accent;
      ctx.font = '500 11px Inter, system-ui, -apple-system, sans-serif';
      ctx.fillText(label, cx + 8, cy + 4);
      ctx.fillStyle = COLORS.text;
      cx += w + 8;
    });
  }

  drawCard(ctx, x + 32, y + 132, 360, 120, 'Summary', [
    `Total savings: $${fmtMoney(a?.summary?.total_savings ?? 0)}`,
    `Avg zone: ${fmt(a?.summary?.avg_zone ?? 0, 1)}`,
    `Avg weight: ${fmt(a?.summary?.avg_weight ?? 0, 1)} lb`,
  ]);

  drawCard(ctx, x + 416, y + 132, 360, 120, 'Settings', [
    `DAS: ${fmt(a?.settings?.das_surcharge ?? 0, 2)}`,
    `eDAS: ${fmt(a?.settings?.edas_surcharge ?? 0, 2)}`,
    `Remote: ${fmt(a?.settings?.remote_surcharge ?? 0, 2)}`,
    `Markup: ${fmt(a?.settings?.markup_percent ?? 0, 1)}%`,
  ]);

  const tx = x + 32;
  const ty = y + 272;
  const tw = w - 64;
  const th = h - (ty - y) - 48;
  drawTable(ctx, tx, ty, tw, th, a?.results || []);
}

/* primitives and utils */

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}
function roundStroke(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.stroke();
}
function drawPanel(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, title: string) {
  roundRect(ctx, x, y, w, h, 10, '#fff');
  ctx.fillStyle = COLORS.text;
  ctx.font = '600 14px Inter, system-ui, -apple-system, sans-serif';
  ctx.fillText(title, x + 16, y + 28);
}
function drawStatCard(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, label: string, value: number, prefix: string) {
  roundRect(ctx, x, y, w, h, 10, '#fff');
  ctx.fillStyle = COLORS.subtext;
  ctx.font = '600 12px Inter, system-ui, -apple-system, sans-serif';
  ctx.fillText(label, x + 16, y + 28);
  ctx.fillStyle = COLORS.text;
  ctx.font = '700 24px Inter, system-ui, -apple-system, sans-serif';
  const txt = `${prefix}${prefix ? fmtMoney(value) : Math.round(value)}`;
  ctx.fillText(txt, x + 16, y + 64);
}
function drawCard(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, title: string, lines: string[]) {
  roundRect(ctx, x, y, w, h, 10, '#fff');
  ctx.fillStyle = COLORS.text;
  ctx.font = '600 13px Inter, system-ui, -apple-system, sans-serif';
  ctx.fillText(title, x + 16, y + 26);
  ctx.font = '500 12px Inter, system-ui, -apple-system, sans-serif';
  ctx.fillStyle = COLORS.subtext;
  lines.forEach((ln, i) => ctx.fillText(ln, x + 16, y + 52 + i * 18));
}
function drawTable(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, rows: any[]) {
  const headers = ['#', 'Shipment', 'Zone', 'Weight', 'Rate'];
  const colW = [40, 220, 80, 100, 120];
  const headerH = 34;
  const rowH = 28;
  roundRect(ctx, x, y, w, h, 10, '#fff');

  ctx.fillStyle = COLORS.subtext;
  ctx.font = '600 12px Inter, system-ui, -apple-system, sans-serif';
  let cx = x + 16;
  headers.forEach((hname, i) => {
    ctx.fillText(hname, cx, y + 22);
    cx += colW[i];
  });

  ctx.font = '500 12px Inter, system-ui, -apple-system, sans-serif';
  const visible = Math.min(Math.floor((h - headerH - 16) / rowH), rows.length);
  for (let i = 0; i < visible; i++) {
    const r = rows[i];
    const yy = y + headerH + 8 + i * rowH;
    ctx.strokeStyle = COLORS.border;
    ctx.beginPath();
    ctx.moveTo(x + 16, yy - rowH + 6);
    ctx.lineTo(x + w - 16, yy - rowH + 6);
    ctx.stroke();

    let cx2 = x + 16;
    ctx.fillStyle = COLORS.text;
    ctx.fillText(String(i + 1), cx2, yy); cx2 += colW[0];
    ctx.fillText(trim(r?.shipment_id || `S${i + 1}`, 20), cx2, yy); cx2 += colW[1];
    ctx.fillText(String(r?.zone ?? ''), cx2, yy); cx2 += colW[2];
    ctx.fillText(String(r?.weight ?? ''), cx2, yy); cx2 += colW[3];
    const rate = r?.final_rate ?? r?.labl_rate ?? r?.amazon_rate ?? '';
    ctx.fillStyle = COLORS.success;
    ctx.fillText(rate === '' ? '' : `$${fmtMoney(Number(rate))}`, cx2, yy);
  }
}
function fmtMoney(n: number): string {
  const v = Math.round((n || 0) * 100) / 100;
  return v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function trim(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + '…';
}
function measureText(ctx: CanvasRenderingContext2D, text: string, font: string) {
  const prev = ctx.font;
  ctx.font = font;
  const w = ctx.measureText(text).width;
  ctx.font = prev;
  return w;
}
function sumSavings(items: IndexItem[]): number {
  return items.reduce((acc, x) => acc + (x.summary?.total_savings || 0), 0);
}
function sumShipments(items: IndexItem[]): number {
  return items.reduce((acc, x) => acc + (x.shipment_count || 0), 0);
}
function fmt(n: number, digits: number): string {
  return (n || 0).toFixed(digits);
}
