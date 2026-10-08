// 120x90 animated machine glyphs. `kind` comes from config/factoryLayout.js.
const BODY = {
  furnace: <><rect x="22" y="28" width="68" height="50" rx="6" className="fill" /><rect x="76" y="12" width="10" height="20" className="fill" />
    <path className="flame" d="M56 72c-12-9-2-17-4-27 10 5 18 14 12 27z" /></>,
  degas: <><rect x="34" y="20" width="52" height="58" rx="8" className="fill" /><line x1="60" y1="10" x2="60" y2="52" className="line" />
    <g className="spin"><line x1="46" y1="56" x2="74" y2="56" className="line" /></g>
    {[44, 60, 76].map((x, i) => <circle key={x} className="bub" style={{ animationDelay: i * 0.5 + 's' }} cx={x} cy="66" r="3" />)}</>,
  caster: <><rect x="26" y="14" width="68" height="10" className="fill" /><rect x="26" y="66" width="68" height="12" className="fill" />
    <circle cx="60" cy="45" r="16" className="fill" /><circle cx="60" cy="45" r="6" className="line" /><path d="M60 82V70M54 74l6-6 6 6" className="line pulse" /></>,
  xray: <><rect x="24" y="22" width="72" height="56" rx="6" className="fill" /><rect x="52" y="14" width="16" height="12" className="line" />
    <path d="M60 26L40 66h40z" className="beam" /><circle cx="60" cy="68" r="9" className="line" /></>,
  oven: <><rect x="16" y="26" width="88" height="52" rx="6" className="fill" /><line x1="60" y1="26" x2="60" y2="78" className="line" />
    {[30, 76].map((x, i) => <path key={x} className="heat" style={{ animationDelay: i * 0.6 + 's' }} d={`M${x} 64q4-6 0-12t0-12`} />)}</>,
  cnc: <><rect x="20" y="20" width="80" height="58" rx="6" className="fill" /><g className="spin"><circle cx="48" cy="49" r="14" className="line" />
    <path d="M48 35v28M34 49h28" className="line" /></g><path d="M72 49h20" className="line pulse" /></>,
  paint: <><rect x="20" y="18" width="80" height="60" rx="8" className="fill" /><circle cx="60" cy="62" r="10" className="line" />
    <path d="M92 30L70 52" className="line" />{[0, 1, 2].map((i) => <circle key={i} className="bub" style={{ animationDelay: i * 0.4 + 's' }} cx={78 - i * 4} cy={46 + i * 4} r="2" />)}</>,
  inspect: <><path d="M24 78V32a36 28 0 0 1 72 0v46" className="line" /><rect x="52" y="22" width="16" height="12" className="fill" />
    <circle cx="60" cy="62" r="12" className="line" /><line x1="30" y1="40" x2="90" y2="40" className="scan" /></>,
};

export default function Glyph({ kind }) {
  return (
    <>
      <rect className="frame" x="4" y="6" width="112" height="78" rx="10" />
      <g className="body">{BODY[kind]}</g>
      <circle className="dot" cx="106" cy="16" r="5" />
    </>
  );
}
