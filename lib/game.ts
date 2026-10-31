import { byId, questions, tracks } from "./content";
import type { Track } from "./content";
export type Run = {
  mode: "lesson" | "daily" | "review";
  track: Track | null;
  day: string;
  ids: string[];
  answers: number[];
  feedback: boolean;
};
export type State = {
  version: 1;
  best: Partial<Record<Track, number>>;
  mastered: string[];
  mistakes: string[];
  days: string[];
  daily: string[];
  attempts: number;
  correct: number;
  run: Run | null;
};
export const fresh = (): State => ({
  version: 1,
  best: {},
  mastered: [],
  mistakes: [],
  days: [],
  daily: [],
  attempts: 0,
  correct: 0,
  run: null,
});
export const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
export function validDay(s: unknown): s is string {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T12:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}
const previousDay = (s: string) => {
  const d = new Date(`${s}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
};
export function streak(days: string[], today: string) {
  if (!validDay(today)) return 0;
  const set = new Set(days);
  let cursor = set.has(today) ? today : previousDay(today),
    count = 0;
  while (set.has(cursor)) {
    count++;
    cursor = previousDay(cursor);
  }
  return count;
}
export function dailyIds(day: string) {
  let seed = [...day].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
  const list = questions.map((q) => q.id);
  for (let i = list.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list.slice(0, 5);
}
export function start(
  s: State,
  mode: Run["mode"],
  day: string,
  track: Track | null = null,
): State {
  if (s.run || !validDay(day)) return s;
  const ids =
    mode === "daily"
      ? dailyIds(day)
      : mode === "review"
        ? [...s.mistakes]
        : questions.filter((q) => q.track === track).map((q) => q.id);
  if (!ids.length) return s;
  return {
    ...s,
    run: {
      mode,
      track: mode === "lesson" ? track : null,
      day,
      ids,
      answers: [],
      feedback: false,
    },
  };
}
export const current = (r: Run) =>
  byId[r.ids[r.answers.length - (r.feedback ? 1 : 0)]];
export function answer(s: State, choice: number): State {
  const r = s.run;
  if (
    !r ||
    r.feedback ||
    r.answers.length >= r.ids.length ||
    !Number.isInteger(choice) ||
    choice < 0 ||
    choice > 3
  )
    return s;
  const q = current(r),
    correct = choice === q.correct;
  return {
    ...s,
    mastered: correct ? [...new Set([...s.mastered, q.id])] : s.mastered,
    mistakes: correct
      ? s.mistakes.filter((id) => id !== q.id)
      : [...new Set([...s.mistakes, q.id])],
    attempts: s.attempts + 1,
    correct: s.correct + (correct ? 1 : 0),
    run: { ...r, answers: [...r.answers, choice], feedback: true },
  };
}
export const score = (r: Run) =>
  r.answers.reduce((n, a, i) => n + (a === byId[r.ids[i]].correct ? 1 : 0), 0);
export function next(s: State): State {
  if (!s.run?.feedback || s.run.answers.length === s.run.ids.length) return s;
  return { ...s, run: { ...s.run, feedback: false } };
}
export function finish(s: State, day: string): State {
  const r = s.run;
  if (!r || !r.feedback || r.answers.length !== r.ids.length || !validDay(day))
    return s;
  const best = { ...s.best };
  if (r.mode === "lesson" && r.track)
    best[r.track] = Math.max(best[r.track] ?? 0, score(r));
  return {
    ...s,
    best,
    days: [...new Set([...s.days, day])].sort().slice(-400),
    daily:
      r.mode === "daily"
        ? [...new Set([...s.daily, r.day])].sort().slice(-400)
        : s.daily,
    run: null,
  };
}
const uniqueStrings = (
  v: unknown,
  valid: (id: string) => boolean,
  max: number,
): v is string[] =>
  Array.isArray(v) &&
  v.length <= max &&
  v.every((id) => typeof id === "string" && valid(id)) &&
  new Set(v).size === v.length;
export function parseState(raw: string | null): State | null {
  try {
    if (!raw || raw.length > 60000) return null;
    const s = JSON.parse(raw) as State;
    if (
      s.version !== 1 ||
      !s.best ||
      typeof s.best !== "object" ||
      Array.isArray(s.best) ||
      Object.entries(s.best).some(
        ([id, n]) =>
          !tracks.some((t) => t.id === id) ||
          !Number.isInteger(n) ||
          (n as number) < 0 ||
          (n as number) > 4,
      ) ||
      !uniqueStrings(s.mastered, (id) => Object.hasOwn(byId, id), 24) ||
      !uniqueStrings(s.mistakes, (id) => Object.hasOwn(byId, id), 24) ||
      !uniqueStrings(s.days, validDay, 400) ||
      !uniqueStrings(s.daily, validDay, 400) ||
      !Number.isSafeInteger(s.attempts) ||
      s.attempts < 0 ||
      s.attempts > 1000000 ||
      !Number.isSafeInteger(s.correct) ||
      s.correct < 0 ||
      s.correct > s.attempts
    )
      return null;
    if (s.run !== null) {
      const r = s.run;
      if (
        !r ||
        !["lesson", "daily", "review"].includes(r.mode) ||
        !validDay(r.day) ||
        !uniqueStrings(r.ids, (id) => Object.hasOwn(byId, id), 24) ||
        !r.ids.length ||
        !Array.isArray(r.answers) ||
        r.answers.length > r.ids.length ||
        r.answers.some((n) => !Number.isInteger(n) || n < 0 || n > 3) ||
        typeof r.feedback !== "boolean" ||
        (r.feedback && !r.answers.length) ||
        (!r.feedback && r.answers.length === r.ids.length)
      )
        return null;
      if (r.mode === "lesson") {
        if (
          !tracks.some((t) => t.id === r.track) ||
          JSON.stringify(r.ids) !==
            JSON.stringify(
              questions.filter((q) => q.track === r.track).map((q) => q.id),
            )
        )
          return null;
      } else if (r.track !== null) return null;
      if (
        r.mode === "daily" &&
        JSON.stringify(r.ids) !== JSON.stringify(dailyIds(r.day))
      )
        return null;
    }
    return s;
  } catch {
    return null;
  }
}
export function progressText(s: State) {
  return `CODEPOP · Progresso local\n${s.mastered.length * 10} XP de domínio\n${s.attempts} respostas · ${s.correct} acertos\n\nTRILHA\n${tracks.map((t) => `${t.tag}: ${s.best[t.id] === undefined ? "Ainda não concluída" : `${s.best[t.id]}/4 na melhor rodada`}`).join("\n")}\n\nPARA REVISAR\n${s.mistakes.map((id) => byId[id].title).join("\n") || "Nenhum erro pendente."}\n\nSem conta, ranking ou sincronização.\nhttps://gustapaz.github.io/codepop/`;
}
