// pokebuddy 웹 데이터 만들기 — pokebuddy 저장소 data/*.json 에서 웹 쪽에 필요한 값만 골라 src/pokebuddy/data/*.generated.ts 로
// - 기술 목록(moves) · AI 트레이너 샘플 파티(battle-samples) · 패치노트(patch-notes) + 패치노트 그림 · 배틀 인기 순위
// - 인기 순위: 사용자가 주마다 운영 DB 에서 뽑아 _reference/battle-stats/YYYY-MM-DD.json 으로 저장 → 가장 최근 파일만 씀 (집계값만, 개인 정보 없음)
// - 원본을 고치지 않는다. 자동 연동 없음 — npm run sync:pokebuddy 로 설명서와 함께 손으로 다시 만든다
// - 패치노트 그림은 웹 전용: _reference/captures/patch/manifest.json(공개 저장소 밖) → public/pokebuddy/patch-notes/
// - 새 패키지 없이 node 기본 모듈만 쓴다
// 실행: node scripts/build-pokebuddy-data.cjs [pokebuddy 저장소 경로, 기본 ../2.pokebuddy/pokebuddy]
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.resolve(ROOT, process.argv[2] || '../2.pokebuddy/pokebuddy');
const OUT = path.join(ROOT, 'src', 'pokebuddy', 'data');
const PATCH_CAPTURES = path.join(ROOT, '_reference', 'captures', 'patch');
const PATCH_IMAGES = path.join(ROOT, 'public', 'pokebuddy', 'patch-notes');
const PATCH_IMAGE_URL = '/pokebuddy/patch-notes/';
const BATTLE_STATS = path.join(ROOT, '_reference', 'battle-stats');

const read = (name) => JSON.parse(fs.readFileSync(path.join(SOURCE, 'data', name), 'utf8'));
// _comment 같은 설명 키는 뺌
const entries = (obj) => Object.entries(obj).filter(([key]) => !key.startsWith('_'));

const moves = read('moves.json');
const moveText = read('move-text.ko.json');
const speciesMoves = read('species-moves.json');
const megaMoves = read('mega-moves.json');
const names = read('names.json');
const species = read('species.defaults.json');
const dex = read('dex.json');
const mega = read('mega.json').forms;
const megaBattle = read('mega-battle.json');
const speciesAbilities = read('species-abilities.json');
const samples = read('battle-samples.json').samples;
const patchNotes = read('patch-notes.json').notes;

// 효과 문장 — 규칙 문서 pokebuddy docs/specs/moves.md 의 effects 표를 사람 말로
const STAT_KO = { atk: '공격', def: '방어', spa: '특수공격', spd: '특수방어', spe: '스피드' };
const STATUS_KO = { paralysis: '마비', burn: '화상', poison: '독', toxic: '맹독', sleep: '잠듦', freeze: '얼음', confusion: '혼란' };
const unknown = new Set();
const ko = (table, key) => {
  if (!table[key]) unknown.add(key);
  return table[key] ?? key;
};

