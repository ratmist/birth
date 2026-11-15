import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownRight, ArrowLeft, ArrowRight, Heart, Music2, Volume2, VolumeX, X } from 'lucide-react'
import { awards, config, memories } from './content'
import './style.css'


function Photo({ src, label }: { src: string; label: string }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (failed) {
    return (
      <div className="image-placeholder">
        <span>✳</span>
        <small>YOUR ICONIC PHOTO HERE</small>
        <p>{label}</p>
      </div>
    )
  }

  return (
    <img
      className="real-photo"
      src={src}
      alt={label}
      onError={() => setFailed(true)}
    />
  )
}

function Confetti({ run }: { run: number }) {
  if (!run) return null
  return <div key={run} className="confetti" aria-hidden="true">{Array.from({ length: 80 }, (_, i) => <i key={i} style={{ left: `${(i * 83.7) % 100}%`, animationDelay: `${(i % 19) * .055}s`, animationDuration: `${2.2 + (i % 7) * .35}s`, backgroundColor: ['#eaff64','#ff50b8','#a4a2ff','#50e6ef','#fff'][i % 5] }} />)}</div>
}

type QuizOption = { label: string; reaction: string }
type QuizQuestion = { title: string; options: QuizOption[] }

const slayQuestions: QuizQuestion[] = [
  { title: 'Нина заходит на вечеринку. Что происходит?', options: [
    { label: 'Все оборачиваются', reaction: 'Ну а как иначе? Камеры уже включены.' },
    { label: 'DJ меняет плейлист', reaction: 'У диджея появился новый босс.' },
    { label: 'Кто-то начинает ревновать', reaction: 'Осторожно, уровень зависти повышен.' },
    { label: 'ВСЁ ВЫШЕПЕРЕЧИСЛЕННОЕ', reaction: 'Именно. Это был вопрос на внимательность.' }
  ]},
  { title: 'Что у Нины в сумочке?', options: [
    { label: 'Блеск для губ и немного хаоса', reaction: 'Сертифицированный набор it-girl.' },
    { label: 'Ключи от сердечек', reaction: 'Коллекция уже не помещается.' },
    { label: 'Секретная суперсила', reaction: 'Мы ничего не видели, но подозреваем.' },
    { label: 'ВСЯ ВСЕЛЕННАЯ', reaction: 'Сумка небольшая, амбиции огромные.' }
  ]},
  { title: 'У Нины 5 минут на сборы. Она...', options: [
    { label: 'Устраивает модный показ', reaction: 'Пять минут — полноценная fashion week.' },
    { label: 'Выходит уже иконой', reaction: 'Базовая комплектация, ничего необычного.' },
    { label: 'Меняет образ 12 раз', reaction: 'Каждый образ достоин отдельной обложки.' },
    { label: 'Опаздывает эффектно', reaction: 'Легенды не опаздывают. Они появляются.' }
  ]},
  { title: 'Какой официальный титул у Нины?', options: [
    { label: 'CEO OF SLAY', reaction: 'Совет директоров единогласно одобрил.' },
    { label: 'Министр красивой жизни', reaction: 'Указ вступает в силу немедленно.' },
    { label: 'Главная героиня', reaction: 'Кастинг закрыт, роль уже занята.' },
    { label: 'Все три, естественно', reaction: 'Многозадачность — её второе имя.' }
  ]},
  { title: 'Что пожелаем Нине в новом году жизни?', options: [
    { label: 'Море любви и приключений', reaction: 'Пусть сбывается всё самое невероятное.' },
    { label: 'Денег на все хотелки', reaction: 'Финансовый отдел поддерживает.' },
    { label: 'Людей, с которыми можно быть собой', reaction: 'И много моментов, которые хочется сохранить.' },
    { label: 'ВСЁ И СРАЗУ!', reaction: 'Вот это мы и зафиксируем официально.' }
  ]}
]

