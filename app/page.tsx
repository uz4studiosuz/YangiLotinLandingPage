"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Download,
  Globe2,
  LockKeyhole,
  MessageCircleMore,
  Sparkles,
  Zap,
} from "lucide-react";
import appIcon from "../app_icon.png";

const modes = {
  yangi: {
    label: "Yangi alifbo",
    sample: "Ğoya kelajakni ōzgartiradi.",
    keys: ["Q", "W", "E", "R", "T", "Y", "U", "I", "Ō", "P", "A", "S", "D", "F", "G", "Ğ", "H", "J", "K", "L", "Ş", "Z", "X", "Ç", "V", "B", "N", "M", "ng", "⌫"],
  },
  lotin: {
    label: "Eski lotin",
    sample: "G‘oya kelajakni o‘zgartiradi.",
    keys: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O‘", "P", "A", "S", "D", "F", "G", "G‘", "H", "J", "K", "L", "Sh", "Z", "X", "Ch", "V", "B", "N", "M", "Ng", "⌫"],
  },
  kirill: {
    label: "Кирилл",
    sample: "Ғоя келажакни ўзгартиради.",
    keys: ["Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Ў", "З", "Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Э", "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "⌫"],
  },
};

type Mode = keyof typeof modes;
type DownloadState = "idle" | "loading" | "done" | "error";

const floatingGlyphs = [
  { glyph: "Ğ", x: "7%", y: "18%", delay: 0 },
  { glyph: "Ş", x: "88%", y: "16%", delay: 1.2 },
  { glyph: "Ç", x: "79%", y: "72%", delay: 2.2 },
  { glyph: "Ō", x: "13%", y: "76%", delay: 0.7 },
  { glyph: "ğ", x: "52%", y: "10%", delay: 1.7 },
];

const accentKeys = new Set(["Ğ", "Ş", "Ç", "Ō", "ğ", "ş", "ç", "ō"]);

function saveBlob(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="Yangi Lotin baş sahifa">
      <span className="logo-mark logo-image">
        <Image src={appIcon} alt="" width={35} height={35} priority />
      </span>
      <span>Yangi Lotin</span>
    </a>
  );
}

function Keyboard({ mode = "yangi", compact = false }: { mode?: Mode; compact?: boolean }) {
  const data = modes[mode];
  return (
    <motion.div
      className={`keyboard ${compact ? "keyboard-compact" : ""}`}
      layout
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
    >
      <div className="suggestion-row">
        <span>{mode === "kirill" ? "мен" : "men"}</span>
        <span>{mode === "kirill" ? "билан" : "bilan"}</span>
        <span>{mode === "kirill" ? "учун" : "uçun"}</span>
      </div>
      <div className="key-grid">
        {data.keys.map((key, i) => (
          <motion.span
            className={accentKeys.has(key) ? "key key-accent" : "key"}
            key={`${mode}-${key}-${i}`}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.008 }}
          >
            {key}
          </motion.span>
        ))}
      </div>
      <div className="keyboard-bottom">
        <span>123</span>
        <Globe2 size={15} />
        <span className="space-key">{data.label}</span>
        <span>↵</span>
      </div>
    </motion.div>
  );
}

