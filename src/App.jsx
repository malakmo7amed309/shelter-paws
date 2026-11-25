import React, { useEffect, useMemo, useState } from 'react'
import { PETS, QUIZ, match } from './data.js'

const LS = 'shelter-paws-v1'
const load = () => {
  try { return JSON.parse(localStorage.getItem(LS) || '{}') } catch { return {} }
}

function darker(hex, amt = 0.25) {
  const n = parseInt(hex.slice(1), 16)
  const f = (v) => Math.max(0, Math.round(v * (1 - amt)))
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`
}

// Hand-drawn SVG faces so the site needs no photos.
function PetFace({ pet, size = 160 }) {
  const c = pet.coat, d = darker(c, 0.28)
  const bg = ['#ffe3c7', '#d7f0ec', '#ffe9a8', '#f9d5d3'][pet.id % 4]
  return (
    <svg viewBox="0 0 160 160" width={size} height={size} role="img" aria-label={`${pet.name} the ${pet.species}`}>
      <rect width="160" height="160" fill={bg} />
      <circle cx="80" cy="150" r="70" fill={darker(bg, 0.06)} />
      {pet.species === 'cat' && (<>
        <polygon points="36,60 44,18 72,44" fill={c} /><polygon points="124,60 116,18 88,44" fill={c} />
        <polygon points="45,50 48,29 62,44" fill="#f7b6b6" /><polygon points="115,50 112,29 98,44" fill="#f7b6b6" />
      </>)}
      {pet.species === 'dog' && (<>
        <ellipse cx="38" cy="78" rx="18" ry="34" fill={d} transform="rotate(14 38 78)" />
        <ellipse cx="122" cy="78" rx="18" ry="34" fill={d} transform="rotate(-14 122 78)" />
      </>)}
      {pet.species === 'rabbit' && (<>
        <ellipse cx="60" cy="30" rx="13" ry="38" fill={c} /><ellipse cx="100" cy="30" rx="13" ry="38" fill={c} />
        <ellipse cx="60" cy="32" rx="6" ry="28" fill="#f7b6b6" /><ellipse cx="100" cy="32" rx="6" ry="28" fill="#f7b6b6" />
      </>)}
      <ellipse cx="80" cy="88" rx="46" ry="42" fill={c} />
      {pet.species === 'dog' && <ellipse cx="80" cy="104" rx="26" ry="20" fill="#fff6e9" opacity="0.9" />}
      {pet.species === 'cat' && <ellipse cx="80" cy="102" rx="20" ry="14" fill="#fff6e9" opacity="0.85" />}
      <circle cx="62" cy="82" r="6" fill="#2b1d16" /><circle cx="98" cy="82" r="6" fill="#2b1d16" />
      <circle cx="64" cy="80" r="2" fill="#fff" /><circle cx="100" cy="80" r="2" fill="#fff" />
      <ellipse cx="80" cy="98" rx="6" ry="4.5" fill={pet.species === 'rabbit' ? '#e88c9a' : '#2b1d16'} />
      <path d="M80 102 q-7 9 -14 4 M80 102 q7 9 14 4" stroke="#2b1d16" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {pet.species === 'cat' && <g stroke="#2b1d16" strokeWidth="1.6" strokeLinecap="round">
        <path d="M46 98 h-22 M46 104 l-20 6 M114 98 h22 M114 104 l20 6" />
      </g>}
    </svg>
  )
}

const AGE = { young: 'Young', adult: 'Adult', senior: 'Senior' }
const SIZE = { small: 'Small', medium: 'Medium', large: 'Large' }

function Chip({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition ${active ? 'bg-teal text-white border-teal' : 'border-cocoa/15 bg-white hover:border-teal'}`}>
      {children}
    </button>
  )
}