function SlayDetector({ onCelebrate }: { onCelebrate: () => void }) {
  const [step, setStep] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [phase, setPhase] = useState<'intro' | 'questions' | 'scan' | 'result'>('intro')

  useEffect(() => {
    if (phase !== 'scan') return
    const timer = window.setTimeout(() => { setPhase('result'); onCelebrate() }, 2700)
    return () => window.clearTimeout(timer)
  }, [phase, onCelebrate])

  const answer = (index: number) => {
    if (selectedOption !== null) return
    setSelectedOption(index)
  }
  const next = () => {
    setSelectedOption(null)
    if (step === slayQuestions.length - 1) setPhase('scan')
    else setStep(s => s + 1)
  }
  const restart = () => { setStep(0); setSelectedOption(null); setPhase('questions') }

  return <section className="slay-lab" id="slay-detector">
    <div className="slay-lab-head"><span>★ NINAWORLD RESEARCH LAB ©</span><span>CONFIDENTIAL / CLASSIFIED ICON</span></div>
    <div className="slay-layout">
      <div className="slay-main">
        {phase === 'intro' && <motion.div key="intro" initial={{opacity:0,y:15}} animate={{opacity:1,y:0}}>
          <div className="eyebrow">THE OFFICIAL 2000s GIRL QUIZ</div>
          <h2>SLAY<br/><em>DETECTOR™</em></h2>
          <p className="slay-desc">Насколько Нина икона? Наши эксперты подготовили 5 научно сомнительных вопросов, чтобы выяснить правду.</p>
          <div className="slay-stats"><span>5 QUESTIONS</span><span>0% OBJECTIVITY</span><span>100% NINA</span></div>
          <button className="slay-primary" onClick={()=>setPhase('questions')}>START THE SCAN <ArrowRight size={20}/></button>
        </motion.div>}
        {phase === 'questions' && <motion.div key={step} initial={{opacity:0,x:25}} animate={{opacity:1,x:0}} transition={{duration:.28}}>
          <div className="slay-progress-label"><span>ICON ASSESSMENT IN PROGRESS</span><b>0{step+1} / 0{slayQuestions.length}</b></div>
          <div className="slay-progress"><span style={{width:`${(step+1)/slayQuestions.length*100}%`}}/></div>
          <h2 className="slay-question">{slayQuestions[step].title}</h2>
          <div className="slay-options">{slayQuestions[step].options.map((opt,i)=><button key={i} className={`slay-choice ${selectedOption===i?'is-selected':''}`} disabled={selectedOption!==null} onClick={()=>answer(i)}><span className="slay-choice-key">{String.fromCharCode(65+i)}</span><span>{opt.label}</span><span>↗</span></button>)}</div>
          {selectedOption!==null && <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="slay-reaction" aria-live="polite"><b>ICON EXPERT SAYS:</b><p>{slayQuestions[step].options[selectedOption].reaction}</p><button className="slay-primary" onClick={next}>{step===slayQuestions.length-1?'REVEAL MY RESULTS':'NEXT QUESTION'} <ArrowRight size={18}/></button></motion.div>}
        </motion.div>}
        {phase === 'scan' && <motion.div key="scan" initial={{opacity:0}} animate={{opacity:1}} className="slay-scanning" role="status"><span className="slay-scan-icon">✳</span><h2>SCANNING<br/><em>NINA.EXE</em></h2><p>Анализируем уровень легендарности... Система слегка перегрелась.</p><div className="slay-progress"><span/></div><span className="slay-loading">PLEASE DO NOT DISTURB THE ICON</span></motion.div>}
        {phase === 'result' && <motion.div key="result" initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} className="slay-result"><span className="slay-certified">✦ OFFICIALLY CERTIFIED ✦</span><div className="slay-result-title">NINA IS<br/><em>THE ICON.</em></div><div className="slay-result-number">9999<span>%</span></div><strong>WARNING: TOO ICONIC TO HANDLE</strong><p>По результатам независимого (ну почти) исследования Нина официально признана главной дивой 2026 года. Обжалованию не подлежит.</p><div className="slay-result-buttons"><button className="slay-primary" onClick={onCelebrate}>MORE CONFETTI ✦</button><button className="slay-secondary" onClick={restart}>TAKE THE TEST AGAIN ↺</button></div></motion.div>}
      </div>
      <div className="slay-side"><span className="slay-deco-star">✦</span><div className={`slay-disc-new ${phase==='scan'?'is-scanning':''}`}><span>NINA</span><b>★</b><span>{phase==='result'?'CERTIFIED ICON':'SUPERSTAR'}</span></div><span className="slay-side-sticker">
  {phase === 'result' ? (
    <>IT GIRL<br />FOREVER</>
  ) : (
    <>IT GIRL<br />ENERGY ONLY</>
  )}
