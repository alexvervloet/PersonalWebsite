import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { useRef, useEffect, useState } from "react";
const P = {
  bg: "#0e1113",
  bgAlt: "#15191c",
  panel: "#1a1f23",
  line: "#252b31",
  ink: "#d6dde3",
  dim: "#8d969d",
  mute: "#5c6770",
  accent: "#7fb8a8",
  accentDim: "#4a6f66",
  warn: "#c9a66b"
};
const DATA = {
  location: "Taichung, Taiwan",
  tz: "UTC+8",
  status: "Open to remote roles",
  github: "alexvervloet",
  emailEncoded: "alex.vervloet [at] gmail [dot] com",
  linkedin: "alexander-vervloet",
  skills: [
    {
      group: "ai",
      items: [
        "LLM apps · RAG · agents",
        "Evals · LLM-as-judge",
        "Prompt engineering · guardrails",
        "Python · FastAPI",
        "OpenAI · Anthropic · local models",
        "Vector search · MCP"
      ]
    },
    {
      group: "core",
      items: [
        "JavaScript / TypeScript",
        "React · React Native",
        "Node.js · NestJS",
        "REST · GraphQL"
      ]
    },
    {
      group: "domain",
      items: [
        "Web3 / Blockchain",
        "Payment systems",
        "Unit / E2E testing",
        "UI / UX feedback"
      ]
    },
    {
      group: "strengths",
      items: [
        "Technical communication",
        "Cross-team collaboration",
        "Product-minded thinking",
        "Explaining complexity simply"
      ]
    }
  ],
  experience: [
    {
      co: "Independent",
      parent: void 0,
      role: "AI Engineer",
      period: "2025 — Present",
      place: "Remote",
      bullets: [
        "Building AI-engineering systems from scratch (no frameworks) to understand the primitives, not just the libraries — RAG pipelines, tool-using agents, eval harnesses, and prompt-injection defenses, each a runnable project with measured results.",
        "Shipped a codebase-Q&A capstone (askrepo) across eight eval-gated stages, from the first API call to a hardened, cached production app that answers questions about its own source with (path:line) citations.",
        "Publishing the work as an open, teachable series spanning RAG, agents, evals, guardrails, MCP, multimodal, fine-tuning, and local models."
      ],
      meta: "Every claim is backed by runnable code and measured results — including an 8B local model that edged GPT-4o-mini on answer correctness for $0."
    },
    {
      co: "VeVe",
      parent: "Orbis Blockchain Technologies",
      role: "Lead Frontend & Mobile Engineer",
      period: "2019 — 2025",
      place: "Remote",
      bullets: [
        "Built the complete new-user onboarding flow for the mobile app launch — a 10-step guided experience that drove tens of thousands of signups in the first weeks and millions in early revenue.",
        "Owned the web payment flow for in-app currency purchases end-to-end. Millions of dollars processed. Zero critical payment bugs shipped.",
        "Built the web storefront, auction bidding system, and direct-purchase flows from scratch — the primary revenue surface for hundreds of thousands of transactions.",
        "Served as the technical translator between engineering and product. Brought into executive meetings specifically to explain complex system behavior in plain terms.",
        "Most active contributor in every planning session across six years. Highest rate of feedback adopted. Regularly the only person asking: should we actually build this?"
      ],
      meta: "Salary 45K → 90K over 6 years, without ever requesting a formal review. Survived two company-wide layoff rounds."
    },
    {
      co: "Influenxio",
      parent: void 0,
      role: "Lead Frontend Engineer",
      period: "2018 — 2019",
      place: "Taipei, TW",
      bullets: [
        "Led frontend in a small agile team building a React platform matching brands with influencers — shipping weekly through constantly changing specs.",
        "Drove a 500% improvement in measured customer satisfaction through targeted testing, tooling improvements, and systematic refactoring."
      ],
      meta: void 0
    },
    {
      co: "Inspection Advisor",
      parent: void 0,
      role: "Frontend Specialist",
      period: "2017 — 2018",
      place: "Remote",
      bullets: [
        "Built and maintained frontend features using React, React Native, and D3.js in a fully remote agile team, coordinating across time zones from day one."
      ],
      meta: void 0
    }
  ],
  projects: [
    {
      name: "deep-dive-capstone",
      url: "https://github.com/alexvervloet/deep-dive-capstone",
      desc: "askrepo — a codebase Q&A tool that answers in plain English with (path:line) citations, built from scratch across eight eval-gated stages (RAG → agents → hardening → production). Its default corpus is the AI-engineering series I built it alongside, so the course answers questions about its own source.",
      tags: ["RAG", "Agents", "Evals", "Python"]
    },
    {
      name: "hanzi.repeat",
      url: "https://github.com/alexvervloet/hanzi.repeat",
      desc: "Spaced-repetition Mandarin trainer. Built from the learning side of my brain, not the commercial side — tuned to how I actually pick up characters living in Taiwan.",
      tags: ["React", "SRS", "Personal"]
    },
    {
      name: "how-i-work",
      url: "https://github.com/alexvervloet/how-i-work",
      desc: "A living document of how I approach engineering, communication, and collaboration. The short version of what a year of working with me feels like.",
      tags: ["README", "Process"]
    }
  ]
};
const SPACING = 28;
const RADIUS = 1.1;
const INFLUENCE = 140;
const PAD = INFLUENCE + 4;
function gridPointsInRect(x0, y0, x1, y1, maxW, maxH) {
  const pts = [];
  const gx0 = Math.floor(x0 / SPACING) * SPACING;
  const gy0 = Math.floor(y0 / SPACING) * SPACING;
  for (let gx = gx0; gx <= x1 + SPACING; gx += SPACING) {
    for (let gy = gy0; gy <= y1 + SPACING; gy += SPACING) {
      if (gx >= SPACING && gy >= SPACING && gx < maxW && gy < maxH) {
        pts.push([gx, gy]);
      }
    }
  }
  return pts;
}
function Grid() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;
    let ctx = canvas.getContext("2d");
    const mouse = { x: -9999, y: -9999 };
    const prev = { x: -9999, y: -9999 };
    let dirty = false;
    const drawStatic = () => {
      ctx.fillStyle = "rgba(127, 184, 168, 0.14)";
      for (let x = SPACING; x < width + SPACING; x += SPACING) {
        for (let y = SPACING; y < height + SPACING; y += SPACING) {
          ctx.beginPath();
          ctx.arc(x, y, RADIUS, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    const setup = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
      drawStatic();
      prev.x = -9999;
      prev.y = -9999;
      dirty = false;
    };
    setup();
    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      dirty = true;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      dirty = true;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", setup);
    let raf;
    const render2 = () => {
      raf = requestAnimationFrame(render2);
      if (!dirty) return;
      dirty = false;
      if (prev.x > -9e3) {
        const x0 = prev.x - PAD, y0 = prev.y - PAD;
        const x1 = prev.x + PAD, y1 = prev.y + PAD;
        ctx.clearRect(x0, y0, x1 - x0, y1 - y0);
        ctx.fillStyle = "rgba(127, 184, 168, 0.14)";
        for (const [gx, gy] of gridPointsInRect(x0, y0, x1, y1, width + SPACING, height + SPACING)) {
          ctx.beginPath();
          ctx.arc(gx, gy, RADIUS, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (mouse.x > -9e3) {
        const x0 = mouse.x - PAD, y0 = mouse.y - PAD;
        const x1 = mouse.x + PAD, y1 = mouse.y + PAD;
        ctx.clearRect(x0, y0, x1 - x0, y1 - y0);
        for (const [gx, gy] of gridPointsInRect(x0, y0, x1, y1, width + SPACING, height + SPACING)) {
          const dx = gx - mouse.x;
          const dy = gy - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          let r = RADIUS, alpha = 0.14;
          if (d < INFLUENCE) {
            const t = 1 - d / INFLUENCE;
            r = RADIUS + t * 2.4;
            alpha = 0.14 + t * 0.55;
          }
          ctx.beginPath();
          ctx.arc(gx, gy, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(127, 184, 168, ${alpha})`;
          ctx.fill();
        }
      }
      prev.x = mouse.x;
      prev.y = mouse.y;
    };
    render2();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", setup);
    };
  }, []);
  return /* @__PURE__ */ jsx(
    "canvas",
    {
      ref: canvasRef,
      style: { position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 0 }
    }
  );
}
function Crosshair({ containerRef }) {
  const wrapRef = useRef(null);
  const hLineRef = useRef(null);
  const vLineRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  useEffect(() => {
    const el = containerRef.current;
    const wrap = wrapRef.current;
    if (!el || !wrap) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      wrap.style.opacity = "1";
      hLineRef.current.style.transform = `translateY(${y}px)`;
      vLineRef.current.style.transform = `translateX(${x}px)`;
      ringRef.current.style.transform = `translate(${x - 9}px, ${y - 9}px)`;
      dotRef.current.style.transform = `translate(${x - 1}px, ${y - 1}px)`;
    };
    const onLeave = () => {
      wrap.style.opacity = "0";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [containerRef]);
  return /* @__PURE__ */ jsxs("div", { ref: wrapRef, style: { position: "absolute", inset: 0, pointerEvents: "none", zIndex: 50, opacity: 0 }, children: [
    /* @__PURE__ */ jsx("div", { ref: hLineRef, style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 1,
      background: P.accentDim,
      opacity: 0.4,
      willChange: "transform"
    } }),
    /* @__PURE__ */ jsx("div", { ref: vLineRef, style: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      width: 1,
      background: P.accentDim,
      opacity: 0.4,
      willChange: "transform"
    } }),
    /* @__PURE__ */ jsx("div", { ref: ringRef, style: {
      position: "absolute",
      top: 0,
      left: 0,
      width: 18,
      height: 18,
      border: `1px solid ${P.accent}`,
      borderRadius: "50%",
      willChange: "transform"
    } }),
    /* @__PURE__ */ jsx("div", { ref: dotRef, style: {
      position: "absolute",
      top: 0,
      left: 0,
      width: 2,
      height: 2,
      background: P.accent,
      willChange: "transform"
    } })
  ] });
}
const BOOT_LINES = [
  { t: "av-os v2.4.1 (mono)", delay: 60 },
  { t: "Initializing runtime ................ [ ok ]", delay: 40 },
  { t: "Loading profile: alexander.vervloet ... [ ok ]", delay: 40 },
  { t: "Mounting /experience /skills /projects  [ ok ]", delay: 40 },
  { t: "Resolving location: Taichung, TW · UTC+8", delay: 40 },
  { t: "Availability status: open to remote roles", delay: 40 },
  { t: "ready.", delay: 200 }
];
function Boot({ onDone }) {
  const [visible, setVisible] = useState([]);
  const [fading, setFading] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      for (let i = 0; i < BOOT_LINES.length; i++) {
        await new Promise((r) => setTimeout(r, BOOT_LINES[i].delay + (i === 0 ? 300 : 180)));
        if (cancelled) return;
        setVisible((v) => [...v, BOOT_LINES[i].t]);
      }
      await new Promise((r) => setTimeout(r, 500));
      if (cancelled) return;
      setFading(true);
      await new Promise((r) => setTimeout(r, 500));
      if (!cancelled) onDone();
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [onDone]);
  return /* @__PURE__ */ jsxs("div", { style: {
    position: "absolute",
    inset: 0,
    zIndex: 60,
    background: P.bg,
    color: P.accent,
    padding: "40px 48px",
    fontSize: 12,
    lineHeight: 1.8,
    opacity: fading ? 0 : 1,
    transition: "opacity 0.5s"
  }, children: [
    /* @__PURE__ */ jsx("div", { style: { opacity: 0.5, marginBottom: 16, fontSize: 10, letterSpacing: "0.2em" }, children: "BOOT SEQUENCE" }),
    visible.map((line, i) => /* @__PURE__ */ jsxs("div", { style: { color: line.includes("[ ok ]") ? P.ink : P.accent }, children: [
      /* @__PURE__ */ jsx("span", { style: { color: P.mute, marginRight: 12 }, children: String(i).padStart(2, "0") }),
      line
    ] }, i)),
    visible.length < BOOT_LINES.length && /* @__PURE__ */ jsxs("span", { style: { color: P.accent }, children: [
      /* @__PURE__ */ jsx("span", { style: { color: P.mute, marginRight: 12 }, children: String(visible.length).padStart(2, "0") }),
      /* @__PURE__ */ jsx("span", { className: "cursor" })
    ] })
  ] });
}
function Typewriter({ text, speed = 24, startDelay = 0, showCursor = true, onDone }) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    let timeout;
    const start = setTimeout(() => {
      const tick = () => {
        i++;
        setOut(text.slice(0, i));
        if (i >= text.length) {
          setDone(true);
          onDone == null ? void 0 : onDone();
        } else {
          timeout = setTimeout(tick, speed);
        }
      };
      tick();
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearTimeout(timeout);
    };
  }, [text, speed, startDelay, onDone]);
  return /* @__PURE__ */ jsxs("span", { children: [
    out,
    showCursor && !done && /* @__PURE__ */ jsx("span", { className: "cursor" })
  ] });
}
function SectionHead({ num, label, title }) {
  return /* @__PURE__ */ jsxs("div", { style: { marginBottom: 24 }, children: [
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      alignItems: "baseline",
      gap: 14,
      color: P.accent,
      fontSize: 10,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      marginBottom: 8
    }, children: [
      /* @__PURE__ */ jsx("span", { style: { color: P.mute }, children: num }),
      /* @__PURE__ */ jsxs("span", { children: [
        "// ",
        label
      ] }),
      /* @__PURE__ */ jsx("span", { style: { flex: 1, height: 1, background: P.line, opacity: 0.6 } })
    ] }),
    /* @__PURE__ */ jsx("h2", { className: "sans", style: {
      fontSize: 28,
      fontWeight: 500,
      margin: 0,
      color: P.ink,
      letterSpacing: "-0.01em"
    }, children: title })
  ] });
}
const CORNERS = [
  { top: 8, left: 8 },
  { top: 8, right: 8 },
  { bottom: 8, left: 8 },
  { bottom: 8, right: 8 }
];
function cornerBorder(c) {
  return {
    borderTop: "top" in c ? `1px solid ${P.accent}` : "none",
    borderBottom: "bottom" in c ? `1px solid ${P.accent}` : "none",
    borderLeft: "left" in c ? `1px solid ${P.accent}` : "none",
    borderRight: "right" in c ? `1px solid ${P.accent}` : "none"
  };
}
function Portrait() {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const showPhoto = loaded && !errored;
  return /* @__PURE__ */ jsxs("div", { style: {
    position: "relative",
    width: "100%",
    aspectRatio: "3 / 4",
    background: P.panel,
    border: `1px solid ${P.line}`,
    overflow: "hidden"
  }, children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        src: "/portrait.duotone.jpeg",
        alt: "Alexander Vervloet",
        onLoad: () => setLoaded(true),
        onError: () => setErrored(true),
        style: {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          opacity: showPhoto ? 1 : 0,
          transition: "opacity 0.4s"
        }
      }
    ),
    showPhoto && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { style: {
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse at 50% 40%, ${P.accent}44, transparent 70%)`,
        mixBlendMode: "color",
        pointerEvents: "none"
      } }),
      /* @__PURE__ */ jsx("div", { style: {
        position: "absolute",
        inset: 0,
        background: `linear-gradient(180deg, transparent 55%, ${P.bg}bb 100%)`,
        pointerEvents: "none"
      } })
    ] }),
    !showPhoto && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { style: {
        position: "absolute",
        inset: 0,
        background: `repeating-linear-gradient(
              135deg,
              ${P.panel} 0 14px,
              ${P.bgAlt} 14px 28px
            )`
      } }),
      /* @__PURE__ */ jsx("div", { style: {
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse at 50% 40%, ${P.accent}22, transparent 70%)`
      } }),
      /* @__PURE__ */ jsxs("div", { style: {
        position: "absolute",
        left: 12,
        bottom: 12,
        fontSize: 9,
        letterSpacing: "0.18em",
        color: P.dim,
        fontFamily: "IBM Plex Mono, monospace",
        textTransform: "uppercase"
      }, children: [
        "portrait.duotone",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { style: { color: P.mute }, children: "drop /portrait.duotone.jpg in public/" })
      ] })
    ] }),
    CORNERS.map((c, i) => /* @__PURE__ */ jsx("div", { style: { position: "absolute", ...c, width: 14, height: 14, ...cornerBorder(c), pointerEvents: "none" } }, i))
  ] });
}
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}
function Page() {
  const [booted, setBooted] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const containerRef = useRef(null);
  const isMobile = useIsMobile();
  const sp = isMobile ? "40px 24px 48px" : "56px 56px 64px";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: containerRef,
      className: "av-root",
      style: {
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: P.bg,
        color: P.ink,
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ jsx(Grid, {}),
        /* @__PURE__ */ jsx("div", { className: "av-scanlines" }),
        /* @__PURE__ */ jsx("div", { className: "av-noise" }),
        booted && !isMobile && /* @__PURE__ */ jsx(Crosshair, { containerRef }),
        !booted && /* @__PURE__ */ jsx(Boot, { onDone: () => setBooted(true) }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              position: "relative",
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: isMobile ? "14px 24px" : "18px 56px",
              borderBottom: `1px solid ${P.line}`,
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: P.dim
            },
            children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
                /* @__PURE__ */ jsx("span", { style: {
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: P.accent,
                  boxShadow: `0 0 8px ${P.accent}`
                } }),
                /* @__PURE__ */ jsx("span", { style: { color: P.ink }, children: "av / 001" }),
                /* @__PURE__ */ jsx("span", { style: { color: P.mute }, children: "·" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "session ",
                  booted ? "active" : "booting"
                ] })
              ] }),
              isMobile ? /* @__PURE__ */ jsx("span", { style: { color: P.accent }, children: "● remote" }) : /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 24 }, children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  /* @__PURE__ */ jsx("span", { style: { color: P.mute }, children: "loc ·" }),
                  " ",
                  DATA.location.toLowerCase()
                ] }),
                /* @__PURE__ */ jsxs("span", { children: [
                  /* @__PURE__ */ jsx("span", { style: { color: P.mute }, children: "tz ·" }),
                  " ",
                  DATA.tz.toLowerCase()
                ] }),
                /* @__PURE__ */ jsxs("span", { style: { color: P.accent }, children: [
                  "● ",
                  DATA.status.toLowerCase()
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "section",
          {
            id: "hero",
            style: {
              position: "relative",
              zIndex: 2,
              padding: isMobile ? "40px 24px 48px" : "80px 56px 72px",
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr",
              gap: isMobile ? 32 : 56
            },
            children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { style: {
                  color: P.accent,
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  marginBottom: 28
                }, children: "> whoami" }),
                /* @__PURE__ */ jsxs(
                  "h1",
                  {
                    className: "sans",
                    style: {
                      fontSize: isMobile ? 44 : 72,
                      fontWeight: 500,
                      margin: 0,
                      lineHeight: 1.02,
                      letterSpacing: "-0.02em",
                      color: P.ink
                    },
                    children: [
                      "Alexander",
                      /* @__PURE__ */ jsx("br", {}),
                      /* @__PURE__ */ jsx("span", { style: { color: P.accent }, children: "Vervloet" }),
                      /* @__PURE__ */ jsx("span", { style: { color: P.mute }, children: "." })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "sans",
                    style: {
                      marginTop: 20,
                      fontSize: isMobile ? 16 : 20,
                      color: P.dim,
                      fontWeight: 300,
                      letterSpacing: "-0.005em",
                      minHeight: 32
                    },
                    children: booted && /* @__PURE__ */ jsx(
                      Typewriter,
                      {
                        text: "Full-Stack Engineer → AI Engineer · 8 years · 2M users shipped.",
                        speed: 22,
                        onDone: () => setIntroDone(true)
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  "p",
                  {
                    className: "sans",
                    style: {
                      marginTop: 36,
                      fontSize: 16,
                      lineHeight: 1.65,
                      color: P.ink,
                      maxWidth: 560,
                      opacity: introDone ? 1 : 0,
                      transition: "opacity 0.6s"
                    },
                    children: "For eight years I shipped production React and React Native to millions of users. Now I build AI systems from scratch — RAG, agents, evals, guardrails — to understand them at the primitive level, not the framework level. The throughline is the same: I translate between how a system actually works and what a team is trying to build."
                  }
                ),
                /* @__PURE__ */ jsxs("div", { style: {
                  marginTop: 40,
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  opacity: introDone ? 1 : 0,
                  transition: "opacity 0.8s 0.2s"
                }, children: [
                  /* @__PURE__ */ jsxs("a", { href: "#experience", className: "btn-link", style: { color: P.accent }, children: [
                    "View work ",
                    /* @__PURE__ */ jsx("span", { children: "↓" })
                  ] }),
                  /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: `https://github.com/${DATA.github}`,
                      target: "_blank",
                      rel: "noreferrer",
                      className: "btn-link",
                      style: { color: P.ink },
                      children: [
                        "Github ",
                        /* @__PURE__ */ jsx("span", { children: "↗" })
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Portrait, {}),
                /* @__PURE__ */ jsx("div", { style: {
                  marginTop: 20,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 1,
                  background: P.line,
                  border: `1px solid ${P.line}`
                }, children: [
                  ["8y", "shipping prod"],
                  ["2M", "users reached"],
                  ["$10M", "payments processed"],
                  ["500%", "csat lift @ influenxio"]
                ].map(([big, small], i) => /* @__PURE__ */ jsxs("div", { style: { background: P.bg, padding: "14px 16px" }, children: [
                  /* @__PURE__ */ jsx("div", { className: "sans", style: { fontSize: 22, color: P.accent, fontWeight: 500 }, children: big }),
                  /* @__PURE__ */ jsx("div", { style: { fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: P.mute, marginTop: 2 }, children: small })
                ] }, i)) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("section", { id: "about", style: { position: "relative", zIndex: 2, padding: sp, borderTop: `1px solid ${P.line}` }, children: [
          /* @__PURE__ */ jsx(SectionHead, { num: "01", label: "about", title: "What I bring beyond the code." }),
          /* @__PURE__ */ jsxs("div", { style: {
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? 32 : 56,
            marginTop: 40
          }, children: [
            /* @__PURE__ */ jsxs("div", { className: "sans", style: { fontSize: 16, lineHeight: 1.7, color: P.ink }, children: [
              /* @__PURE__ */ jsxs("p", { style: { margin: "0 0 20px" }, children: [
                "At VeVe I was never just the person who built things. I was the person who asked ",
                /* @__PURE__ */ jsx("span", { style: { color: P.accent }, children: "why" }),
                " we were building them, whether we were building the",
                " ",
                /* @__PURE__ */ jsx("span", { style: { color: P.accent }, children: "right" }),
                " thing, and how to explain the answer to someone who had never written a line of code."
              ] }),
              /* @__PURE__ */ jsx("p", { style: { margin: 0, color: P.dim }, children: "That combination of technical fluency and communication instinct is the part of the job I enjoyed most — and it shows up in everything from the quality of my pull requests to the questions I ask in a planning meeting." })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { border: `1px solid ${P.line}`, padding: 28, background: P.bgAlt }, children: [
              /* @__PURE__ */ jsx("div", { style: { color: P.warn, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 14 }, children: "// the part AI doesn't replace" }),
              /* @__PURE__ */ jsx("ul", { className: "sans", style: { margin: 0, padding: 0, listStyle: "none", fontSize: 14, color: P.ink }, children: [
                "Asking why, not just how.",
                "Explaining complex systems in plain language.",
                "Feedback in planning that changes the plan.",
                "Knowing when not to ship.",
                "Teaching — three years, in two languages."
              ].map((t, i) => /* @__PURE__ */ jsxs("li", { style: {
                display: "grid",
                gridTemplateColumns: "18px 1fr",
                gap: 10,
                padding: "10px 0",
                lineHeight: 1.5,
                borderTop: i === 0 ? "none" : `1px solid ${P.line}`
              }, children: [
                /* @__PURE__ */ jsx("span", { style: { color: P.accent, fontFamily: "IBM Plex Mono, monospace", paddingTop: 1 }, children: "→" }),
                /* @__PURE__ */ jsx("span", { children: t })
              ] }, i)) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { id: "experience", style: { position: "relative", zIndex: 2, padding: sp, borderTop: `1px solid ${P.line}` }, children: [
          /* @__PURE__ */ jsx(SectionHead, { num: "02", label: "experience", title: "Eight years. One long streak." }),
          /* @__PURE__ */ jsx("div", { style: { marginTop: 40 }, children: DATA.experience.map((job, i) => /* @__PURE__ */ jsxs("div", { style: {
            padding: "32px 0",
            borderTop: i === 0 ? `1px solid ${P.line}` : "none",
            borderBottom: `1px solid ${P.line}`,
            ...isMobile ? {} : {
              display: "grid",
              gridTemplateColumns: "160px 1fr",
              gap: 40
            }
          }, children: [
            isMobile ? /* @__PURE__ */ jsxs("div", { style: { marginBottom: 12 }, children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: 11, color: P.accent, letterSpacing: "0.08em" }, children: job.period }),
              /* @__PURE__ */ jsx("span", { style: { color: P.mute, margin: "0 8px" }, children: "·" }),
              /* @__PURE__ */ jsx("span", { style: { fontSize: 10, color: P.mute, letterSpacing: "0.14em", textTransform: "uppercase" }, children: job.place })
            ] }) : /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { style: { fontSize: 12, color: P.accent, letterSpacing: "0.08em" }, children: job.period }),
              /* @__PURE__ */ jsx("div", { style: { fontSize: 10, color: P.mute, letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 6 }, children: job.place })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "sans", style: { fontSize: isMobile ? 18 : 22, color: P.ink, fontWeight: 500, letterSpacing: "-0.005em" }, children: [
                job.role,
                " ",
                /* @__PURE__ */ jsx("span", { style: { color: P.mute, fontWeight: 300 }, children: "·" }),
                " ",
                /* @__PURE__ */ jsx("span", { style: { color: P.accent }, children: job.co }),
                job.parent && /* @__PURE__ */ jsxs("span", { style: { color: P.mute, fontSize: 14, fontWeight: 300 }, children: [
                  " (",
                  job.parent,
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ jsx("ul", { className: "sans", style: { margin: "16px 0 0", padding: 0, listStyle: "none", fontSize: 14, lineHeight: 1.7, color: P.dim }, children: job.bullets.map((b, j) => /* @__PURE__ */ jsxs("li", { style: { display: "flex", gap: 14, padding: "5px 0" }, children: [
                /* @__PURE__ */ jsx("span", { style: { color: P.accentDim, flexShrink: 0 }, children: String(j + 1).padStart(2, "0") }),
                /* @__PURE__ */ jsx("span", { children: b })
              ] }, j)) }),
              job.meta && /* @__PURE__ */ jsx("div", { style: {
                marginTop: 18,
                padding: "10px 14px",
                background: P.bgAlt,
                borderLeft: `2px solid ${P.accent}`,
                fontSize: 12,
                color: P.dim,
                fontStyle: "italic"
              }, children: job.meta })
            ] })
          ] }, i)) })
        ] }),
        /* @__PURE__ */ jsxs("section", { id: "skills", style: { position: "relative", zIndex: 2, padding: sp, borderTop: `1px solid ${P.line}` }, children: [
          /* @__PURE__ */ jsx(SectionHead, { num: "03", label: "capabilities", title: "The stack." }),
          /* @__PURE__ */ jsx("div", { style: {
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
            gap: 1,
            background: P.line,
            border: `1px solid ${P.line}`
          }, children: DATA.skills.map((col) => /* @__PURE__ */ jsxs("div", { style: { background: P.bg, padding: 24 }, children: [
            /* @__PURE__ */ jsxs("div", { style: { color: P.accent, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 16 }, children: [
              "[",
              col.group,
              "]"
            ] }),
            /* @__PURE__ */ jsx("ul", { className: "sans", style: { margin: 0, padding: 0, listStyle: "none", fontSize: 14, lineHeight: 1.9, color: P.ink }, children: col.items.map((s, i) => /* @__PURE__ */ jsx("li", { children: s }, i)) })
          ] }, col.group)) })
        ] }),
        /* @__PURE__ */ jsxs("section", { id: "projects", style: { position: "relative", zIndex: 2, padding: sp, borderTop: `1px solid ${P.line}` }, children: [
          /* @__PURE__ */ jsx(SectionHead, { num: "04", label: "github", title: "Things I build outside the job." }),
          /* @__PURE__ */ jsx("div", { style: {
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 24
          }, children: DATA.projects.map((proj, i) => /* @__PURE__ */ jsx(ProjectCard, { proj }, i)) }),
          /* @__PURE__ */ jsx("div", { style: { marginTop: 24, textAlign: "center" }, children: /* @__PURE__ */ jsxs(
            "a",
            {
              href: `https://github.com/${DATA.github}`,
              target: "_blank",
              rel: "noreferrer",
              className: "btn-link",
              style: { color: P.dim },
              children: [
                "all repositories ",
                /* @__PURE__ */ jsx("span", { children: "↗" })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs(
          "section",
          {
            id: "background",
            style: {
              position: "relative",
              zIndex: 2,
              padding: sp,
              borderTop: `1px solid ${P.line}`,
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr",
              gap: isMobile ? 40 : 56
            },
            children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(SectionHead, { num: "05", label: "before code", title: "Three years in a classroom." }),
                /* @__PURE__ */ jsx("p", { className: "sans", style: { marginTop: 40, fontSize: 16, lineHeight: 1.7, color: P.dim, maxWidth: 560 }, children: "Before moving into full-time engineering I taught English and core subjects at schools in Taiwan — including one of the country's top-ranked high schools. Math, science, social studies. Often in Mandarin. Gamification and question-driven methods." }),
                /* @__PURE__ */ jsx("p", { className: "sans", style: { fontSize: 16, lineHeight: 1.7, color: P.dim, maxWidth: 560 }, children: "I also tutored privately — students from age 6 to working professionals, on everything from English to beginner Python and Raspberry Pi hardware." }),
                /* @__PURE__ */ jsxs("p", { className: "sans", style: { fontSize: 16, lineHeight: 1.7, color: P.ink, maxWidth: 560, marginTop: 24 }, children: [
                  /* @__PURE__ */ jsx("span", { style: { color: P.accent }, children: "The discipline of making complex things genuinely simple for people with no prior context" }),
                  " ",
                  "has turned out to be the single most useful thing I do."
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { style: { color: P.accent, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 16 }, children: "// languages" }),
                /* @__PURE__ */ jsxs("dl", { className: "kv sans", style: { color: P.ink }, children: [
                  /* @__PURE__ */ jsx("dt", { children: "English" }),
                  /* @__PURE__ */ jsx("dd", { children: "Native" }),
                  /* @__PURE__ */ jsx("dt", { children: "中文 Mandarin" }),
                  /* @__PURE__ */ jsxs("dd", { children: [
                    "Intermediate ",
                    /* @__PURE__ */ jsx("span", { style: { color: P.mute }, children: "· self-taught, 12 years in TW" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { style: { color: P.accent, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", margin: "32px 0 16px" }, children: "// education" }),
                /* @__PURE__ */ jsxs("dl", { className: "kv sans", style: { color: P.ink }, children: [
                  /* @__PURE__ */ jsx("dt", { children: "B.S." }),
                  /* @__PURE__ */ jsx("dd", { children: "Communication — Speech, Rhetoric, Leadership" }),
                  /* @__PURE__ */ jsx("dt", { children: "School" }),
                  /* @__PURE__ */ jsx("dd", { children: "Oregon State University, 2014" }),
                  /* @__PURE__ */ jsx("dt", { children: "Major GPA" }),
                  /* @__PURE__ */ jsx("dd", { style: { color: P.accent }, children: "3.65" })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "section",
          {
            id: "contact",
            style: {
              position: "relative",
              zIndex: 2,
              padding: isMobile ? "56px 24px 72px" : "80px 56px 96px",
              borderTop: `1px solid ${P.line}`,
              background: `linear-gradient(180deg, ${P.bg} 0%, ${P.bgAlt} 100%)`
            },
            children: [
              /* @__PURE__ */ jsx(SectionHead, { num: "06", label: "contact", title: "Start a conversation." }),
              /* @__PURE__ */ jsxs("div", { style: {
                marginTop: 40,
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: isMobile ? 32 : 56
              }, children: [
                /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { className: "sans", style: { fontSize: isMobile ? 16 : 18, lineHeight: 1.55, color: P.ink, margin: 0, maxWidth: 480 }, children: "I'm open to remote roles in AI/ML and full-stack engineering with teams who value communication as much as code. I'm also open to PM or TPM positions, as I have a wealth of experience focusing on product and working with them directly. UTC+8, flexible overlap with US and EU." }) }),
                /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("dl", { className: "kv sans", style: { color: P.ink, fontSize: 15 }, children: [
                  /* @__PURE__ */ jsx("dt", { children: "Email" }),
                  /* @__PURE__ */ jsx("dd", { style: { fontFamily: "IBM Plex Mono, monospace", color: P.accent, wordBreak: "break-word" }, children: DATA.emailEncoded }),
                  /* @__PURE__ */ jsx("dt", { children: "LinkedIn" }),
                  /* @__PURE__ */ jsx("dd", { children: /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: "https://linkedin.com/in/alexander-vervloet",
                      target: "_blank",
                      rel: "noreferrer",
                      style: { color: P.ink, textDecoration: "none", borderBottom: `1px solid ${P.accentDim}` },
                      children: DATA.linkedin
                    }
                  ) }),
                  /* @__PURE__ */ jsx("dt", { children: "GitHub" }),
                  /* @__PURE__ */ jsx("dd", { children: /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: `https://github.com/${DATA.github}`,
                      target: "_blank",
                      rel: "noreferrer",
                      style: { color: P.ink, textDecoration: "none", borderBottom: `1px solid ${P.accentDim}` },
                      children: [
                        "@",
                        DATA.github
                      ]
                    }
                  ) })
                ] }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: {
                marginTop: 72,
                display: "flex",
                justifyContent: "space-between",
                fontSize: 10,
                color: P.mute,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                paddingTop: 24,
                borderTop: `1px solid ${P.line}`,
                flexWrap: "wrap",
                gap: 8
              }, children: [
                /* @__PURE__ */ jsx("span", { children: "av / end of file" }),
                /* @__PURE__ */ jsx("span", { children: "build 2026.04 — v1 graphite" }),
                /* @__PURE__ */ jsx("span", { children: "eof ·" })
              ] })
            ]
          }
        )
      ]
    }
  );
}
function ProjectCard({ proj }) {
  const [hovered, setHovered] = useState(false);
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href: proj.url,
      target: "_blank",
      rel: "noreferrer",
      style: {
        display: "block",
        padding: 28,
        background: P.bgAlt,
        border: `1px solid ${hovered ? P.accent : P.line}`,
        textDecoration: "none",
        color: P.ink,
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "border-color 0.15s, transform 0.15s",
        position: "relative"
      },
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { style: { fontSize: 10, color: P.mute, letterSpacing: "0.2em", textTransform: "uppercase" }, children: [
              "github.com/",
              DATA.github,
              "/"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "sans", style: { fontSize: 24, color: P.accent, fontWeight: 500, marginTop: 4 }, children: /* @__PURE__ */ jsx("span", { className: "glitch", "data-text": proj.name, children: proj.name }) })
          ] }),
          /* @__PURE__ */ jsx("span", { style: { color: P.dim, fontSize: 18 }, children: "↗" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "sans", style: { fontSize: 14, lineHeight: 1.65, color: P.dim, marginBottom: 20 }, children: proj.desc }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: proj.tags.map((t, j) => /* @__PURE__ */ jsx("span", { style: {
          fontSize: 10,
          padding: "3px 8px",
          border: `1px solid ${P.line}`,
          color: P.dim,
          letterSpacing: "0.1em",
          textTransform: "uppercase"
        }, children: t }, j)) })
      ]
    }
  );
}
function App() {
  return /* @__PURE__ */ jsx("div", { style: { background: "#0e1113", minHeight: "100vh" }, children: /* @__PURE__ */ jsx("div", { style: { maxWidth: 1240, margin: "0 auto", boxShadow: "0 0 80px rgba(0,0,0,0.5)" }, children: /* @__PURE__ */ jsx(Page, {}) }) });
}
function render() {
  return renderToString(/* @__PURE__ */ jsx(App, {}));
}
export {
  render
};