function PhoneMockup() {
  const [mode, setMode] = useState<Mode>("yangi");
  const modeKeys = Object.keys(modes) as Mode[];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMode((current) => modeKeys[(modeKeys.indexOf(current) + 1) % modeKeys.length]);
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="phone-wrap">
      <motion.div
        className="phone"
        initial={false}
        animate={{ opacity: 1, y: 0, rotate: 1.5 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="phone-top"><span>9:41</span><span>● ● ◒</span></div>
        <div className="chat-head">
          <span className="avatar">Y</span>
          <span><b>Yaqinlar</b><small>3 kişi onlayn</small></span>
        </div>
        <div className="chat-body">
          <span className="bubble bubble-in">Bugun uçraşamizmi?</span>
          <AnimatePresence mode="wait">
            <motion.span
              className="bubble bubble-out"
              key={mode}
              initial={false}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              {modes[mode].sample}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="mode-tabs">
          {modeKeys.map((key) => (
            <button key={key} className={mode === key ? "active" : ""} onClick={() => setMode(key)}>
              {modes[key].label}
            </button>
          ))}
        </div>
        <Keyboard mode={mode} compact />
        <div className="home-indicator" />
      </motion.div>
      <div className="phone-glow" />
    </div>
  );
}

function DownloadButton({ large = false }: { large?: boolean }) {
  const [state, setState] = useState<DownloadState>("idle");
  const [progress, setProgress] = useState(0);

  const startDownload = () => {
    if (state === "loading") return;

    setState("loading");
    setProgress(0);

    const progressTimer = window.setInterval(() => {
      setProgress((value) => Math.min(value + Math.ceil(Math.random() * 9), 94));
    }, 120);

    fetch("/api/download-demo")
      .then((response) => {
        if (!response.ok) throw new Error("download failed");
        return response.blob();
      })
      .then((blob) => {
        window.clearInterval(progressTimer);
        setProgress(100);
        saveBlob(blob, "yangi-lotin-demo.apk");
        window.setTimeout(() => setState("done"), 350);
      })
      .catch(() => {
        window.clearInterval(progressTimer);
        setProgress(0);
        setState("error");
      });
  };

  return (
    <div className={`download-shell ${large ? "download-large" : ""}`}>
      <button className={`download-button ${state}`} onClick={startDownload} aria-live="polite">
        <span className="download-icon">
          {state === "done" ? <Check size={20} /> : <Download size={20} />}
        </span>
        <span className="download-copy">
          <b>
            {state === "idle"
              ? "Android uçun yuklab oliş"
              : state === "loading"
                ? "Yuklanmoqda..."
                : state === "error"
                  ? "Qayta urinib kōring"
                  : "Yuklab olindi"}
          </b>
          <small>
            {state === "loading"
              ? `${progress}% · Ilova`
              : state === "done"
                ? "Blob fayl saqlandi"
                : state === "error"
                  ? "Aloqa uzildi"
                  : "Bepul · Ilova · Android 8+"}
          </small>
        </span>
        {state === "idle" && <ArrowRight size={19} />}
        {state === "loading" && <b className="progress-number">{progress}%</b>}
      </button>
      {state === "loading" && (
        <motion.span className="progress-bar" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
      )}
    </div>
  );
}

export default function Home() {
  const [showDownload, setShowDownload] = useState(false);
  const [demoMode, setDemoMode] = useState<Mode>("yangi");
  const reducedMotion = useReducedMotion();

  return (
    <main id="top">
      <nav className="nav container">
        <Logo />
        <div className="nav-links">
          <a href="#imkoniyatlar">Imkoniyatlar</a>
          <a href="#alifbolar">Alifbolar</a>
        </div>
        <button className="nav-download" onClick={() => setShowDownload(true)}>
          Yuklab oliş <ArrowDown size={15} />
        </button>
      </nav>

      <section className="hero container">
        <div className="glyph-field" aria-hidden="true">
          {floatingGlyphs.map(({ glyph, x, y, delay }) => (
            <motion.span
              key={`${glyph}-${x}`}
              style={{ left: x, top: y }}
              animate={reducedMotion ? {} : { y: [0, -12, 0], rotate: [-4, 4, -4] }}
              transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
            >
              {glyph}
            </motion.span>
          ))}
        </div>

        <motion.div
          className="hero-copy"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="eyebrow"><Sparkles size={14} /> Ōzbekça yozişning yangi davri</div>
          <h1>Yangi Lotin<br /><span>klaviaturasi.</span></h1>
          <p className="hero-lead">
            <b>Kirill. Eski lotin. Yangi alifbo.</b> Uçalasini ham bitta klaviaturada yozing — tez, ravon va adaşmasdan.
          </p>
          <div className="hero-actions">
            <DownloadButton />
            <a className="text-link" href="#alifbolar">Sinab kōriş <ArrowDown size={17} /></a>
          </div>
          <div className="trust-row">
            <span><Check size={14} /> Reklamasiz</span>
            <span><LockKeyhole size={14} /> Maxfiy</span>
            <span><Zap size={14} /> Juda tez</span>
          </div>
        </motion.div>

        <div className="hero-visual">
          <PhoneMockup />
          <motion.div
            className="floating-note note-one"
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <span className="note-icon">Ğ</span><span><b>Bitta bosişda</b><small>G‘ → Ğ</small></span>
          </motion.div>
          <motion.div
            className="floating-note note-two"
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <MessageCircleMore size={20} /><span><b>3× qulay</b><small>Har qanday ilovada</small></span>
          </motion.div>
        </div>
      </section>

      <section className="ticker" aria-label="Qōllab-quvvatlanadigan harflar">
        <motion.div animate={reducedMotion ? {} : { x: ["0%", "-50%"] }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}>
          {[0, 1].map((group) => (
            <span className="ticker-group" key={group}>
              <b>Ğ ğ</b><i /> <b>Ş ş</b><i /> <b>Ç ç</b><i /> <b>Ō ō</b><i /> <span>Yangi harflar. Taniş tovuşlar.</span><i />
            </span>
          ))}
        </motion.div>
      </section>

      <section className="benefits container" id="imkoniyatlar">
        <div className="section-heading">
          <span className="section-number">01 — IMKONIYATLAR</span>
          <h2>Klaviatura emas.<br />Tilga bōlgan <em>e'tibor.</em></h2>
          <p>Har bir detal ōzbekça yozişni tabiiy his qildiriş uçun ōylangan.</p>
        </div>
        <div className="feature-grid">
          <article className="feature-card feature-primary">
            <span className="card-index">01</span>
            <div className="switch-visual">
              <motion.span animate={reducedMotion ? {} : { x: [0, 96, 192, 0] }} transition={{ duration: 5, repeat: Infinity, times: [0, .3, .6, 1], ease: "easeInOut" }} />
              <b>Кирилл</b><b>Lotin</b><b>Yangi</b>
            </div>
            <h3>Bir zumda almaşing</h3>
            <p>Globus tugmasi bilan uç alifbo ōrtasida matnni tōxtatmay ōting.</p>
          </article>
          <article className="feature-card dark-card">
            <span className="card-index">02</span>
            <div className="prediction-visual"><span>ya</span><b>yaxşi</b><b>yangi</b><b>yaqin</b></div>
            <h3>Sizni tuşunadi</h3>
            <p>Ōzbek tiliga mos aqlli takliflar va avto-tuzatiş.</p>
          </article>
          <article className="feature-card lime-card">
            <span className="card-index">03</span>
            <div className="privacy-visual"><LockKeyhole size={35} /><span>100%<small>qurilmangizda</small></span></div>
            <h3>Yozganingiz — ōzingizniki</h3>
            <p>Matnlaringiz serverga yuborilmaydi. Nuqta.</p>
          </article>
        </div>
      </section>

      <section className="alphabet-section" id="alifbolar">
        <div className="container alphabet-layout">
          <div className="alphabet-copy">
            <span className="section-number">02 — UÇ ALIFBO</span>
            <h2>Qanday yozsangiz ham,<br /><em>ōzbekça.</em></h2>
            <p>Bitta fikrni uç xil yozuvda sinab kōring. Klaviatura siz tanlagan tilda davom etadi.</p>
            <div className="alphabet-tabs">
              {(Object.keys(modes) as Mode[]).map((key) => (
                <button key={key} className={demoMode === key ? "active" : ""} onClick={() => setDemoMode(key)}>
                  <span>{key === "yangi" ? "01" : key === "lotin" ? "02" : "03"}</span>{modes[key].label}
                </button>
              ))}
            </div>
          </div>
          <div className="keyboard-stage">
            <div className="typed-message">
              <span className="typed-label">SIZNING MATNINGIZ</span>
              <AnimatePresence mode="wait">
                <motion.p key={demoMode} initial={false} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  {modes[demoMode].sample}<motion.i animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: .7 }} />
                </motion.p>
              </AnimatePresence>
            </div>
            <Keyboard mode={demoMode} />
          </div>
        </div>
      </section>

      <section className="final-cta container">
        <div className="cta-glyphs" aria-hidden="true"><span>Ğ</span><span>Ş</span><span>Ō</span></div>
        <span className="section-number">HOZIR BOŞLANG</span>
        <h2>Ōzbekça yoziş.<br /><em>Oson bōlişi kerak.</em></h2>
        <p>Bir daqiqada ōrnating. Har bir suhbatda farqni his qiling.</p>
        <DownloadButton large />
      </section>

      <footer className="footer container">
        <Logo />
        <p>Ōzbek tili uçun mehr bilan yaratildi.</p>
        <span>© 2026 Yangi Lotin</span>
      </footer>

      <AnimatePresence>
        {showDownload && (
          <motion.div className="download-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDownload(false)}>
            <motion.div className="download-modal" initial={{ opacity: 0, scale: .9, y: 25 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .94 }} onClick={(event) => event.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowDownload(false)}>×</button>
              <span className="modal-logo">
                <Image src={appIcon} alt="" width={68} height={68} />
              </span>
              <h3>Yangi Lotinni yuklang</h3>
              <p>Ilova · Android 8 va undan yuqori</p>
              <DownloadButton large />
              <small>Yuklaş orqali foydalanış şartlariga rozilik bildirasiz.</small>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
