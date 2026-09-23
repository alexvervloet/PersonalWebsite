import { useEffect, useRef, useState } from 'react'
import { P } from '../palette'
import { DATA } from '../data'
import { Grid } from './Grid'
import { Crosshair } from './Crosshair'
import { Boot } from './Boot'
import { Typewriter } from './Typewriter'
import { SectionHead } from './SectionHead'
import { Portrait } from './Portrait'

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])
  return isMobile
}

export function Page() {
  const [booted, setBooted] = useState(false)
  const [introDone, setIntroDone] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  const sp = isMobile ? '40px 24px 48px' : '56px 56px 64px'

  return (
    <div
      ref={containerRef}
      className="av-root"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: P.bg,
        color: P.ink,
        overflow: 'hidden',
      }}
    >
      <Grid />
      <div className="av-scanlines" />
      <div className="av-noise" />

      {booted && !isMobile && <Crosshair containerRef={containerRef} />}
      {!booted && <Boot onDone={() => setBooted(true)} />}

      {/* ─── TOP BAR ─── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '14px 24px' : '18px 56px',
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
        {isMobile ? (
          <span style={{ color: P.accent }}>● remote</span>
        ) : (
          <div style={{ display: 'flex', gap: 24 }}>
            <span>
              <span style={{ color: P.mute }}>loc ·</span>{' '}
              {DATA.location.toLowerCase()}
            </span>
            <span>
              <span style={{ color: P.mute }}>tz ·</span>{' '}
              {DATA.tz.toLowerCase()}
            </span>
            <span style={{ color: P.accent }}>
              ● {DATA.status.toLowerCase()}
            </span>
          </div>
        )}
      </div>

      {/* ─── HERO ─── */}
      <section
        id="hero"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: isMobile ? '40px 24px 48px' : '80px 56px 72px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr',
          gap: isMobile ? 32 : 56,
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
              fontSize: isMobile ? 44 : 72,
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
              fontSize: isMobile ? 16 : 20,
              color: P.dim,
              fontWeight: 300,
              letterSpacing: '-0.005em',
              minHeight: 32,
            }}
          >
            {booted && (
              <Typewriter
                text="Technical PM · Engineer · 8 years · 2M users shipped."
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
            For eight years I shipped production software to a platform with
            two million users, owning flows end to end from React through
            GraphQL on NestJS to Kafka. I spent as much of that time on what we
            were building and why. Running customer surveys, arguing scope,
            sitting in prioritization, and explaining system behavior to
            executives who had never written code. Now I build AI systems from
            scratch, so the product judgement and the engineering understanding
            stay attached to each other. I want the job where both are the
            job.
          </p>
          <div
            style={{
              marginTop: 40,
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              opacity: introDone ? 1 : 0,
              transition: 'opacity 0.8s 0.2s',
            }}
          >
            <a href="#product" className="btn-link" style={{ color: P.accent }}>
              Case studies <span>↓</span>
            </a>
            <a href="#experience" className="btn-link" style={{ color: P.ink }}>
              Experience <span>↓</span>
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
                ['+9pt', 'csat from survey program'],
                ['3-4wk', 'saved by one scope call'],
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
          padding: sp,
          borderTop: `1px solid ${P.line}`,
        }}
      >
        <SectionHead
          num="01"
          label="about"
          title="The engineer who kept asking product questions."
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? 32 : 56,
            marginTop: 40,
          }}
        >
          <div
            className="sans"
            style={{ fontSize: 16, lineHeight: 1.7, color: P.ink }}
          >
            <p style={{ margin: '0 0 20px' }}>
              At VeVe I was never only the person who built things. I was the
              person who asked <span style={{ color: P.accent }}>why</span> we
              were building them, whether we were building the{' '}
              <span style={{ color: P.accent }}>right</span> thing, and how to
              explain the answer to someone who had never written a line of
              code.
            </p>
            <p style={{ margin: '0 0 20px', color: P.dim }}>
              Over six years that stopped being a personality trait and became
              most of my job. Surveys to find out what users actually wanted.
              Prioritization sessions where I argued the queue. Scope
              conversations with leadership, held in their terms rather than
              mine. PRDs I helped write because the spec needed a technical
              reality check before anyone committed to a date.
            </p>
            <p style={{ margin: 0, color: P.dim }}>
              I am going after product roles now because that work is what I
              want to do full time. The engineering does not go away. It is
              the reason I can tell a two-week estimate from a two-month one
              before anyone has opened an editor.
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
                'Turning an architecture argument into a business one.',
                'Feedback in planning that changes the plan.',
                'Reading a spec and seeing the four weeks nobody costed.',
                'Knowing when not to ship.',
                'Teaching — four years, in two languages.',
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

      {/* ─── PRODUCT ─── */}
      <section
        id="product"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: sp,
          borderTop: `1px solid ${P.line}`,
        }}
      >
        <SectionHead
          num="02"
          label="product"
          title="Decisions, not just delivery."
        />
        <p
          className="sans"
          style={{
            marginTop: 40,
            marginBottom: 0,
            fontSize: 16,
            lineHeight: 1.7,
            color: P.dim,
            maxWidth: 620,
          }}
        >
          Five write-ups of calls I made at VeVe, each with the situation, the
          reasoning, and what actually happened — including the one that ended
          badly. Nobody assigned me most of this work. It was the part of the
          job I kept reaching for, which is why I am now going after it
          directly.
        </p>
        <div style={{ marginTop: 40 }}>
          {DATA.caseStudies.map((cs, i) => (
            <CaseStudyRow key={i} cs={cs} first={i === 0} isMobile={isMobile} />
          ))}
        </div>
        <div style={{ marginTop: 24 }}>
          <a
            href={DATA.caseStudiesUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-link"
            style={{ color: P.dim }}
          >
            all case studies <span>↗</span>
          </a>
        </div>

        {/* Recommendations */}
        <div
          style={{
            marginTop: 56,
            color: P.warn,
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          // what they said about it
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: 24,
          }}
        >
          {DATA.recommendations.map((r, i) => (
            <blockquote
              key={i}
              className="sans"
              style={{
                margin: 0,
                padding: 28,
                background: P.bgAlt,
                border: `1px solid ${P.line}`,
                borderLeft: `2px solid ${P.accent}`,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: P.ink,
                }}
              >
                &quot;{r.quote}&quot;
              </p>
              <footer
                style={{
                  marginTop: 16,
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: P.mute,
                }}
              >
                <span style={{ color: P.accent }}>{r.who}</span>
                <br />
                {r.detail}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* ─── EXPERIENCE ─── */}
      <section
        id="experience"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: sp,
          borderTop: `1px solid ${P.line}`,
        }}
      >
        <SectionHead
          num="03"
          label="experience"
          title="Eight years. One long streak."
        />
        <div style={{ marginTop: 40 }}>
          {DATA.experience.map((job, i) => (
            <div
              key={i}
              style={{
                padding: '32px 0',
                borderTop: i === 0 ? `1px solid ${P.line}` : 'none',
                borderBottom: `1px solid ${P.line}`,
                ...(isMobile
                  ? {}
                  : {
                      display: 'grid',
                      gridTemplateColumns: '160px 1fr',
                      gap: 40,
                    }),
              }}
            >
              {isMobile ? (
                <div style={{ marginBottom: 12 }}>
                  <span
                    style={{
                      fontSize: 11,
                      color: P.accent,
                      letterSpacing: '0.08em',
                    }}
                  >
                    {job.period}
                  </span>
                  <span style={{ color: P.mute, margin: '0 8px' }}>·</span>
                  <span
                    style={{
                      fontSize: 10,
                      color: P.mute,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {job.place}
                  </span>
                </div>
              ) : (
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
              )}
              <div>
                <div
                  className="sans"
                  style={{
                    fontSize: isMobile ? 18 : 22,
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
          padding: sp,
          borderTop: `1px solid ${P.line}`,
        }}
      >
        <SectionHead
          num="04"
          label="capabilities"
          title="Product work and the stack under it."
        />
        <div
          style={{
            marginTop: 40,
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
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
          padding: sp,
          borderTop: `1px solid ${P.line}`,
        }}
      >
        <SectionHead
          num="05"
          label="github"
          title="Things I build outside the job."
        />
        <div
          style={{
            marginTop: 40,
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
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

      {/* ─── SERIES ─── */}
      <section
        id="series"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: sp,
          borderTop: `1px solid ${P.line}`,
        }}
      >
        <SectionHead num="06" label="teaching" title="The series I wrote to learn it." />
        <a
          href={DATA.series.href}
          style={{
            display: 'block',
            marginTop: 40,
            background: P.bgAlt,
            border: `1px solid ${P.line}`,
            padding: isMobile ? '24px 20px' : '32px 34px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              color: P.mute,
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            {DATA.series.meta}
          </div>
          <div
            className="sans"
            style={{
              color: P.ink,
              fontSize: isMobile ? 22 : 26,
              fontWeight: 500,
              lineHeight: 1.25,
              letterSpacing: '-0.015em',
              marginBottom: 14,
            }}
          >
            {DATA.series.title}
          </div>
          <div
            className="sans"
            style={{
              color: P.dim,
              fontSize: 15,
              lineHeight: 1.65,
              maxWidth: 680,
            }}
          >
            {DATA.series.standfirst}
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              marginTop: 22,
            }}
          >
            {DATA.series.core.map((name, i) => (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  color: P.dim,
                  border: `1px solid ${P.line}`,
                  padding: '5px 10px',
                }}
              >
                <span style={{ color: P.mute, marginRight: 7 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {name}
              </span>
            ))}
          </div>
          <div
            style={{
              color: P.accent,
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginTop: 22,
            }}
          >
            Read the series →
          </div>
        </a>
      </section>

      {/* ─── WRITING ─── */}
      <section
        id="writing"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: sp,
          borderTop: `1px solid ${P.line}`,
        }}
      >
        <SectionHead num="07" label="writing" title="Building in the open." />
        <div
          style={{
            marginTop: 40,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            background: P.line,
            border: `1px solid ${P.line}`,
          }}
        >
          {DATA.writing.map((post, i) => (
            <a
              key={i}
              href={post.href}
              style={{
                display: 'block',
                background: P.bg,
                padding: isMobile ? '22px 20px' : '28px 30px',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  color: P.mute,
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}
              >
                {post.meta}
              </div>
              <div
                className="sans"
                style={{
                  color: P.ink,
                  fontSize: 20,
                  fontWeight: 500,
                  lineHeight: 1.3,
                  letterSpacing: '-0.01em',
                  marginBottom: 12,
                }}
              >
                {post.title}
              </div>
              <div
                className="sans"
                style={{
                  color: P.dim,
                  fontSize: 15,
                  lineHeight: 1.65,
                  maxWidth: 660,
                }}
              >
                {post.standfirst}
              </div>
              <div
                style={{
                  color: P.accent,
                  fontSize: 12,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginTop: 16,
                }}
              >
                Read →
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ─── EARLIER + LANGUAGES ─── */}
      <section
        id="background"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: sp,
          borderTop: `1px solid ${P.line}`,
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr',
          gap: isMobile ? 40 : 56,
        }}
      >
        <div>
          <SectionHead
            num="08"
            label="before code"
            title="Four years in a classroom."
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
          padding: isMobile ? '56px 24px 72px' : '80px 56px 96px',
          borderTop: `1px solid ${P.line}`,
          background: `linear-gradient(180deg, ${P.bg} 0%, ${P.bgAlt} 100%)`,
        }}
      >
        <SectionHead num="09" label="contact" title="Start a conversation." />
        <div
          style={{
            marginTop: 40,
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? 32 : 56,
          }}
        >
          <div>
            <p
              className="sans"
              style={{
                fontSize: isMobile ? 16 : 18,
                lineHeight: 1.55,
                color: P.ink,
                margin: 0,
                maxWidth: 480,
              }}
            >
              I&apos;m looking for remote product roles — product manager or
              technical PM — where being able to read the codebase is an
              advantage rather than a curiosity. I&apos;m equally happy in AI
              or full-stack engineering roles on teams that treat product
              thinking as part of the job. UTC+8, flexible overlap with US and
              EU.
            </p>
          </div>
          <div>
            <dl className="kv sans" style={{ color: P.ink, fontSize: 15 }}>
              <dt>Email</dt>
              <dd
                style={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  color: P.accent,
                  wordBreak: 'break-word',
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
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <span>av / end of file</span>
          <span>build 2026.07 — v1 graphite</span>
          <span>eof ·</span>
        </div>
      </section>
    </div>
  )
}

type CaseStudyData = (typeof DATA.caseStudies)[number]

function CaseStudyRow({
  cs,
  first,
  isMobile,
}: {
  cs: CaseStudyData
  first: boolean
  isMobile: boolean
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={cs.url}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: isMobile ? 'block' : 'grid',
        gridTemplateColumns: isMobile ? undefined : '160px 1fr',
        gap: isMobile ? undefined : 40,
        padding: '32px 0',
        borderTop: first ? `1px solid ${P.line}` : 'none',
        borderBottom: `1px solid ${P.line}`,
        textDecoration: 'none',
        color: P.ink,
      }}
    >
      <div style={{ marginBottom: isMobile ? 12 : 0 }}>
        <div
          style={{
            fontSize: isMobile ? 10 : 10,
            color: P.accent,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            lineHeight: 1.5,
          }}
        >
          {cs.kind}
        </div>
        <div
          style={{
            fontSize: 11,
            color: P.mute,
            letterSpacing: '0.08em',
            marginTop: 6,
          }}
        >
          {cs.year}
        </div>
      </div>
      <div>
        <div
          className="sans"
          style={{
            fontSize: isMobile ? 17 : 20,
            fontWeight: 500,
            letterSpacing: '-0.005em',
            color: hovered ? P.accent : P.ink,
            transition: 'color 0.15s',
          }}
        >
          {cs.title}{' '}
          <span style={{ fontSize: 13, color: P.accentDim }}>↗</span>
        </div>
        <p
          className="sans"
          style={{
            margin: '14px 0 0',
            fontSize: 14,
            lineHeight: 1.7,
            color: P.dim,
          }}
        >
          {cs.standfirst}
        </p>
        <div
          style={{
            marginTop: 16,
            padding: '10px 14px',
            background: P.bgAlt,
            borderLeft: `2px solid ${P.accent}`,
            fontSize: 12,
            lineHeight: 1.6,
            color: P.dim,
          }}
        >
          <span
            style={{
              color: P.mute,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontSize: 9,
            }}
          >
            outcome
          </span>
          <br />
          {cs.outcome}
        </div>
      </div>
    </a>
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
