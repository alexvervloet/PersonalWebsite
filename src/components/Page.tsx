import { useRef, useState } from 'react'
import { P } from '../palette'
import { DATA } from '../data'
import { Grid } from './Grid'
import { Crosshair } from './Crosshair'
import { Boot } from './Boot'
import { Typewriter } from './Typewriter'
import { SectionHead } from './SectionHead'
import { Portrait } from './Portrait'

const GRID_WIDTH = 1240
const GRID_HEIGHT = 3600

export function Page() {
  const [booted, setBooted] = useState(false)
  const [introDone, setIntroDone] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="av-root"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 1200,
        background: P.bg,
        color: P.ink,
        overflow: 'hidden',
      }}
    >
      <Grid
        containerRef={containerRef}
        width={GRID_WIDTH}
        height={GRID_HEIGHT}
      />
      <div className="av-scanlines" />
      <div className="av-noise" />

      {booted && <Crosshair containerRef={containerRef} />}
      {!booted && <Boot onDone={() => setBooted(true)} />}

      {/* ─── TOP BAR ─── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 56px',
          borderBottom: `1px solid ${P.line}`,
          fontSize: 11,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: P.dim,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: P.accent,
              boxShadow: `0 0 8px ${P.accent}`,
            }}
          />
          <span style={{ color: P.ink }}>av / 001</span>
          <span style={{ color: P.mute }}>·</span>
          <span>session {booted ? 'active' : 'booting'}</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <span>
            <span style={{ color: P.mute }}>loc ·</span>{' '}
            {DATA.location.toLowerCase()}
          </span>
          <span>
            <span style={{ color: P.mute }}>tz ·</span> {DATA.tz.toLowerCase()}
          </span>
          <span style={{ color: P.accent }}>● {DATA.status.toLowerCase()}</span>
        </div>
      </div>

      {/* ─── HERO ─── */}
      <section
        id="hero"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '80px 56px 72px',
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: 56,
        }}
      >
        <div>
          <div
            style={{
              color: P.accent,
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: 28,
            }}
          >
            &gt; whoami
          </div>
          <h1
            className="sans"
            style={{
              fontSize: 72,
              fontWeight: 500,
              margin: 0,
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              color: P.ink,
            }}
          >
            Alexander
            <br />
            <span style={{ color: P.accent }}>Vervloet</span>
            <span style={{ color: P.mute }}>.</span>
          </h1>
          <div
            className="sans"
            style={{
              marginTop: 20,
              fontSize: 20,
              color: P.dim,
              fontWeight: 300,
              letterSpacing: '-0.005em',
              minHeight: 32,
            }}
          >
            {booted && (
              <Typewriter
                text="Senior Frontend Engineer · 8 years · 2M users shipped."
                speed={22}
                onDone={() => setIntroDone(true)}
              />
            )}
          </div>
          <p
            className="sans"
            style={{
              marginTop: 36,
              fontSize: 16,
              lineHeight: 1.65,
              color: P.ink,
              maxWidth: 560,
              opacity: introDone ? 1 : 0,
              transition: 'opacity 0.6s',
            }}
          >
            I build production React and React Native apps — and translate
            between the people who write code and the people who decide what to
            build. The second part is the job I enjoy most, and the part that
            doesn&apos;t get automated away.
          </p>
          <div
            style={{
              marginTop: 40,
              display: 'flex',
              gap: 12,
              opacity: introDone ? 1 : 0,
              transition: 'opacity 0.8s 0.2s',
            }}
          >
            <a
              href="#experience"
              className="btn-link"
              style={{ color: P.accent }}
            >
              View work <span>↓</span>
            </a>
            <a
              href={`https://github.com/${DATA.github}`}
              target="_blank"
              rel="noreferrer"
              className="btn-link"
              style={{ color: P.ink }}
            >
              Github <span>↗</span>
            </a>
          </div>
        </div>

        {/* Portrait + stat grid */}
        <div>
          <Portrait />
          <div
            style={{
              marginTop: 20,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1,
              background: P.line,
              border: `1px solid ${P.line}`,
            }}
          >
            {(
              [
                ['8y', 'shipping prod'],
                ['2M', 'users reached'],
                ['$10M', 'payments processed'],
                ['500%', 'csat lift @ influenxio'],
              ] as const
            ).map(([big, small], i) => (
              <div key={i} style={{ background: P.bg, padding: '14px 16px' }}>
                <div
                  className="sans"
                  style={{ fontSize: 22, color: P.accent, fontWeight: 500 }}
                >
                  {big}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: P.mute,
                    marginTop: 2,
                  }}
                >
                  {small}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section
        id="about"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '56px 56px 64px',
          borderTop: `1px solid ${P.line}`,
        }}
      >
        <SectionHead
          num="01"
          label="about"
          title="What I bring beyond the code."
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 56,
            marginTop: 40,
          }}
        >
          <div
            className="sans"
            style={{ fontSize: 16, lineHeight: 1.7, color: P.ink }}
          >
            <p style={{ margin: '0 0 20px' }}>
              At VeVe I was never just the person who built things. I was the
              person who asked <span style={{ color: P.accent }}>why</span> we
              were building them, whether we were building the{' '}
              <span style={{ color: P.accent }}>right</span> thing, and how to
              explain the answer to someone who had never written a line of
              code.
            </p>
            <p style={{ margin: 0, color: P.dim }}>
              That combination of technical fluency and communication instinct
              is the part of the job I enjoyed most — and it shows up in
              everything from the quality of my pull requests to the questions I
              ask in a planning meeting.
            </p>
          </div>
          <div
            style={{
              border: `1px solid ${P.line}`,
              padding: 28,
              background: P.bgAlt,
            }}
          >
            <div
              style={{
                color: P.warn,
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                marginBottom: 14,
              }}
            >
              // the part AI doesn&apos;t replace
            </div>
            <ul
              className="sans"
              style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                fontSize: 14,
                color: P.ink,
              }}
            >
              {[
                'Asking why, not just how.',
                'Explaining complex systems in plain language.',
                'Feedback in planning that changes the plan.',
                'Knowing when not to ship.',
                'Teaching — three years, in two languages.',
              ].map((t, i) => (
                <li
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '18px 1fr',
                    gap: 10,
                    padding: '10px 0',
                    lineHeight: 1.5,
                    borderTop: i === 0 ? 'none' : `1px solid ${P.line}`,
                  }}
                >
                  <span
                    style={{
                      color: P.accent,
                      fontFamily: 'IBM Plex Mono, monospace',
                      paddingTop: 1,
                    }}
                  >
                    →
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── EXPERIENCE ─── */}
      <section
        id="experience"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '56px 56px 64px',
          borderTop: `1px solid ${P.line}`,
        }}
      >
        <SectionHead
          num="02"
          label="experience"
          title="Eight years. One long streak."
        />
        <div style={{ marginTop: 40 }}>
          {DATA.experience.map((job, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr',
                gap: 40,
                padding: '32px 0',
                borderTop: i === 0 ? `1px solid ${P.line}` : 'none',
                borderBottom: `1px solid ${P.line}`,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    color: P.accent,
                    letterSpacing: '0.08em',
                  }}
                >
                  {job.period}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: P.mute,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    marginTop: 6,
                  }}
                >
                  {job.place}
                </div>
              </div>
              <div>
                <div
                  className="sans"
                  style={{
                    fontSize: 22,
                    color: P.ink,
                    fontWeight: 500,
                    letterSpacing: '-0.005em',
                  }}
                >
                  {job.role}{' '}
                  <span style={{ color: P.mute, fontWeight: 300 }}>·</span>{' '}
                  <span style={{ color: P.accent }}>{job.co}</span>
                  {job.parent && (
                    <span
                      style={{ color: P.mute, fontSize: 14, fontWeight: 300 }}
                    >
                      {' '}
                      ({job.parent})
                    </span>
                  )}
                </div>
                <ul
                  className="sans"
                  style={{
                    margin: '16px 0 0',
                    padding: 0,
                    listStyle: 'none',
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: P.dim,
                  }}
                >
                  {job.bullets.map((b, j) => (
                    <li
                      key={j}
                      style={{ display: 'flex', gap: 14, padding: '5px 0' }}
                    >
                      <span style={{ color: P.accentDim, flexShrink: 0 }}>
                        {String(j + 1).padStart(2, '0')}
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                {job.meta && (
                  <div
                    style={{
                      marginTop: 18,
                      padding: '10px 14px',
                      background: P.bgAlt,
                      borderLeft: `2px solid ${P.accent}`,
                      fontSize: 12,
                      color: P.dim,
                      fontStyle: 'italic',
                    }}
                  >
                    {job.meta}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SKILLS ─── */}
      <section
        id="skills"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '56px 56px 64px',
          borderTop: `1px solid ${P.line}`,
        }}
      >
        <SectionHead num="03" label="capabilities" title="The stack." />
        <div
          style={{
            marginTop: 40,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1,
            background: P.line,
            border: `1px solid ${P.line}`,
          }}
        >
          {DATA.skills.map((col) => (
            <div key={col.group} style={{ background: P.bg, padding: 24 }}>
              <div
                style={{
                  color: P.accent,
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  marginBottom: 16,
                }}
              >
                [{col.group}]
              </div>
              <ul
                className="sans"
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                  fontSize: 14,
                  lineHeight: 1.9,
                  color: P.ink,
                }}
              >
                {col.items.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PROJECTS ─── */}
      <section
        id="projects"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '56px 56px 64px',
          borderTop: `1px solid ${P.line}`,
        }}
      >
        <SectionHead
          num="04"
          label="github"
          title="Things I build outside the job."
        />
        <div
          style={{
            marginTop: 40,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
          }}
        >
          {DATA.projects.map((proj, i) => (
            <ProjectCard key={i} proj={proj} />
          ))}
        </div>
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <a
            href={`https://github.com/${DATA.github}`}
            target="_blank"
            rel="noreferrer"
            className="btn-link"
            style={{ color: P.dim }}
          >
            all repositories <span>↗</span>
          </a>
        </div>
      </section>

      {/* ─── EARLIER + LANGUAGES ─── */}
      <section
        id="background"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '56px 56px 64px',
          borderTop: `1px solid ${P.line}`,
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: 56,
        }}
      >
        <div>
          <SectionHead
            num="05"
            label="before code"
            title="Three years in a classroom."
          />
          <p
            className="sans"
            style={{
              marginTop: 40,
              fontSize: 16,
              lineHeight: 1.7,
              color: P.dim,
              maxWidth: 560,
            }}
          >
            Before moving into full-time engineering I taught English and core
            subjects at schools in Taiwan — including one of the country&apos;s
            top-ranked high schools. Math, science, social studies. Often in
            Mandarin. Gamification and question-driven methods.
          </p>
          <p
            className="sans"
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: P.dim,
              maxWidth: 560,
            }}
          >
            I also tutored privately — students from age 6 to working
            professionals, on everything from English to beginner Python and
            Raspberry Pi hardware.
          </p>
          <p
            className="sans"
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: P.ink,
              maxWidth: 560,
              marginTop: 24,
            }}
          >
            <span style={{ color: P.accent }}>
              The discipline of making complex things genuinely simple for
              people with no prior context
            </span>{' '}
            has turned out to be the single most useful thing I do.
          </p>
        </div>
        <div>
          <div
            style={{
              color: P.accent,
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            // languages
          </div>
          <dl className="kv sans" style={{ color: P.ink }}>
            <dt>English</dt>
            <dd>Native</dd>
            <dt>中文 Mandarin</dt>
            <dd>
              Intermediate{' '}
              <span style={{ color: P.mute }}>
                · self-taught, 12 years in TW
              </span>
            </dd>
          </dl>
          <div
            style={{
              color: P.accent,
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              margin: '32px 0 16px',
            }}
          >
            // education
          </div>
          <dl className="kv sans" style={{ color: P.ink }}>
            <dt>B.S.</dt>
            <dd>Communication — Speech, Rhetoric, Leadership</dd>
            <dt>School</dt>
            <dd>Oregon State University, 2014</dd>
            <dt>Major GPA</dt>
            <dd style={{ color: P.accent }}>3.65</dd>
          </dl>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section
        id="contact"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '80px 56px 96px',
          borderTop: `1px solid ${P.line}`,
          background: `linear-gradient(180deg, ${P.bg} 0%, ${P.bgAlt} 100%)`,
        }}
      >
        <SectionHead num="06" label="contact" title="Start a conversation." />
        <div
          style={{
            marginTop: 40,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 56,
          }}
        >
          <div>
            <p
              className="sans"
              style={{
                fontSize: 18,
                lineHeight: 1.55,
                color: P.ink,
                margin: 0,
                maxWidth: 480,
              }}
            >
              I&apos;m open to remote senior frontend and fullstack roles with
              teams who value communication as much as code. I&apos;m also open
              to PM or TPM positions, as I have a wealth of experience focusing
              on product and working with them directly. UTC+8, flexible overlap
              with US and EU.
            </p>
          </div>
          <div>
            <dl className="kv sans" style={{ color: P.ink, fontSize: 15 }}>
              <dt>Email</dt>
              <dd
                style={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  color: P.accent,
                }}
              >
                {DATA.emailEncoded}
              </dd>

              <dt>LinkedIn</dt>
              <dd>
                <a
                  href="https://linkedin.com/in/alexander-vervloet"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: P.ink,
                    textDecoration: 'none',
                    borderBottom: `1px solid ${P.accentDim}`,
                  }}
                >
                  {DATA.linkedin}
                </a>
              </dd>
              <dt>GitHub</dt>
              <dd>
                <a
                  href={`https://github.com/${DATA.github}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: P.ink,
                    textDecoration: 'none',
                    borderBottom: `1px solid ${P.accentDim}`,
                  }}
                >
                  @{DATA.github}
                </a>
              </dd>
            </dl>
          </div>
        </div>
        <div
          style={{
            marginTop: 72,
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 10,
            color: P.mute,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            paddingTop: 24,
            borderTop: `1px solid ${P.line}`,
          }}
        >
          <span>av / end of file</span>
          <span>build 2026.04 — v1 graphite</span>
          <span>eof ·</span>
        </div>
      </section>
    </div>
  )
}

type ProjectData = (typeof DATA.projects)[number]

function ProjectCard({ proj }: { proj: ProjectData }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={proj.url}
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'block',
        padding: 28,
        background: P.bgAlt,
        border: `1px solid ${hovered ? P.accent : P.line}`,
        textDecoration: 'none',
        color: P.ink,
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'border-color 0.15s, transform 0.15s',
        position: 'relative',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 14,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              color: P.mute,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            github.com/{DATA.github}/
          </div>
          <div
            className="sans"
            style={{
              fontSize: 24,
              color: P.accent,
              fontWeight: 500,
              marginTop: 4,
            }}
          >
            <span className="glitch" data-text={proj.name}>
              {proj.name}
            </span>
          </div>
        </div>
        <span style={{ color: P.dim, fontSize: 18 }}>↗</span>
      </div>
      <div
        className="sans"
        style={{
          fontSize: 14,
          lineHeight: 1.65,
          color: P.dim,
          marginBottom: 20,
        }}
      >
        {proj.desc}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {proj.tags.map((t, j) => (
          <span
            key={j}
            style={{
              fontSize: 10,
              padding: '3px 8px',
              border: `1px solid ${P.line}`,
              color: P.dim,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </a>
  )
}