function effectText(effects = {}) {
  const parts = [];
  // 대상·확률·변화량이 같은 능력 변화는 한 마디로 — "자신 방어·특수방어 1단계 내림"
  const statGroups = new Map();
  for (const s of effects.stats ?? []) {
    const key = `${s.who}|${s.chance}|${s.change}`;
    if (!statGroups.has(key)) statGroups.set(key, { ...s, stats: [] });
    statGroups.get(key).stats.push(ko(STAT_KO, s.stat));
  }
  for (const s of statGroups.values()) {
    const who = s.who === 'self' ? '자신' : '상대';
    const dir = s.change > 0 ? '올림' : '내림';
    const chance = s.chance < 100 ? `${s.chance}% 확률로 ` : '';
    parts.push(`${chance}${who} ${s.stats.join('·')} ${Math.abs(s.change)}단계 ${dir}`);
  }
  if (effects.status) {
    const kinds = [].concat(effects.status.kind).map((kind) => ko(STATUS_KO, kind)).join('·');
    parts.push(`${effects.status.chance}% 확률로 ${kinds}`);
  }
  if (effects.flinch) parts.push(`${effects.flinch}% 확률로 풀죽음`);
  if (effects.drain) parts.push(`준 피해의 ${effects.drain}% 회복`);
  if (effects.recoil) parts.push(`준 피해의 ${effects.recoil}% 반동`);
  if (effects.crit === 'high') parts.push('급소에 잘 맞음');
  if (effects.crit === 'always') parts.push('반드시 급소');
  if (effects.charge) parts.push('모은 뒤 공격');
  if (effects.recharge) parts.push('쓴 뒤 쉼');
  if (effects.halfHp) parts.push('자기 HP 절반을 씀');
  if (effects.hpScale) parts.push('HP 에 따라 위력이 바뀜');
  if (effects.rampage) parts.push('난동');
  return parts.join(' · ');
}

// 기술마다 쓰는 종 수 — 기본 기술(moves) · 후보(candidates) · 메가 모습
const users = {};
const count = (moveId, key) => {
  users[moveId] ??= { base: 0, candidate: 0, mega: 0 };
  users[moveId][key] += 1;
};
const moveIdOf = (slot) => (typeof slot === 'string' ? slot : slot.id ?? slot.move);
for (const [, entry] of entries(speciesMoves)) {
  for (const slot of entry.moves ?? []) count(moveIdOf(slot), 'base');
  for (const slot of entry.candidates ?? []) count(moveIdOf(slot), 'candidate');
}
for (const [, entry] of entries(megaMoves)) {
  for (const slot of [...(entry.moves ?? []), ...(entry.candidates ?? [])]) count(moveIdOf(slot), 'mega');
}

const moveList = entries(moves).map(([id, m]) => ({
  id,
  ko: m.ko,
  en: m.en,
  type: m.type,
  class: m.class,
  power: m.power ?? null,
  hits: m.hits ?? null,
  accuracy: m.accuracy ?? null,
  cooldown: m.cooldown ?? null,
  priority: m.priority ?? 0,
  contact: (m.traits ?? []).includes('contact'),
  effect: effectText(m.effects),
  text: moveText[id] ?? '',
  users: users[id] ?? { base: 0, candidate: 0, mega: 0 },
}));

// 포켓몬 한 칸 — 이름·그림 번호·타입. form 이 메가·원시회귀면 mega.json 값
function pokemonOf(slot) {
  const form = slot.form && mega[slot.form];
  if (form) return { id: slot.form, ko: form.ko, pokemonId: form.pokemonId, types: form.types };
  const sp = species[slot.species];
  if (!sp || !names[slot.species]) throw new Error(`종 없음: ${slot.species}`);
  return { id: slot.species, ko: names[slot.species].ko, pokemonId: dex[slot.species], types: sp.types };
}

// 날씨를 부르는 특성 — pokebuddy src/battle/engine.ts WEATHER_ABILITY 와 같은 짝 (날씨 없음 특성은 뺌)
const WEATHER_ABILITY = {
  drought: 'sun',
  'orichalcum-pulse': 'sun',
  'desolate-land': 'sun',
  drizzle: 'rain',
  'primordial-sea': 'rain',
  'sand-stream': 'sand',
  'sand-spit': 'sand',
  'snow-warning': 'snow',
};

const abilityOf = (slot) => (slot.form && megaBattle[slot.form]?.ability) || speciesAbilities[slot.species];

// 파티 주제 — 한 타입 파티는 가장 많은 타입, 날씨 파티는 가장 많은 날씨 특성의 날씨
function themeOf(sample, party) {
  const top = (values) => {
    const counts = new Map();
    for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  };
  if (sample.kind === 'type-concept') return top(party.flatMap((pokemon) => pokemon.types));
  if (sample.kind === 'weather') {
    const weather = top(sample.slots.map((slot) => WEATHER_ABILITY[abilityOf(slot)]).filter(Boolean));
    if (!weather) throw new Error(`날씨 특성 없는 날씨 파티: ${sample.id}`);
    return weather;
  }
  return null;
}

