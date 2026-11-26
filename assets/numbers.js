// Helix in numbers: monthly installs and daily users, estimated from GitHub's public download counters.
const DAY = 86400000;
const num = (n) => Math.round(n).toLocaleString('en-US');
const monthKey = (t) => new Date(t).toISOString().slice(0, 7);
const monthName = (key, long) => new Date(key + '-15').toLocaleDateString('en-US', long ? { month: 'long', year: 'numeric' } : { month: 'short' });

// One series, one color, monthly bars with a hover tooltip.
function barChart(el, data, tip) {
    const W = 420, H = 170, L = 30, B = 22, T = 6;
    const values = data.map((d) => d.y ?? 0);
    const max = Math.max(1, ...values);
    const step = Math.pow(10, Math.floor(Math.log10(max)));
    const tick = [1, 2, 5, 10].map((m) => m * step).find((t) => max / t <= 4);
    const top = Math.ceil(max / tick) * tick;
    const y = (v) => T + (H - T - B) * (1 - v / top);
    const slot = (W - L) / data.length, bw = Math.min(40, slot * 0.6);
    let svg = `<svg viewBox="0 0 ${W} ${H}" role="img">`;
    for (let v = 0; v <= top; v += tick) {
        svg += `<line class="gridline" x1="${L}" x2="${W}" y1="${y(v)}" y2="${y(v)}"/><text class="axis" x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${num(v)}</text>`;
    }
    data.forEach((d, i) => {
        const cx = L + slot * (i + 0.5), x0 = cx - bw / 2, t0 = y(d.y ?? 0), h = y(0) - t0, r = Math.min(4, h);
        svg += h > 0 ? `<path class="bar" d="M${x0},${y(0)} V${t0 + r} Q${x0},${t0} ${x0 + r},${t0} H${x0 + bw - r} Q${x0 + bw},${t0} ${x0 + bw},${t0 + r} V${y(0)} Z"/>` : '<path class="bar"/>';
        svg += `<rect class="hit" data-i="${i}" x="${L + slot * i}" y="${T}" width="${slot}" height="${H - T - B}"/>`;
        svg += `<text class="axis" x="${cx}" y="${H - 5}" text-anchor="middle">${monthName(d.month)}</text>`;
    });
    el.innerHTML = svg + '</svg><div class="tip"></div>';
    const tipEl = el.querySelector('.tip'), svgEl = el.querySelector('svg');
    el.querySelectorAll('.hit').forEach((hit) => {
        hit.addEventListener('mouseenter', () => {
            const i = +hit.dataset.i, scale = svgEl.clientWidth / W;
            tipEl.innerHTML = tip(data[i]);
            tipEl.style.left = L * scale + slot * (i + 0.5) * scale + 'px';
            tipEl.style.top = y(data[i].y ?? 0) * scale + 'px';
            tipEl.style.display = 'block';
            hit.previousElementSibling.classList.add('on');
        });
        hit.addEventListener('mouseleave', () => { tipEl.style.display = 'none'; hit.previousElementSibling.classList.remove('on'); });
    });
}

async function main() {
    const response = await fetch('https://api.github.com/repos/mickaphd/Helix/releases?per_page=100');
    if (!response.ok) throw new Error(`GitHub isn’t answering (${response.status}). Try again in a moment.`);
    const now = Date.now();
    const releases = (await response.json())
        .filter((r) => !r.draft && !r.prerelease)
        .map((r) => {
            const count = (test) => r.assets.filter((a) => test(a.name)).reduce((s, a) => s + a.download_count, 0);
            return { start: Date.parse(r.published_at), installs: count((n) => n.endsWith('.dmg')), checks: count((n) => n === 'latest.json') };
        })
        .sort((a, b) => a.start - b.start);
    releases.forEach((r, i) => { r.end = releases[i + 1]?.start ?? now; });

    // Spread each release's counts evenly over the days it was the latest, then add them up by month.
    const months = {};
    for (let t = Date.UTC(new Date(releases[0].start).getUTCFullYear(), new Date(releases[0].start).getUTCMonth()); t <= now; ) {
        const d = new Date(t); months[monthKey(t)] = { installs: 0, checks: 0, checkDays: 0 };
        t = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1);
    }
    const checksSince = releases.find((r) => r.checks > 0)?.start;
    let last30 = 0;
    for (const r of releases) {
        const span = Math.max(r.end - r.start, 1);
        for (let a = r.start; a < r.end; ) {
            const d = new Date(a), next = Math.min(r.end, Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1));
            const share = (next - a) / span, m = months[monthKey(a)];
            m.installs += r.installs * share;
            m.checks += r.checks * share;
            const recent = Math.max(0, next - Math.max(a, now - 30 * DAY));
            last30 += r.checks * recent / span;
            a = next;
        }
    }
    for (const [key, m] of Object.entries(months)) {
        const [y, mo] = key.split('-').map(Number);
        const from = Math.max(Date.UTC(y, mo - 1), checksSince ?? Infinity), to = Math.min(Date.UTC(y, mo), now);
        m.checkDays = Math.max(0, (to - from) / DAY);
    }

    const list = Object.entries(months).map(([month, m]) => ({ month, ...m }));
    const current = list.at(-1);
    const total = releases.reduce((s, r) => s + r.installs, 0);
    const recentDays = Math.min(30, (now - (checksSince ?? now)) / DAY);

    document.getElementById('updated').textContent = new Date(now).toLocaleString('en-US', { month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    document.getElementById('installs').textContent = num(total);
    document.getElementById('installs-note').textContent = `since ${new Date(releases[0].start).toLocaleDateString('en-US', { month: 'long' })} · ${num(current.installs)} this month`;
    if (recentDays >= 1) {
        document.getElementById('active').innerHTML = `≈ ${num(last30 / recentDays)} <small>Macs a day</small>`;
        document.getElementById('active-note').textContent = recentDays >= 30 ? 'over the last 30 days' : `over the last ${num(recentDays)} days`;
    }

    barChart(document.getElementById('installs-chart'), list.map((m) => ({ month: m.month, y: m.installs })),
        (d) => `${monthName(d.month, true)} · <b>${num(d.y)}</b> installs${d.month === current.month ? ' so far' : ''}`);
    barChart(document.getElementById('active-chart'), list.map((m) => ({ month: m.month, y: m.checkDays >= 1 ? m.checks / m.checkDays : null })),
        (d) => d.y == null ? `${monthName(d.month, true)} · not counted yet` : `${monthName(d.month, true)} · <b>≈ ${num(d.y)}</b> Macs a day`);
}

main().catch((e) => {
    const el = document.getElementById('error');
    el.textContent = e.message;
    el.hidden = false;
});
