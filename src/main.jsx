import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import logo from './logo.js';

/* =========================================================
   All parts of the site live in this file, top to bottom:
   Navbar → Gallery → Benefits → Unlocked → RegistrationForm → Contact
   Put photos in: public/images/
   Pages (hash routing):
     (default)        → Home page
     #/registration   → Registration Form page
     #/admin          → Admin Panel page (not in navbar)
   ========================================================= */

/* ---------- ROUTER (simple, hash based) ---------- */
const REGISTRATION_HASH = '#/registration';

const ADMIN_HASH = '#/admin';

function getRoute() {
  if (window.location.hash === ADMIN_HASH) return 'admin';
  return window.location.hash === REGISTRATION_HASH ? 'registration' : 'home';
}

function useRoute() {
  const [route, setRoute] = useState(getRoute);
  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  return route;
}

/* ---------- NAVBAR ---------- */
const LINKS = [
  { href: '#home', label: 'HOME' },
  { href: REGISTRATION_HASH, label: 'REGISTRATION FORM' },
  { href: '#contact', label: 'CONTACT' },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* navbar sticks to the top & turns dark + blurred when scrolling */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <a href="#home" className="brand">
        {/* Logo is in src/logo.js (transparent, embedded) */}
        {logoError ? (
          <span className="brand-text">
            ANARGYA<small>ITS FORMULA EV TEAM</small>
          </span>
        ) : (
          <img
            src={logo}
            alt="Anargya ITS Formula EV Team"
            onError={() => setLogoError(true)}
          />
        )}
      </a>

      <button className="nav-toggle" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
        ☰
      </button>

      <nav className={open ? 'open' : ''}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-content reveal">
        <h1>
          Engineering Indonesia's future
          <br />
          in Formula Student
          <br />
          <span className="green">electric vehicle innovation.</span>
        </h1>
        <p>
          We design, build, and <strong>race electric formula cars</strong>, and
          have represented Indonesia at FSAE Japan, FSAE Australasia, and
          Formula Bharat.
        </p>
        <div className="hero-actions">
          <a href="#parallax" className="btn">
            Explore More <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- BENEFITS ---------- */
const BENEFITS = [
  { title: 'E-Certificate', text: 'for all participants' },
  { title: 'Interactive Q&A session', text: 'with industry professionals' },
  {
    title: 'Deep insights',
    text: 'into sustainability, renewable energy engineering and more from the expert',
  },
];

/* Benefit photos (public/images/benefits/), 2 photos per benefit:
   1.jpg + 1-hover.jpg, 2.jpg + 2-hover.jpg, 3.jpg + 3-hover.jpg
   The "-hover" photo shows when the mouse hovers over the card.
   If a file is missing, a gradient block / the main photo is shown instead. */
const BENEFIT_FALLBACKS = ['#1f3d2c', '#14532d', '#0b2a1a'];

function Benefits() {
  return (
    <section id="benefits" className="benefits">
      <h3 className="benefits-title reveal">Benefits</h3>
      <ul className="benefits-grid">
        {BENEFITS.map((b, i) => (
          <li
            key={b.title}
            className="benefit"
            style={{
              '--img': `url('/images/benefits/${i + 1}.jpg'), linear-gradient(160deg, ${BENEFIT_FALLBACKS[i % BENEFIT_FALLBACKS.length]}, #000)`,
              '--img-hover': `url('/images/benefits/${i + 1}-hover.jpg'), url('/images/benefits/${i + 1}.jpg'), linear-gradient(160deg, ${BENEFIT_FALLBACKS[i % BENEFIT_FALLBACKS.length]}, #000)`,
            }}
          >
            <span className="benefit-bg" aria-hidden="true" />
            <span className="benefit-bg benefit-bg-hover" aria-hidden="true" />
            <strong>{b.title}</strong>
            <span className="benefit-text">{b.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- SKILLS UNLOCKED (F1 Unlocked style banner) ----------
   Green top, black bottom, photo in the middle overlapping both,
   with the monitor + the person's head popping out of the frame.
   Files in public/images/ :
     unlocked.jpg          full original photo 1728x1152 (cropped by the frame)
     unlocked-monitor.png  monitor cutout (transparent)
     unlocked-head.png     head cutout (transparent)
   Photo position/zoom is set via --iw, --lx, --ty in style.css (.unlocked).
   Each cutout's position is set in .pop-monitor / .pop-head (style.css). */
function Unlocked() {
  return (
    <section id="unlocked" className="unlocked">
      <div className="unlocked-stage">
        <span className="unlocked-tri top" aria-hidden="true" />
        <span className="unlocked-side unlocked-side-r" aria-hidden="true">
          Anargya ITS · Energize Talk
        </span>

        <figure className="unlocked-card reveal">
          {/* bottom layer: full photo, cropped by the frame */}
          <div className="unlocked-clip">
            <img
              className="unlocked-photo"
              src="/images/unlocked.jpg"
              alt="Anargya ITS member trying an F1 simulator"
            />
          </div>

          {/* top layer: 2 cutouts, NOT cropped by the frame -> pop out of it */}
          <div className="unlocked-pops" aria-hidden="true">
            <img className="pop-monitor" src="/images/unlocked-monitor.png" alt="" />
            <img className="pop-head" src="/images/unlocked-head.png" alt="" />
          </div>

          <h2>Skills Unlocked</h2>
          <p>Get ready to drive meaningful change</p>
        </figure>

        <span className="unlocked-side unlocked-side-l" aria-hidden="true">
          Anargya ITS · Energize Talk
        </span>
        <span className="unlocked-tri bot" aria-hidden="true" />
      </div>

      <div className="unlocked-cta reveal d2">
        <a href={REGISTRATION_HASH} className="unlocked-btn">
          Register now for free
        </a>
      </div>
    </section>
  );
}

/* ---------- GALLERY (parallax) ----------
   Photos: public/images/gallery/1.jpg ... 7.jpg
   Want a different count? Change GALLERY_COUNT (use an odd number so one sits in the middle).
   If a file is missing, a gradient block is shown as a placeholder. */
const GALLERY_COUNT = 7;
const PHOTOS = Array.from({ length: GALLERY_COUNT }, (_, i) => `/images/gallery/${i + 1}.jpg`);
const FALLBACKS = [
  '#374151', '#15803d', '#29d270', '#f97316', '#14532d', '#52525b', '#365314',
];
const MAX_Z = 9; // must match --max-z in style.css

function Gallery() {
  const [p, setP] = useState(0); // hovered photo (1-based), 0 = none
  const [z, setZ] = useState(1); // zone inside the photo (1..MAX_Z)
  const [pressed, setPressed] = useState(false);

  const track = (clientX, clientY) => {
    const el = document.elementFromPoint(clientX, clientY)?.closest('[data-index]');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    setP(Number(el.dataset.index) + 1);
    setZ(Math.min(MAX_Z, Math.max(1, Math.floor(ratio * MAX_Z) + 1)));
  };

  const reset = () => {
    setP(0);
    setPressed(false);
  };

  const style = { '--max-p': PHOTOS.length };
  if (p > 0) {
    style['--p'] = p;
    style['--z'] = pressed ? (MAX_Z + 1) / 2 : z;
  }

  return (
    <section id="home" className="gallery">
      <div className="gallery-top">
      <div className="reveal d2 pg-wrap">
        <div
          className={`pg${pressed ? ' pressed' : ''}`}
          style={style}
          onPointerMove={(e) => track(e.clientX, e.clientY)}
          onPointerDown={(e) => {
            setPressed(true);
            track(e.clientX, e.clientY);
          }}
          onPointerUp={() => setPressed(false)}
          onPointerCancel={reset}
          onPointerLeave={reset}
        >
          {PHOTOS.map((src, i) => (
            <div
              key={src}
              data-index={i}
              className={`pg-item${p === i + 1 ? ' hot' : ''}`}
              style={{ '--i': i }}
            >
              <div
                className="pg-img"
                style={{
                  '--img': `url('${src}'), linear-gradient(160deg, ${FALLBACKS[i % FALLBACKS.length]}, #000)`,
                }}
              />
            </div>
          ))}
        </div>

        {/* TEXT OVERLAY (outside .pg so it isn't covered by the 3D photo effect) */}
        <h2 className="pg-title" aria-label="Energize Talk">Energize Talk</h2>
      </div>
      </div>

      <p className="gallery-desc reveal d2">
        An inspiring talk show by <strong>Anargya ITS</strong> that explores
        the intersection of engineering, innovation, and sustainability.
        Bringing together ideas and perspectives on the future of technology
        and sustainable mobility, Energize Talk aims to spark curiosity,
        broaden knowledge, and inspire the next generation of innovators to
        drive meaningful change.
      </p>

    </section>
  );
}

/* ---------- PARALLAX SCENE (CSS scroll-driven, no JS) ----------
   Each layer is an inline SVG. --offset sets how far the layer moves:
   1 = farthest back (moves the most, "follows" us), 0 = stays still.
   The animation lives in style.css (.px-layer). No external images needed. */
const STARS = Array.from({ length: 44 }, (_, i) => ({
  x: (i * 397) % 1600,
  y: -300 + ((i * 173) % 640),
  r: 0.8 + ((i * 7) % 3) * 0.5,
  o: 0.3 + ((i * 11) % 5) * 0.12,
}));

function Layer({ offset, children }) {
  return (
    <div className="px-layer" style={{ '--offset': offset }} aria-hidden="true">
      <svg viewBox="0 0 1600 1620" preserveAspectRatio="xMidYMid slice">
        <g transform="translate(0 360)">{children}</g>
      </svg>
    </div>
  );
}

function Wheel({ cx, cy, r }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#060908" stroke="#1d2b24" strokeWidth="4" />
      <circle cx={cx} cy={cy} r={r * 0.62} fill="#0f1814" stroke="#29d270" strokeWidth="3" />
      {[0, 72, 144, 216, 288].map((a) => (
        <line
          key={a}
          x1={cx}
          y1={cy}
          x2={cx + r * 0.6 * Math.cos((a * Math.PI) / 180)}
          y2={cy + r * 0.6 * Math.sin((a * Math.PI) / 180)}
          stroke="#29d270"
          strokeWidth="2"
          opacity=".6"
        />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.12} fill="#29d270" />
    </g>
  );
}

function Cone({ x, y, s }) {
  return (
    <g>
      <polygon
        points={`${x - s * 0.5},${y} ${x + s * 0.5},${y} ${x + s * 0.12},${y - s * 1.3} ${x - s * 0.12},${y - s * 1.3}`}
        fill="#ff7a1a"
      />
      <polygon
        points={`${x - s * 0.3},${y - s * 0.55} ${x + s * 0.3},${y - s * 0.55} ${x + s * 0.2},${y - s * 0.85} ${x - s * 0.2},${y - s * 0.85}`}
        fill="#fff"
      />
      <rect x={x - s * 0.62} y={y} width={s * 1.24} height={s * 0.14} rx="2" fill="#e55a00" />
    </g>
  );
}

function ParallaxScene() {
  return (
    <section id="parallax" className="px">
      <div className="px-frame" role="img" aria-label="Illustration of a Formula Student car on a race track with grandstands and stadium lights.">
        {/* 1. Sky + glow (farthest back) */}
        <Layer offset={1}>
          <defs>
            <linearGradient id="pxSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#020a06" />
              <stop offset=".55" stopColor="#06231a" />
              <stop offset="1" stopColor="#0b3d26" />
            </linearGradient>
            <radialGradient id="pxGlow" cx=".5" cy=".5" r=".5">
              <stop offset="0" stopColor="#29d270" stopOpacity=".45" />
              <stop offset="1" stopColor="#29d270" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect x="0" y="-360" width="1600" height="1620" fill="url(#pxSky)" />
          <ellipse cx="800" cy="520" rx="760" ry="260" fill="url(#pxGlow)" />
          {STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#e8fff1" opacity={s.o} />
          ))}
        </Layer>

        {/* 2. Giant outline text */}
        <Layer offset={0.9}>
          <text
            x="800"
            y="400"
            textAnchor="middle"
            fontSize="150"
            fontWeight="800"
            fontFamily="Montserrat, sans-serif"
            fill="none"
            stroke="#29d270"
            strokeWidth="2"
            opacity=".45"
            textLength="1400"
            lengthAdjust="spacingAndGlyphs"
          >
            FORMULA STUDENT
          </text>
        </Layer>

        {/* 3. Tree line / hills */}
        <Layer offset={0.75}>
          <path
            d="M0 470 Q120 400 240 450 T480 440 T720 430 T960 450 T1200 420 T1440 445 T1600 430 L1600 1260 L0 1260 Z"
            fill="#04140d"
          />
        </Layer>

        {/* 4. Grandstand + stadium lights + banner */}
        <Layer offset={0.6}>
          <defs>
            <linearGradient id="pxBeam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#d9ffe9" stopOpacity=".35" />
              <stop offset="1" stopColor="#29d270" stopOpacity="0" />
            </linearGradient>
            <pattern id="pxCrowd" width="14" height="12" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="2.2" fill="#29d270" opacity=".55" />
              <circle cx="11" cy="9" r="2" fill="#e8fff1" opacity=".35" />
            </pattern>
          </defs>
          <polygon points="225,330 255,330 560,760 40,760" fill="url(#pxBeam)" />
          <polygon points="1345,330 1375,330 1560,760 1040,760" fill="url(#pxBeam)" />
          <rect x="60" y="470" width="1480" height="22" fill="#0a1f16" />
          <rect x="60" y="492" width="1480" height="120" fill="url(#pxCrowd)" />
          <rect x="0" y="612" width="1600" height="700" fill="#061510" />
          {[235, 795, 1355].map((x) => (
            <g key={x}>
              <rect x={x} y="330" width="10" height="290" fill="#0c2a1e" />
              <rect x={x - 20} y="318" width="50" height="18" fill="#bfffd8" />
            </g>
          ))}
          <rect x="200" y="625" width="1200" height="42" fill="#29d270" />
          <text
            x="800"
            y="654"
            textAnchor="middle"
            fontSize="24"
            fontWeight="800"
            letterSpacing="10"
            fontFamily="Montserrat, sans-serif"
            fill="#000"
          >
            ANARGYA ITS · FORMULA EV TEAM
          </text>
        </Layer>

        {/* 5. Track + curb */}
        <Layer offset={0.35}>
          <defs>
            <linearGradient id="pxAsphalt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0f1d16" />
              <stop offset="1" stopColor="#040806" />
            </linearGradient>
            <pattern id="pxCurb" width="80" height="22" patternUnits="userSpaceOnUse">
              <rect width="40" height="22" fill="#29d270" />
              <rect x="40" width="40" height="22" fill="#f5f5f5" />
            </pattern>
          </defs>
          <rect x="0" y="700" width="1600" height="600" fill="url(#pxAsphalt)" />
          <rect x="0" y="700" width="1600" height="22" fill="url(#pxCurb)" />
          <line x1="0" y1="960" x2="1600" y2="960" stroke="#e8fff1" strokeWidth="6" strokeDasharray="90 70" opacity=".5" />
        </Layer>

        {/* 6. Car */}
        <Layer offset={0.15}>
          <ellipse cx="780" cy="724" rx="470" ry="14" fill="#000" opacity=".55" />
          {/* front wing */}
          <rect x="372" y="670" width="200" height="10" fill="#0c1511" stroke="#29d270" strokeWidth="2" />
          <rect x="372" y="648" width="7" height="40" fill="#0c1511" stroke="#29d270" strokeWidth="1.5" />
          {/* roll hoop */}
          <path d="M930 596 L948 498 L982 494 L992 604" fill="none" stroke="#1d2b24" strokeWidth="10" strokeLinejoin="round" />
          {/* rear wing */}
          <path d="M1130 612 L1150 540" stroke="#1d2b24" strokeWidth="6" />
          <rect x="1128" y="528" width="118" height="12" fill="#0c1511" stroke="#29d270" strokeWidth="2" />
          <rect x="1128" y="506" width="8" height="66" fill="#0c1511" stroke="#29d270" strokeWidth="1.5" />
          <rect x="1238" y="506" width="8" height="66" fill="#0c1511" stroke="#29d270" strokeWidth="1.5" />
          {/* body */}
          <path
            d="M400 672 L424 650 L600 626 L760 602 L802 572 L882 566 L934 592 L1060 602 L1140 614 L1152 652 L1120 676 Z"
            fill="#0c1511"
            stroke="#29d270"
            strokeWidth="2"
          />
          <path d="M470 650 L1090 624" stroke="#29d270" strokeWidth="3" />
          <text
            x="545"
            y="656"
            fontSize="30"
            fontWeight="800"
            fontFamily="Montserrat, sans-serif"
            fill="#29d270"
            transform="rotate(-6 545 656)"
          >
            21
          </text>
          {/* driver + halo */}
          <circle cx="846" cy="556" r="24" fill="#29d270" />
          <rect x="850" y="548" width="20" height="9" rx="3" fill="#000" />
          <path d="M792 588 Q842 506 912 586" fill="none" stroke="#e8fff1" strokeWidth="5" strokeLinecap="round" opacity=".85" />
          {/* suspension */}
          <line x1="600" y1="640" x2="590" y2="665" stroke="#1d2b24" strokeWidth="5" />
          <line x1="1020" y1="620" x2="1010" y2="655" stroke="#1d2b24" strokeWidth="5" />
          {/* wheels */}
          <Wheel cx={590} cy={665} r={54} />
          <Wheel cx={1010} cy={655} r={62} />
        </Layer>

        {/* 7. Cones (almost still) */}
        <Layer offset={0.05}>
          <Cone x={140} y={800} s={64} />
          <Cone x={310} y={850} s={78} />
          <Cone x={470} y={780} s={52} />
          <Cone x={1180} y={790} s={56} />
          <Cone x={1330} y={845} s={76} />
          <Cone x={1480} y={800} s={64} />
        </Layer>

        {/* 8. Vignette (still) */}
        <Layer offset={0}>
          <defs>
            <radialGradient id="pxVig" cx=".5" cy=".5" r=".75">
              <stop offset=".55" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor="#000" stopOpacity=".65" />
            </radialGradient>
          </defs>
          <rect x="0" y="-360" width="1600" height="1620" fill="url(#pxVig)" />
        </Layer>

        <div className="px-caption">
          <span>Anargya ITS</span>
          <strong>Engineered. Built. Raced.</strong>
        </div>
      </div>
    </section>
  );
}

/* ---------- GOOGLE SHEETS (database) ----------
   Paste your Apps Script Web App URL below (ends with /exec).
   See Code.gs for the backend script. */
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxxkE6-AVuqUmsDxy4hWCvVEv9Z1rWoy7ZMGdHEAAthDy-DH3CbbRGFMYGe0hZIDPt9/exec';
const SHEETS_READY = Boolean(SHEETS_URL);
const ADMIN_KEY_STORAGE = 'energize-talk-admin-key';

/* text/plain avoids the browser's CORS preflight, which Apps Script can't answer */
async function sheetsRequest(payload) {
  const res = await fetch(SHEETS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

/* ---------- REGISTRATION FORM (separate page) ----------
   Submissions are saved to a Google Sheet through Apps Script (see SHEETS_URL).
   All fields are required, with a warning under each empty field. */
const FIELDS = [
  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'name@email.com' },
  {
    name: 'institution',
    label: 'Institution / University',
    type: 'text',
    placeholder: 'e.g. Sepuluh Nopember Institute of Technology',
  },
  { name: 'major', label: 'Major', type: 'text', placeholder: 'e.g. Mechanical Engineering' },
  { name: 'whatsapp', label: 'WhatsApp Number', type: 'tel', placeholder: '08xxxxxxxxxx' },
];

const EMPTY = { name: '', email: '', institution: '', major: '', whatsapp: '' };

function RegistrationForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* returns an error message for one field, or '' if it's valid */
  const validateField = (field, value) => {
    const v = value.trim();
    if (!v) return `${field.label} is required.`;
    if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(v)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    /* clear the warning as soon as the user starts typing */
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
  };

  /* show the warning when the user leaves an empty field */
  const onBlur = (e) => {
    const field = FIELDS.find((f) => f.name === e.target.name);
    setErrors((er) => ({ ...er, [field.name]: validateField(field, e.target.value) }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    FIELDS.forEach((f) => {
      newErrors[f.name] = validateField(f, values[f.name]);
    });
    setErrors(newErrors);

    const firstInvalid = FIELDS.find((f) => newErrors[f.name]);
    if (firstInvalid) {
      e.target.elements[firstInvalid.name]?.focus();
      return;
    }

    const payload = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, v.trim()])
    );

    setLoading(true);
    setStatus({ type: '', text: 'Submitting...' });

    try {
      if (!SHEETS_READY) throw new Error('Google Sheets URL is not set');
      const result = await sheetsRequest(payload);
      if (!result.ok) {
        if (result.error === 'duplicate') {
          setErrors({ email: 'This email is already registered.' });
          setStatus({ type: '', text: '' });
          e.target.elements.email?.focus();
          return;
        }
        throw new Error(result.error || 'Request failed');
      }
      setValues(EMPTY);
      setErrors({});
      setStatus({ type: '', text: '' });
      setSuccess(true);
    } catch {
      setStatus({ type: 'err', text: 'Failed to submit. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="register" className="register register-page">
      <h2 className="section-title reveal">Registration Form</h2>
      <form className="form reveal d2" onSubmit={onSubmit} noValidate>
        {FIELDS.map((f) => (
          <label key={f.name}>
            {f.label}
            <input
              type={f.type}
              name={f.name}
              value={values[f.name]}
              onChange={onChange}
              onBlur={onBlur}
              placeholder={f.placeholder}
              className={errors[f.name] ? 'invalid' : ''}
              aria-invalid={errors[f.name] ? 'true' : 'false'}
              required
            />
            {errors[f.name] && (
              <span className="field-error" role="alert">
                {errors[f.name]}
              </span>
            )}
          </label>
        ))}
        <button type="submit" disabled={loading}>
          Register Now
        </button>
        <p className={`form-msg ${status.type}`} role="status">
          {status.text}
        </p>
      </form>

      {/* FULLSCREEN SUCCESS MESSAGE */}
      {success && (
        <div className="success-screen" role="dialog" aria-modal="true" aria-labelledby="success-title">
          <div className="success-box">
            <div className="success-icon" aria-hidden="true">✓</div>
            <h2 id="success-title">Registration Successful!</h2>
            <p>
              Thank you for registering for <strong>Energize Talk</strong>.
              <br />
              We have received your registration. See you at the event!
            </p>
            <a href="#home" className="btn" onClick={() => setSuccess(false)}>
              Back to Home
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- ADMIN PANEL (separate page: #/admin) ----------
   The password is checked by the Apps Script (ADMIN_KEY in Code.gs),
   not stored in this file. To edit or delete a registration, open the
   Google Sheet directly. */
function AdminPanel() {
  const [adminKey, setAdminKey] = useState(() => {
    try {
      return sessionStorage.getItem(ADMIN_KEY_STORAGE) || '';
    } catch {
      return '';
    }
  });
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(Boolean(adminKey));
  const [loadError, setLoadError] = useState('');

  const logout = () => {
    try {
      sessionStorage.removeItem(ADMIN_KEY_STORAGE);
    } catch {
      /* ignore */
    }
    setAdminKey('');
    setRows([]);
  };

  const load = async (key = adminKey) => {
    setLoading(true);
    setLoadError('');
    try {
      const r = await sheetsRequest({ action: 'list', key });
      if (r.ok) {
        setRows(r.rows || []);
      } else if (r.error === 'unauthorized') {
        logout();
        setLoginError('Incorrect password.');
      } else {
        throw new Error('Request failed');
      }
    } catch {
      setLoadError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* reopen the dashboard automatically if the password is remembered for this tab */
  useEffect(() => {
    if (adminKey && SHEETS_READY) load(adminKey);
    else setLoading(false);
  }, []);

  const onLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');
    try {
      const r = await sheetsRequest({ action: 'list', key: password });
      if (r.ok) {
        try {
          sessionStorage.setItem(ADMIN_KEY_STORAGE, password);
        } catch {
          /* ignore */
        }
        setRows(r.rows || []);
        setAdminKey(password);
        setPassword('');
      } else if (r.error === 'unauthorized') {
        setLoginError('Incorrect password.');
      } else {
        setLoginError('Something went wrong. Please try again.');
      }
    } catch {
      setLoginError('Could not connect. Please try again.');
    } finally {
      setLoggingIn(false);
    }
  };

  const q = query.trim().toLowerCase();
  const filtered = q
    ? rows.filter((r) => FIELDS.some((f) => String(r[f.name] || '').toLowerCase().includes(q)))
    : rows;

  const formatDate = (iso) => {
    if (!iso) return '-';
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
      ? '-'
      : d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
  };

  const exportCsv = () => {
    const head = [...FIELDS.map((f) => f.label), 'Registered At'];
    const body = filtered.map((r) => [...FIELDS.map((f) => r[f.name] || ''), r.created_at || '']);
    const csv = [head, ...body]
      .map((cols) => cols.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\r\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'registrations.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ----- not configured ----- */
  if (!SHEETS_READY) {
    return (
      <section className="register register-page">
        <h2 className="section-title">Admin Panel</h2>
        <p className="form-msg err" style={{ textAlign: 'center' }}>
          Google Sheets is not connected. Set SHEETS_URL in src/main.jsx.
        </p>
      </section>
    );
  }

  /* ----- login screen ----- */
  if (!adminKey) {
    return (
      <section className="register register-page">
        <h2 className="section-title">Admin Login</h2>
        <form className="form" onSubmit={onLogin}>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLoginError('');
              }}
              placeholder="Enter admin password"
              className={loginError ? 'invalid' : ''}
              required
              autoFocus
            />
            {loginError && (
              <span className="field-error" role="alert">
                {loginError}
              </span>
            )}
          </label>
          <button type="submit" disabled={loggingIn}>
            {loggingIn ? 'Checking...' : 'Login'}
          </button>
        </form>
      </section>
    );
  }

  /* ----- dashboard ----- */
  return (
    <section className="register register-page admin">
      <h2 className="section-title">Admin Panel</h2>

      <div className="admin-wrap">
        <div className="admin-stats">
          <div className="admin-stat">
            <strong>{rows.length}</strong>
            <span>Total registrations</span>
          </div>
          <div className="admin-stat">
            <strong>{filtered.length}</strong>
            <span>Shown</span>
          </div>
        </div>

        <div className="admin-toolbar">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, institution, major..."
          />
          <button type="button" onClick={() => load()} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button type="button" onClick={exportCsv} disabled={!filtered.length}>
            Export CSV
          </button>
          <button type="button" className="ghost" onClick={logout}>
            Logout
          </button>
        </div>

        {loadError && <p className="form-msg err">{loadError}</p>}

        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                {FIELDS.map((f) => (
                  <th key={f.name}>{f.label}</th>
                ))}
                <th>Registered At</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td className="admin-empty" colSpan={FIELDS.length + 2}>
                    {loading
                      ? 'Loading...'
                      : rows.length
                        ? 'No results found.'
                        : 'No registrations yet.'}
                  </td>
                </tr>
              ) : (
                filtered.map((r, i) => (
                  <tr key={r.id ?? i}>
                    <td>{i + 1}</td>
                    {FIELDS.map((f) => (
                      <td key={f.name}>{r[f.name] || '-'}</td>
                    ))}
                    <td>{formatDate(r.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="admin-note">
          To edit or delete a registration, open the Google Sheet directly.
        </p>
      </div>
    </section>
  );
}

/* ---------- CONTACT ---------- */
function Contact() {
  return (
    <footer id="contact" className="contact">
      <div className="reveal">
      <h2 className="section-title">Contact</h2>
      <p>
        Anargya ITS Formula EV Team
        <br />
        Institut Teknologi Sepuluh Nopember, Surabaya
      </p>
      <p>
        <a href="mailto:anargya@its.ac.id">anargya@its.ac.id</a> ·{' '}
        <a href="https://instagram.com/anargya.its" target="_blank" rel="noopener noreferrer">
          @anargya.its
        </a>
      </p>
      <small>
        © 2026 Anargya ITS. All rights reserved.
        <a href={ADMIN_HASH} className="admin-link">Admin</a>
      </small>
      </div>
    </footer>
  );
}

/* ---------- FADE IN / OUT EFFECT ----------
   Elements with the "reveal" class fade in when they enter the screen and
   fade out when they leave, repeating on every scroll.
   Re-runs whenever the page (route) changes. */
function useReveal(route) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.target.classList.toggle('visible', e.isIntersecting));
      },
      { threshold: 0.2 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [route]);
}

/* ---------- APP ---------- */
function App() {
  const route = useRoute();
  useReveal(route);

  /* after switching pages: go to top (or to the section in the URL hash) */
  useEffect(() => {
    if (route === 'registration' || route === 'admin') {
      window.scrollTo(0, 0);
      return;
    }
    const id = window.location.hash.slice(1);
    if (id) {
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    } else {
      window.scrollTo(0, 0);
    }
  }, [route]);

  return (
    <>
      <Navbar />
      <main>
        {route === 'admin' ? (
          <AdminPanel />
        ) : route === 'registration' ? (
          <RegistrationForm />
        ) : (
          <>
            <Gallery />
            <Benefits />
            <Unlocked />
          </>
        )}
      </main>
      <Contact />
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);