</span><div className="slay-side-bottom">{phase==='questions'?`QUESTION ${step+1} OF 5`:phase==='scan'?'PROCESSING...':phase==='result'?`5/5 QUESTIONS COMPLETED`:'EST. 2000-SOMETHING'}<span>★</span></div></div>
    </div>
  </section>
}

function App() {
  const [boot, setBoot] = useState(true)
  const [selected, setSelected] = useState<number | null>(null)
  const [letter, setLetter] = useState(false)
  const [confettiRun, setConfettiRun] = useState(0)
  const [music, setMusic] = useState(false)
  const [musicError, setMusicError] = useState(false)
  const audio = useRef<HTMLAudioElement>(null)
  const celebrate = () => setConfettiRun(v => v + 1)
  useEffect(() => { if (!boot) celebrate() }, [boot])
  useEffect(() => { if (!audio.current) return; if (music) audio.current.play().catch(() => { setMusic(false); setMusicError(true) }); else audio.current.pause() }, [music])
  useEffect(() => { const close = (e: KeyboardEvent) => { if (e.key === 'Escape') { setLetter(false); setSelected(null) } }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close) }, [])
  const memory = selected === null ? null : memories[selected]
  return <>
    <audio ref={audio} src="/music.mp3" loop preload="none" />
    <Confetti run={confettiRun} />
    <AnimatePresence>{boot && <motion.div className="boot" exit={{ y: '-110%', transition: { duration: .7, ease: [.76,0,.24,1] } }}>
      <div className="boot-bg-text">NINA NINA NINA</div><div className="boot-top">✦ PRIVATE BIRTHDAY BROADCAST <span>EST. 2000-SOMETHING</span></div>
      <motion.div className="boot-center" initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} transition={{duration:.65}}><span className="boot-spark">✳</span><p>YOU'VE GOT A NEW MESSAGE!</p><h1>HEY, <em>NINA!</em></h1><div className="boot-sub">YOUR BIRTHDAY ERA HAS OFFICIALLY STARTED</div><button onClick={() => setBoot(false)}>ENTER YOUR ERA <ArrowRight size={19}/></button><span className="boot-mini">best viewed with maximum attitude ♡</span></motion.div>
      <div className="boot-bottom">2000s INTERNET ENERGY © <span>100% THAT GIRL</span></div>
    </motion.div>}</AnimatePresence>
    <header className="topbar"><a href="#home" className="brand">NINA<span>★</span>WORLD <sup>©</sup></a><nav><a href="#cover">COVER</a><a href="#memories">THE LORE</a><a href="#awards">AWARDS</a><a href="#letter">LOVE NOTE</a></nav><button className="music-toggle" onClick={() => { setMusicError(false);setMusic(v=>!v) }} title="Музыка: добавь public/music.mp3">{music ? <Volume2 size={16}/> : <VolumeX size={16}/>} <span>SOUND {music ? 'ON' : 'OFF'}</span></button></header>
    {musicError && <div className="audio-warning">Для музыки добавь файл public/music.mp3 <button onClick={()=>setMusicError(false)} aria-label="Закрыть">×</button></div>}
    <div className="ticker" aria-label="С днем рождения Нина"><div>★ BREAKING NEWS: IT'S NINA'S BIRTHDAY ★ MAIN CHARACTER ALERT ★ TOO GLAM TO GIVE A DAMN ★ BREAKING NEWS: IT'S NINA'S BIRTHDAY ★ MAIN CHARACTER ALERT ★ TOO GLAM TO GIVE A DAMN ★</div></div>
    <main id="home">
      <section id="cover" className="cover"><div className="cover-noise"/><div className="cover-header"><span>THE INTERNET'S FAVORITE GIRL</span><span>ISSUE NO. 001 / BIRTHDAY SPECIAL</span></div>
        <div className="cover-inner"><div className="cover-copy"><div className="cover-kicker">✦ EXCLUSIVE BIRTHDAY EDITION ✦</div><p className="hey">it's your day, babe!</p><h1>HAPPY<br/><span>BIRTH</span>DAY<span className="cover-star">✷</span><br/><i>NINA!</i></h1><div className="cover-bottom"><span>ICON STATUS:<br/><strong>PERMANENT.</strong></span><a href="#memories" className="cover-cta">EXPLORE THE ISSUE <ArrowDownRight size={21}/></a></div></div>
        <div className="cover-visual"><div className="silver-orbit orbit-one"/><div className="silver-orbit orbit-two"/><div className="chrome-star big-star">✦</div><div className="cover-photo-shell"><div className="cover-photo"><Photo src="/photos/1.jpg" label="Фото Нины для обложки"/></div><span className="photo-label">NINA — THE ONE & ONLY</span></div><div className="sticker sticker-round">100%<br/>ICONIC</div><div className="sticker sticker-slay">SLAY<br/>ALL DAY!</div><div className="tiny-spark spark-a">✧</div><div className="tiny-spark spark-b">✳</div></div></div>
        <div className="cover-footer"><span>NO. 01 — THE BIRTHDAY ISSUE</span><span>SCROLL TO UNLOCK THE LORE ↓</span><span>PRICE: PRICELESS</span></div></section>
      <section className="manifesto"><div className="manifesto-top">DEAR INTERNET, PLEASE BE ADVISED...</div><p>сегодня весь мир<br/>официально <span>крутится</span><br/>вокруг <em>НИНЫ.</em></p><div className="manifesto-spark">✷</div><div className="manifesto-foot">NO QUESTIONS. NO DISCUSSIONS. JUST FACTS.</div></section>
      <section id="memories" className="lore section-pad"><div className="section-index"><span>CHAPTER 01 — THE LORE</span><span>SCROLL FOR THE RECEIPTS ↓</span></div><div className="section-intro"><div><div className="eyebrow">INTERNET EXCLUSIVE</div><h2>THE <i>ICONIC</i><br/>ARCHIVES<span>✳</span></h2></div><p>Каждая легенда имеет свою историю. У нашей — много фотографий, сомнительных решений и абсолютно лучших моментов.</p></div><div className="photo-grid">{memories.map((m,i)=><motion.button className={`photo-card card-${i}`} key={i} initial={{opacity:0,y:50,rotate:-3}} whileInView={{opacity:1,y:0,rotate:0}} viewport={{once:true,amount:.1}} transition={{delay:i*.09,duration:.5}} whileHover={{y:-12,rotate:i%2?3:-3}} onClick={()=>setSelected(i)}><div className="photo-window" style={{background:m.color}}><Photo src={m.image} label={m.label}/></div><div className="polaroid-writing"><span>{m.title}</span><b>{m.emoji}</b></div><div className="photo-card-tag">CLICK TO UNLOCK ↗</div></motion.button>)}</div><p className="lore-footnote">* некоторые истории могут быть использованы против нас, но мы всё отрицаем.</p></section>
      <SlayDetector onCelebrate={celebrate} />
      <section id="awards" className="awards section-pad"><div className="section-index"><span>CHAPTER 02 — HALL OF FAME</span><span>ABSOLUTELY UNBIASED AWARDS</span></div><div className="section-intro"><div><div className="eyebrow">THE ANNUAL NINA AWARDS</div><h2>AND THE<br/>WINNER IS...<i>NINA!</i></h2></div><p>Церемония награждения человека, который заслуживает все номинации сразу.</p></div><div className="awards-grid">{awards.map((a,i)=><motion.div className="award-card" key={a.name} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.13}}><span className="award-num">0{i+1} / 03</span><span className="award-icon">{a.icon}</span><h3>{a.name}</h3><p>{a.detail}</p><span className="award-stamp">OFFICIALLY<br/>CERTIFIED</span></motion.div>)}</div></section>
      <section id="letter" className="final-letter"><div className="letter-stars">✦ ✧ ✦</div><div className="letter-left"><span className="eyebrow">ONE LAST THING / TOP SECRET</span><h2>OKAY, NOW<br/><i>FOR REAL.</i></h2><p>Мемы мемами, но есть кое-что, что хочется сказать тебе совершенно серьёзно. Почти.</p><button className="letter-button" onClick={()=>setLetter(true)}>OPEN YOUR LOVE NOTE <Heart size={19}/></button><small>WARNING: MAY CAUSE HAPPY TEARS ♡</small></div><button className="letter-right" onClick={()=>setLetter(true)} aria-label="Открыть письмо"><div className="envelope-paper">TO: NINA<br/><strong>WITH LOVE ♡</strong></div><div className="env-flap"/><div className="env-body"/><div className="env-heart">♡</div><span>CLICK TO OPEN ↗</span></button></section>
      <footer><div className="footer-main">STAY<br/><i>ICONIC,</i><br/>NINA<span>★</span></div><div className="footer-bottom"><span>HAPPY BIRTHDAY, SUPERSTAR. NEVER CHANGE.</span><button onClick={celebrate}>MORE CONFETTI PLEASE ✦</button><span>MADE WITH ♡ / {config.from}</span></div></footer>
    </main>
    <AnimatePresence>{memory && <motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setSelected(null)}><motion.div className="memory-dialog" role="dialog" aria-modal="true" aria-label={memory.title} initial={{scale:.87,y:30}} animate={{scale:1,y:0}} exit={{scale:.94,y:20}} onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setSelected(null)} aria-label="Закрыть"><X/></button><div className="dialog-image" style={{background:memory.color}}><Photo src={memory.image} label={memory.label}/></div><div className="dialog-content"><span>FROM THE NINA ARCHIVES / VOL. 0{(selected ?? 0)+1}</span><h2>{memory.title}</h2><h3>{memory.label}</h3><p>{memory.text}</p><div className="dialog-nav"><button onClick={()=>setSelected(i=>(i===null?0:(i+memories.length-1)%memories.length))}><ArrowLeft size={20}/></button><b>{(selected??0)+1} / {memories.length}</b><button onClick={()=>setSelected(i=>(i===null?0:(i+1)%memories.length))}><ArrowRight size={20}/></button></div></div></motion.div></motion.div>}</AnimatePresence>
    <AnimatePresence>{letter && <motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setLetter(false)}><motion.div className="letter-dialog" role="dialog" aria-modal="true" aria-label="Письмо Нине" initial={{y:60,opacity:0,rotate:-3}} animate={{y:0,opacity:1,rotate:0}} exit={{y:30,opacity:0}} onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setLetter(false)} aria-label="Закрыть"><X/></button><div className="dialog-letter-head">PRIVATE MESSAGE <span>♡ SEALED WITH LOVE</span></div><h2>DEAR NINA, <span>♡</span></h2>{config.letter.map((p,i)=><p key={i}>{p}</p>)}<div className="letter-signature">xoxo, {config.from}</div><button className="button-dark" onClick={()=>{setLetter(false);celebrate()}}><Music2 size={17}/> LOVE YOU, ICON <Heart size={17}/></button></motion.div></motion.div>}</AnimatePresence>
  </>
}
export default App