function Quiz({ answers, setAnswers, onClose }) {
  const [step, setStep] = useState(0)
  const q = QUIZ[step]
  const pick = (v) => {
    const next = { ...answers, [q.id]: v }
    setAnswers(next)
    if (step < QUIZ.length - 1) setStep(step + 1)
    else onClose()
  }
  return (
    <div className="fixed inset-0 z-40 bg-cocoa/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-cream rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-1.5 mb-5">
          {QUIZ.map((_, i) => <span key={i} className={`h-2 flex-1 rounded-full ${i <= step ? 'bg-coral' : 'bg-cocoa/10'}`} />)}
        </div>
        <p className="text-sm font-bold text-teal">Question {step + 1} of {QUIZ.length}</p>
        <h2 className="text-3xl font-extrabold leading-tight mt-1 mb-5">{q.q}</h2>
        <div className="space-y-2.5">
          {q.opts.map(([v, label]) => (
            <button key={v} onClick={() => pick(v)} className={`w-full text-left rounded-2xl border-2 px-5 py-3.5 font-semibold transition hover:border-coral hover:bg-white ${answers[q.id] === v ? 'border-coral bg-white' : 'border-cocoa/10 bg-white/60'}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-5 text-sm">
          <button disabled={step === 0} onClick={() => setStep(step - 1)} className="font-semibold text-cocoa/60 disabled:opacity-30">Back</button>
          <button onClick={onClose} className="font-semibold text-cocoa/60">Close</button>
        </div>
      </div>
    </div>
  )
}

function Modal({ pet, m, onClose, faved, toggleFav, onSent }) {
  const [form, setForm] = useState({ name: '', phone: '', note: '' })
  const [err, setErr] = useState('')
  const [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (form.name.trim().length < 2) return setErr('Please add your name.')
    if (!/^\+?[0-9 ]{9,15}$/.test(form.phone.trim())) return setErr('Enter a phone number, like 0100 123 4567.')
    setErr('')
    onSent({ petId: pet.id, ...form, at: new Date().toISOString() })
    setSent(true)
  }
  return (
    <div className="fixed inset-0 z-40 bg-cocoa/60 flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
      <div className="bg-cream w-full md:max-w-3xl md:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="relative min-w-0 self-start [&>svg]:w-full [&>svg]:h-auto"><PetFace pet={pet} size={420} /><button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 h-10 w-10 rounded-full bg-white/90 font-bold text-xl">×</button></div>
          <div className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-4xl font-extrabold leading-none">{pet.name} <span className="text-coral">{pet.ar}</span></h2>
                <p className="text-sm font-semibold text-cocoa/60 mt-1.5">{AGE[pet.age]} {pet.species} · {SIZE[pet.size]} · {pet.city}</p>
              </div>
              <button onClick={() => toggleFav(pet.id)} className={`shrink-0 rounded-full border-2 px-3 py-1.5 text-sm font-bold ${faved ? 'bg-coral text-white border-coral' : 'border-cocoa/15 bg-white'}`}>{faved ? '♥ Saved' : '♡ Save'}</button>
            </div>
            <p className="mt-3 leading-relaxed">{pet.bio}</p>
            <p className="text-xs font-semibold text-cocoa/50 mt-1">Cared for by {pet.shelter}</p>
            {m && (
              <div className="mt-4 rounded-2xl bg-teal-l p-3.5">
                <p className="font-extrabold text-teal">{m.pct}% match for you</p>
                <ul className="text-sm mt-1 space-y-0.5">
                  {m.why.map((w) => <li key={w}>✓ {w}</li>)}
                  {m.warn.map((w) => <li key={w} className="text-coral-d font-semibold">! {w}</li>)}
                </ul>
              </div>
            )}
            {sent ? (
              <div className="mt-5 rounded-2xl bg-white p-4 border-2 border-teal">
                <p className="font-extrabold text-teal text-lg">Inquiry sent</p>
                <p className="text-sm mt-1">{pet.shelter} will call {form.name.split(' ')[0]} within two days. This is a demo: nothing leaves your browser.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-5 space-y-2.5" noValidate>
                <p className="font-extrabold">Ask about {pet.name}</p>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="w-full rounded-xl border-2 border-cocoa/10 bg-white px-3.5 py-2.5 outline-none focus:border-teal" />
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone, e.g. 0100 123 4567" inputMode="tel" className="w-full rounded-xl border-2 border-cocoa/10 bg-white px-3.5 py-2.5 outline-none focus:border-teal" />
                <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows={2} placeholder="Tell them about your home (optional)" className="w-full rounded-xl border-2 border-cocoa/10 bg-white px-3.5 py-2.5 outline-none focus:border-teal" />
                {err && <p role="alert" className="text-sm font-semibold text-coral-d">{err}</p>}
                <button className="w-full rounded-full bg-coral hover:bg-coral-d text-white font-extrabold py-3 transition">Send inquiry</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const saved = useMemo(load, [])
  const [species, setSpecies] = useState('all')
  const [city, setCity] = useState('all')
  const [age, setAge] = useState('all')
  const [onlyFav, setOnlyFav] = useState(false)
  const [favs, setFavs] = useState(saved.favs || [])
  const [answers, setAnswers] = useState(saved.answers || {})
  const [inquiries, setInquiries] = useState(saved.inquiries || [])
  const [quizOpen, setQuizOpen] = useState(false)
  const [open, setOpen] = useState(null)

  useEffect(() => { localStorage.setItem(LS, JSON.stringify({ favs, answers, inquiries })) }, [favs, answers, inquiries])

  const answered = QUIZ.every((q) => answers[q.id])
  const cities = [...new Set(PETS.map((p) => p.city))].sort()
  const toggleFav = (id) => setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))

  const list = useMemo(() => {
    let l = PETS.filter((p) => (species === 'all' || p.species === species) && (city === 'all' || p.city === city) && (age === 'all' || p.age === age) && (!onlyFav || favs.includes(p.id)))
    l = l.map((p) => ({ p, m: answered ? match(p, answers) : null }))
    if (answered) l.sort((a, b) => b.m.pct - a.m.pct)
    return l
  }, [species, city, age, onlyFav, favs, answers, answered])

  const openPet = open && PETS.find((p) => p.id === open)
  const openM = openPet && answered ? match(openPet, answers) : null

  return (
    <div className="min-h-screen">
      <header className="max-w-6xl mx-auto px-5 pt-8 pb-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="h-10 w-10 rounded-2xl bg-coral text-white flex items-center justify-center text-xl font-display font-extrabold">P</span>
            <span className="font-display font-extrabold text-2xl">Shelter Paws</span>
          </div>
          <span className="text-sm font-semibold text-cocoa/60">{PETS.length} animals waiting · demo listings</span>
        </div>
        <div className="mt-8 md:mt-12 grid md:grid-cols-[1.3fr_1fr] gap-6 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-[0.95]">Find the one that <span className="text-coral">fits your life.</span></h1>
            <p className="mt-4 text-lg max-w-xl text-cocoa/80">Not every pet suits every home. Answer four quick questions and every animal gets a match score, with the reasons shown, so you adopt for the long run.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={() => setQuizOpen(true)} className="rounded-full bg-coral hover:bg-coral-d text-white font-extrabold px-6 py-3 text-lg transition shadow-lg shadow-coral/30">{answered ? 'Retake the quiz' : 'Find my match'}</button>
              {answered && <button onClick={() => setAnswers({})} className="rounded-full border-2 border-cocoa/15 px-5 py-3 font-bold bg-white">Clear</button>}
            </div>
          </div>
          <div className="hidden md:flex justify-center gap-3">
            {[PETS[1], PETS[3], PETS[4]].map((p, i) => (
              <div key={p.id} className="rounded-3xl overflow-hidden shadow-lg" style={{ transform: `rotate(${(i - 1) * 5}deg) translateY(${i === 1 ? 14 : 0}px)` }}><PetFace pet={p} size={130} /></div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 pb-16">
        <div className="rounded-3xl bg-sun/50 p-4 md:p-5 flex flex-wrap gap-x-6 gap-y-3 items-center">
          <div className="flex flex-wrap gap-2">
            {['all', 'dog', 'cat', 'rabbit'].map((s) => <Chip key={s} active={species === s} onClick={() => setSpecies(s)}>{s === 'all' ? 'All animals' : s[0].toUpperCase() + s.slice(1) + 's'}</Chip>)}
          </div>
          <select value={city} onChange={(e) => setCity(e.target.value)} aria-label="City" className="rounded-full border-2 border-cocoa/15 bg-white px-4 py-1.5 text-sm font-semibold">
            <option value="all">Any city</option>{cities.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={age} onChange={(e) => setAge(e.target.value)} aria-label="Age" className="rounded-full border-2 border-cocoa/15 bg-white px-4 py-1.5 text-sm font-semibold">
            <option value="all">Any age</option><option value="young">Young</option><option value="adult">Adult</option><option value="senior">Senior</option>
          </select>
          <Chip active={onlyFav} onClick={() => setOnlyFav(!onlyFav)}>♥ Saved ({favs.length})</Chip>
        </div>

        {answered && <p className="mt-5 font-bold text-teal">Sorted by best match for you. Tap any card to see why.</p>}

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map(({ p, m }) => (
            <article key={p.id} className="group rounded-3xl bg-white overflow-hidden shadow-sm hover:shadow-xl transition cursor-pointer" onClick={() => setOpen(p.id)}>
              <div className="relative">
                <PetFace pet={p} size={400} />
                <button aria-label={favs.includes(p.id) ? 'Remove from saved' : 'Save'} onClick={(e) => { e.stopPropagation(); toggleFav(p.id) }} className={`absolute top-3 right-3 h-10 w-10 rounded-full text-xl ${favs.includes(p.id) ? 'bg-coral text-white' : 'bg-white/90'}`}>{favs.includes(p.id) ? '♥' : '♡'}</button>
                {m && <span className={`absolute top-3 left-3 rounded-full px-3 py-1 text-sm font-extrabold ${m.pct >= 75 ? 'bg-teal text-white' : m.pct >= 50 ? 'bg-sun' : 'bg-cocoa/80 text-white'}`}>{m.pct}% match</span>}
              </div>
              <div className="p-4">
                <h3 className="text-2xl font-extrabold leading-none">{p.name} <span className="text-coral">{p.ar}</span></h3>
                <p className="text-sm font-semibold text-cocoa/60 mt-1">{AGE[p.age]} {p.species} · {SIZE[p.size]} · {p.city}</p>
                {m ? (
                  <p className="text-sm mt-2 leading-snug">{m.warn[0] ? <span className="text-coral-d font-semibold">! {m.warn[0]}</span> : <span className="text-teal font-semibold">✓ {m.why[0]}</span>}</p>
                ) : (
                  <p className="text-sm mt-2 leading-snug text-cocoa/75 line-clamp-2">{p.bio}</p>
                )}
              </div>
            </article>
          ))}
          {list.length === 0 && <p className="col-span-full text-center py-16 font-semibold text-cocoa/60">No animals match those filters. Try widening them.</p>}
        </div>

        {inquiries.length > 0 && (
          <p className="mt-10 text-sm font-semibold text-cocoa/60">You have sent {inquiries.length} inquir{inquiries.length === 1 ? 'y' : 'ies'} on this device.</p>
        )}
      </main>

      <footer className="border-t-2 border-cocoa/10 py-6 text-center text-xs font-semibold text-cocoa/55 px-4">
        Demo project: listings and shelters are fictional, cities are real. Favorites, quiz answers and inquiries stay in your browser's localStorage.
      </footer>

      {quizOpen && <Quiz answers={answers} setAnswers={setAnswers} onClose={() => setQuizOpen(false)} />}
      {openPet && <Modal pet={openPet} m={openM} faved={favs.includes(openPet.id)} toggleFav={toggleFav} onClose={() => setOpen(null)} onSent={(i) => setInquiries((x) => [...x, i])} />}
    </div>
  )
}
