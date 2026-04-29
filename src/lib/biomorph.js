export const NUM_GENES = 9;

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomGenome() {
  return [
    randInt(-10, 10),
    randInt(-10, 10),
    randInt(-10, 10),
    randInt(-10, 10),
    randInt(-10, 10),
    randInt(-10, 10),
    randInt(-10, 10),
    randInt(-10, 10),
    randInt(3, 7),
  ];
}

export function cloneGenome(g) {
  return [...g];
}

export function mutateGene(genes, index) {
  const child = cloneGenome(genes);
  const delta = (Math.random() < 0.5 ? 1 : 2) * (Math.random() < 0.5 ? 1 : -1);
  child[index] = child[index] + delta;
  if (Math.random() < 0.2) {
    const depthDelta = Math.random() < 0.5 ? 1 : -1;
    child[8] = Math.max(3, Math.min(9, child[8] + depthDelta));
  }
  return child;
}

export function createChildren(parent) {
  return Array.from({ length: 8 }, (_, i) => mutateGene(parent, i));
}

function buildTree(segs, x, y, dx, dy, len, dir) {
  const x2 = x + len * dx[dir];
  const y2 = y + len * dy[dir];
  segs.push({ x1: x, y1: y, x2, y2, len });
  if (len > 0) {
    buildTree(segs, x2, y2, dx, dy, len - 1, (dir + 7) % 8);
    buildTree(segs, x2, y2, dx, dy, len - 1, (dir + 1) % 8);
  }
}

export function drawBiomorph(ctx, genes, canvasSize, color = "#7cffd4") {
  const g = genes;
  const order = Math.max(3, Math.min(9, Math.round(g[8])));

  const dx = [-g[1], -g[0], 0, g[0], g[1], g[2], 0, -g[2]];
  const dy = [g[5], g[4], g[3], g[4], g[5], g[6], g[7], g[6]];

  const segs = [];
  buildTree(segs, 0, 0, dx, dy, order, 2);

  if (segs.length === 0) return;

  let minX = Infinity,
    maxX = -Infinity;
  let minY = Infinity,
    maxY = -Infinity;
  for (const { x1, y1, x2, y2 } of segs) {
    minX = Math.min(minX, x1, x2);
    maxX = Math.max(maxX, x1, x2);
    minY = Math.min(minY, y1, y2);
    maxY = Math.max(maxY, y1, y2);
  }

  const w = maxX - minX;
  const h = maxY - minY;

  if (w < 0.5 && h < 0.5) return;

  const pad = canvasSize * 0.1;
  const scale = (canvasSize - pad * 2) / Math.max(w || 1, h || 1);
  const offsetX = canvasSize / 2 - ((minX + maxX) / 2) * scale;
  const offsetY = canvasSize / 2 - ((minY + maxY) / 2) * scale;

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = color;

  for (const { x1, y1, x2, y2, len } of segs) {
    ctx.lineWidth = Math.max(0.35, (len / order) * 1.6);
    ctx.beginPath();
    ctx.moveTo(x1 * scale + offsetX, y1 * scale + offsetY);
    ctx.lineTo(x2 * scale + offsetX, y2 * scale + offsetY);
    ctx.stroke();
  }
}
