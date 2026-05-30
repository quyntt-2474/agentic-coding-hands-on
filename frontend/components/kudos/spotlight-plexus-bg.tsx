'use client';

import { useMemo } from 'react';

/**
 * Procedural plexus background — pure-black canvas with a thin white network
 * of nodes/edges + occasional translucent triangles. Matches the Figma design
 * for the Spotlight Board (node 2940-14174).
 *
 * Seeded PRNG so layout is stable across renders.
 */

interface SpotlightPlexusBgProps {
  width: number;
  height: number;
  nodeCount?: number;
  /** Max edge length in user units — only nearer nodes are connected. */
  edgeMax?: number;
  /** Number of translucent triangles overlaid on the network. */
  triangleCount?: number;
  seed?: number;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Node { x: number; y: number; r: number }

export function SpotlightPlexusBg({
  width,
  height,
  nodeCount = 110,
  edgeMax = 130,
  triangleCount = 10,
  seed = 20260529,
}: SpotlightPlexusBgProps) {
  const { nodes, edges, triangles } = useMemo(() => {
    const rand = mulberry32(seed);
    const ns: Node[] = Array.from({ length: nodeCount }, () => ({
      x: rand() * width,
      y: rand() * height,
      r: 0.6 + rand() * 1.6,
    }));

    const es: Array<{ a: number; b: number; o: number }> = [];
    for (let i = 0; i < ns.length; i++) {
      for (let j = i + 1; j < ns.length; j++) {
        const dx = ns[i].x - ns[j].x;
        const dy = ns[i].y - ns[j].y;
        const d = Math.hypot(dx, dy);
        if (d < edgeMax) {
          es.push({ a: i, b: j, o: 0.18 + (1 - d / edgeMax) * 0.45 });
        }
      }
    }

    const tris: Array<{ a: number; b: number; c: number; o: number }> = [];
    const used = new Set<string>();
    for (let attempt = 0; attempt < triangleCount * 6 && tris.length < triangleCount; attempt++) {
      const i = Math.floor(rand() * ns.length);
      const j = Math.floor(rand() * ns.length);
      const k = Math.floor(rand() * ns.length);
      if (i === j || j === k || i === k) continue;
      const key = [i, j, k].sort().join('-');
      if (used.has(key)) continue;
      const dAB = Math.hypot(ns[i].x - ns[j].x, ns[i].y - ns[j].y);
      const dBC = Math.hypot(ns[j].x - ns[k].x, ns[j].y - ns[k].y);
      const dCA = Math.hypot(ns[k].x - ns[i].x, ns[k].y - ns[i].y);
      if (dAB > edgeMax * 1.6 || dBC > edgeMax * 1.6 || dCA > edgeMax * 1.6) continue;
      used.add(key);
      tris.push({ a: i, b: j, c: k, o: 0.08 + rand() * 0.18 });
    }

    return { nodes: ns, edges: es, triangles: tris };
  }, [width, height, nodeCount, edgeMax, triangleCount, seed]);

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <style>{`
          @keyframes plexus-twinkle {
            0%, 100% { opacity: 0.35; }
            50% { opacity: 0.95; }
          }
          @keyframes plexus-edge-pulse {
            0%, 100% { opacity: var(--base-op, 0.3); }
            50% { opacity: calc(var(--base-op, 0.3) * 1.6); }
          }
          @keyframes plexus-tri-drift {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(3px, -2px); }
          }
        `}</style>
      </defs>
      <rect x="0" y="0" width={width} height={height} fill="#000000" />
      {triangles.map((t, i) => {
        const dur = 8 + ((i * 7) % 6);
        const delay = -((i * 3) % 8);
        return (
          <polygon
            key={`t-${i}`}
            points={`${nodes[t.a].x},${nodes[t.a].y} ${nodes[t.b].x},${nodes[t.b].y} ${nodes[t.c].x},${nodes[t.c].y}`}
            fill="#ffffff"
            opacity={t.o}
            style={{
              animation: `plexus-tri-drift ${dur}s ease-in-out ${delay}s infinite`,
              transformOrigin: 'center',
            }}
          />
        );
      })}
      {edges.map((e, i) => {
        const dur = 5 + ((i * 11) % 7);
        const delay = -((i * 5) % 9);
        const baseOp = (e.o * 0.6).toFixed(3);
        return (
          <line
            key={`e-${i}`}
            x1={nodes[e.a].x}
            y1={nodes[e.a].y}
            x2={nodes[e.b].x}
            y2={nodes[e.b].y}
            stroke="#ffffff"
            strokeWidth="0.6"
            style={{
              ['--base-op' as string]: baseOp,
              animation: `plexus-edge-pulse ${dur}s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      })}
      {nodes.map((n, i) => {
        const dur = 3 + ((i * 13) % 5);
        const delay = -((i * 7) % 6);
        return (
          <circle
            key={`n-${i}`}
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill="#ffffff"
            style={{
              animation: `plexus-twinkle ${dur}s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      })}
    </svg>
  );
}