const trainers = samples.map((sample) => {
  const party = sample.slots.map(pokemonOf);
  return { id: sample.id, level: sample.level, name: sample.name, kind: sample.kind, theme: themeOf(sample, party), party };
});

// 패치노트 그림 — manifest 가 있을 때만. 없으면 글만
let patchImages = [];
const manifestPath = path.join(PATCH_CAPTURES, 'manifest.json');
fs.rmSync(PATCH_IMAGES, { recursive: true, force: true });
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  patchImages = manifest.map((item) => {
    const from = path.join(PATCH_CAPTURES, item.file);
    if (!fs.existsSync(from)) throw new Error(`패치노트 그림 없음: ${item.file}`);
    const to = path.join(PATCH_IMAGES, item.file);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
    return { version: item.version, line: item.line, src: `${PATCH_IMAGE_URL}${item.file}`, alt: item.alt, width: item.width, height: item.height, now: Boolean(item.now) };
  });
}

const patches = patchNotes.map((note) => ({
  version: note.version,
  date: note.date,
  lines: note.lines,
  images: patchImages.filter((image) => image.version === note.version),
}));

// 배틀 인기 순위 — 가장 최근 주간 파일. 없으면 null (도감에서 탭을 숨김)
let popular = null;
const statFiles = fs.existsSync(BATTLE_STATS) ? fs.readdirSync(BATTLE_STATS).filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/.test(name)).sort() : [];
if (statFiles.length) {
  const stats = JSON.parse(fs.readFileSync(path.join(BATTLE_STATS, statFiles[statFiles.length - 1]), 'utf8'));
  popular = {
    from: stats.from,
    to: stats.to,
    battles: stats.battles,
    pokemon: stats.pokemon
      .map((row) => ({ ...pokemonOf({ species: row.species, form: row.form ?? undefined }), uses: row.uses, wins: row.wins, losses: row.losses, draws: row.draws ?? 0 }))
      .sort((a, b) => b.uses - a.uses),
  };
}

const HEAD = '// 만든 파일 — 고치지 말 것. 원본은 pokebuddy 저장소 data/*.json, 만드는 곳은 scripts/build-pokebuddy-data.cjs (npm run sync:pokebuddy)\n';
const write = (file, typeImport, body) => {
  fs.writeFileSync(path.join(OUT, file), `${HEAD}${typeImport}\n\n${body}\n`);
};

fs.mkdirSync(OUT, { recursive: true });
write('moves.generated.ts', "import type { MoveInfo } from './dataTypes';", `export const MOVES: MoveInfo[] = ${JSON.stringify(moveList)};`);
write('trainers.generated.ts', "import type { TrainerInfo } from './dataTypes';", `export const TRAINERS: TrainerInfo[] = ${JSON.stringify(trainers, null, 1)};`);
write('popular.generated.ts', "import type { PopularStats } from './dataTypes';", `export const POPULAR: PopularStats | null = ${JSON.stringify(popular, null, 1)};`);
write('patchNotes.generated.ts', "import type { PatchNote } from './dataTypes';", `export const PATCH_NOTES: PatchNote[] = ${JSON.stringify(patches, null, 1)};`);

if (unknown.size) process.stdout.write(`한국어 이름 없는 효과 키: ${[...unknown].join(', ')}\n`);
process.stdout.write(`웹 데이터: 기술 ${moveList.length}개 · AI 트레이너 ${trainers.length}팀 · 패치노트 ${patches.length}개(그림 ${patchImages.length}장) · 인기 순위 ${popular ? `${popular.from}~${popular.to}` : '없음'}\n`);
