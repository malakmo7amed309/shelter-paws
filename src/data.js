// Demo listings. Names, shelters and bios are fictional; cities are real Egyptian cities.
export const PETS = [
  { id: 1, name: 'Bosbos', ar: 'بسبس', species: 'cat', age: 'adult', size: 'small', city: 'Cairo', shelter: 'Maadi Whisker House', coat: '#f4a259', energy: 2, kids: true, otherPets: true, alone: 4, space: 1, exp: 1, bio: 'Ginger lap cat. Purrs the second you sit down and ignores the vacuum entirely.' },
  { id: 2, name: 'Zaytoona', ar: 'زيتونة', species: 'cat', age: 'young', size: 'small', city: 'Giza', shelter: 'Pyramids Paw Rescue', coat: '#4b4453', energy: 4, kids: true, otherPets: true, alone: 3, space: 1, exp: 1, bio: 'Black kitten with olive-green eyes. Will climb your curtains, and your heart.' },
  { id: 3, name: 'Basha', ar: 'باشا', species: 'dog', age: 'adult', size: 'large', city: 'Alexandria', shelter: 'Corniche Dog Haven', coat: '#c98b4e', energy: 4, kids: true, otherPets: false, alone: 2, space: 3, exp: 2, bio: 'Golden baladi mix who walks the Corniche like he owns it. Needs a daily long walk.' },
  { id: 4, name: 'Loz', ar: 'لوز', species: 'dog', age: 'young', size: 'medium', city: 'Cairo', shelter: 'Maadi Whisker House', coat: '#e8d3b0', energy: 5, kids: true, otherPets: true, alone: 1, space: 2, exp: 2, bio: 'Almond-colored puppy energy in a medium body. Great with kids, hates being left alone.' },
  { id: 5, name: 'Sukkar', ar: 'سكر', species: 'rabbit', age: 'young', size: 'small', city: 'Mansoura', shelter: 'Delta Small Friends', coat: '#f1ece4', energy: 3, kids: true, otherPets: true, alone: 4, space: 1, exp: 1, bio: 'Sweet and calm. Thumps when she wants parsley. Happy in an apartment with a pen.' },
  { id: 6, name: 'Fouda', ar: 'فودة', species: 'dog', age: 'senior', size: 'medium', city: 'Fayoum', shelter: 'Qarun Lake Strays', coat: '#8a6a4f', energy: 1, kids: true, otherPets: true, alone: 4, space: 1, exp: 1, bio: 'Gentle senior who prefers a slow walk and a warm spot by the door. Calm in any size home.' },
  { id: 7, name: 'Mishmish', ar: 'مشمش', species: 'cat', age: 'senior', size: 'small', city: 'Alexandria', shelter: 'Corniche Dog Haven', coat: '#e9a66b', energy: 1, kids: false, otherPets: true, alone: 5, space: 1, exp: 1, bio: 'Apricot-colored grandma cat. Wants quiet, a window and one person to adore.' },
  { id: 8, name: 'Rex', ar: 'ريكس', species: 'dog', age: 'adult', size: 'large', city: 'Giza', shelter: 'Pyramids Paw Rescue', coat: '#3f3a36', energy: 5, kids: false, otherPets: false, alone: 2, space: 3, exp: 3, bio: 'Strong, smart, high-drive. Best with an experienced owner and a garden or rooftop routine.' },
  { id: 9, name: 'Qarfa', ar: 'قرفة', species: 'cat', age: 'adult', size: 'small', city: 'Fayoum', shelter: 'Qarun Lake Strays', coat: '#b8793f', energy: 3, kids: true, otherPets: false, alone: 4, space: 1, exp: 1, bio: 'Cinnamon tabby, independent but affectionate at dinner time. Wants to be the only cat.' },
  { id: 10, name: 'Tamr', ar: 'تمر', species: 'dog', age: 'adult', size: 'medium', city: 'Mansoura', shelter: 'Delta Small Friends', coat: '#6b4a34', energy: 3, kids: true, otherPets: true, alone: 3, space: 2, exp: 1, bio: 'Date-brown, easygoing and quick to learn. A good first dog for a family.' },
  { id: 11, name: 'Nunu', ar: 'نونو', species: 'rabbit', age: 'adult', size: 'small', city: 'Cairo', shelter: 'Maadi Whisker House', coat: '#b9b3ac', energy: 2, kids: false, otherPets: true, alone: 5, space: 1, exp: 2, bio: 'Quiet grey bun. Dislikes being picked up, loves being left to explore a room.' },
  { id: 12, name: 'Shams', ar: 'شمس', species: 'cat', age: 'young', size: 'small', city: 'Alexandria', shelter: 'Corniche Dog Haven', coat: '#ffc857', energy: 5, kids: true, otherPets: true, alone: 2, space: 2, exp: 1, bio: 'Sunshine-yellow kitten with zoomies at 3 a.m. Ideal with a second playful pet.' },
]

export const QUIZ = [
  { id: 'space', q: 'Where will your pet live?', opts: [['1', 'Apartment, no garden'], ['2', 'Apartment with a roof or balcony'], ['3', 'House with a garden']] },
  { id: 'alone', q: 'How long will it be alone on a normal day?', opts: [['1', 'Hardly ever'], ['3', 'Around 4 hours'], ['5', '8 hours or more']] },
  { id: 'exp', q: 'Have you looked after a pet before?', opts: [['1', 'This is my first'], ['2', 'A little'], ['3', 'Yes, comfortable with strong-willed animals']] },
  { id: 'kids', q: 'Who else lives at home?', opts: [['kids', 'Young kids'], ['pets', 'Other pets'], ['none', 'Just adults']] },
]

// Score one pet against quiz answers. Returns percent plus human-readable reasons.
export function match(p, a) {
  let score = 100
  const why = [], warn = []
  const space = +a.space
  if (p.space > space) { score -= 22 * (p.space - space); warn.push('Needs more room than you have') }
  else why.push(p.space === 1 ? 'Happy in a small home' : 'Fits your space')
  const alone = +a.alone
  if (alone > p.alone) { score -= 14 * (alone - p.alone); warn.push(`Better with company (about ${p.alone * 2} hours alone at most)`) }
  else why.push('Fine with your hours away')
  const exp = +a.exp
  if (p.exp > exp) { score -= 20 * (p.exp - exp); warn.push('Needs a more experienced owner') }
  else if (p.exp === 1) why.push('Easygoing for a first-timer')
  if (a.kids === 'kids') { if (!p.kids) { score -= 35; warn.push('Not recommended with young kids') } else why.push('Good with kids') }
  if (a.kids === 'pets') { if (!p.otherPets) { score -= 30; warn.push('Prefers to be the only pet') } else why.push('Gets along with other pets') }
  return { pct: Math.max(8, Math.min(99, Math.round(score))), why: why.slice(0, 3), warn }
}
