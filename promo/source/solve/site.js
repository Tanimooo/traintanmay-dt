// Open one ESAT question inside the real TrainTanmay site (served locally on :8765).
// In the cloud sandbox cdnjs + the site's Cloudflare proxy are blocked, so pdf.js is served from
// node_modules (PDFJS_DIR) and the paper is fetched straight from UAT-UK.
const path = require('path');
exports.prep = async (page) => {
  const dir = process.env.PDFJS_DIR;
  if (dir) await page.route(/cdnjs\.cloudflare\.com\/ajax\/libs\/pdf\.js\/[^/]+\/(.*)$/, r =>
    r.fulfill({ path: path.join(dir, r.request().url().split('/').pop()), contentType: 'application/javascript' }));
  await page.route(/workers\.dev\/\?url=/, async r => {
    const real = decodeURIComponent(r.request().url().split('?url=')[1]);
    const res = await r.fetch({ url: real });
    r.fulfill({ response: res, headers: { ...res.headers(), 'access-control-allow-origin': '*' } });
  });
  // no what's-new ad, no sign-in card: they'd cover the outro
  await page.addInitScript(() => { try { localStorage.setItem('tt-promo-off', '1'); sessionStorage.setItem('tt-cloud-nudge', '1'); } catch (e) {} });
};
exports.openQ = async (page, qid, title) => {
  await page.goto('http://localhost:8765/esat/index.html#/'); await page.waitForTimeout(1200);
  await page.evaluate(([qid, title]) => {
    const s = { id: 'vid', title, mode: 'custom', cfg: { count: 1, reveal: 'instant' }, order: [qid],
      answers: { [qid]: { chosen: null, ms: 0, flagged: false, revealed: false } }, cursor: 0, reveal: 'instant',
      timed: false, limitMs: 0, pausable: false, startedAt: Date.now(), finishedAt: null, elapsedMs: 0 };
    Store.setActive(s); location.hash = '#/run';
  }, [qid, title]);
  await page.waitForTimeout(2500);
  await page.getByText('Not now').click({ timeout: 3000 }).catch(() => {});
};
