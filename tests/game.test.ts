import { describe, it, expect } from "vitest";
import { questions, tracks, byId } from "../lib/content";
import {
  fresh,
  start,
  answer,
  next,
  finish,
  current,
  score,
  dailyIds,
  parseState,
  streak,
  validDay,
  progressText,
} from "../lib/game";
import type { State } from "../lib/game";
const day = "2026-10-30";
function complete(s: State, wrong = false) {
  while (s.run && s.run.answers.length < s.run.ids.length) {
    const q = current(s.run);
    s = answer(s, wrong ? (q.correct + 1) % 4 : q.correct);
    if (s.run!.answers.length < s.run!.ids.length) s = next(s);
  }
  return finish(s, day);
}
describe("conteúdo e rodadas", () => {
  it("oferece seis trilhas completas com perguntas únicas e fontes", () => {
    expect(questions).toHaveLength(24);
    expect(new Set(questions.map((q) => q.id)).size).toBe(24);
    for (const t of tracks)
      expect(questions.filter((q) => q.track === t.id)).toHaveLength(4);
    for (const q of questions) {
      expect(q.options).toHaveLength(4);
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(4);
      expect(q.source).toMatch(/^https:\/\/(developer.mozilla.org|react.dev)/);
    }
  });
  it("gera cinco desafios diários estáveis, únicos e variáveis", () => {
    expect(dailyIds(day)).toEqual(dailyIds(day));
    expect(new Set(dailyIds(day)).size).toBe(5);
    expect(dailyIds(day)).not.toEqual(dailyIds("2026-10-31"));
  });
  it("bloqueia resposta repetida, índices inválidos e conclusão precoce", () => {
    const s = start(fresh(), "lesson", day, "html");
    expect(answer(s, -1)).toBe(s);
    expect(answer(s, 4)).toBe(s);
    expect(finish(s, day)).toBe(s);
    expect(next(s)).toBe(s);
    const a = answer(s, 1);
    expect(answer(a, 1)).toBe(a);
    expect(a.attempts).toBe(1);
  });
  it("leva erros reais para revisão e os remove ao acertar", () => {
    let s = complete(start(fresh(), "lesson", day, "html"), true);
    expect(s.mistakes).toHaveLength(4);
    expect(s.best.html).toBe(0);
    s = complete(start(s, "review", day));
    expect(s.mistakes).toEqual([]);
    expect(s.mastered).toHaveLength(4);
    expect(s.best.html).toBe(0);
  });
  it("não duplica domínio e mantém a melhor rodada", () => {
    let s = complete(start(fresh(), "lesson", day, "html"));
    s = complete(start(s, "lesson", day, "html"));
    s = complete(start(s, "lesson", day, "html"), true);
    expect(s.mastered).toHaveLength(4);
    expect(s.best.html).toBe(4);
    expect(s.days).toEqual([day]);
  });
  it("completa todas as trilhas com 240 XP possíveis", () => {
    let s = fresh();
    for (const t of tracks) s = complete(start(s, "lesson", day, t.id));
    expect(s.mastered.length * 10).toBe(240);
    expect(Object.values(s.best)).toEqual([4, 4, 4, 4, 4, 4]);
    expect(s.correct).toBe(24);
    expect(progressText(s)).toContain("240 XP");
  });
  it("registra o dia da rodada diária sem duplicar datas", () => {
    const s = complete(start(fresh(), "daily", day));
    expect(s.daily).toEqual([day]);
    expect(s.attempts).toBe(5);
  });
  it("retoma feedback salvo sem permitir uma segunda resposta", () => {
    const s = answer(start(fresh(), "lesson", day, "html"), byId.h1.correct);
    const restored = parseState(JSON.stringify(s))!;
    expect(restored).toEqual(s);
    expect(current(restored.run!).id).toBe("h1");
    expect(score(restored.run!)).toBe(1);
    expect(answer(restored, 0)).toBe(restored);
    expect(current(next(restored).run!).id).toBe("h2");
  });
});
describe("persistência e calendário", () => {
  it.each([
    null,
    "",
    "{",
    "{}",
    "null",
    JSON.stringify({ ...fresh(), mastered: ["inexistente"] }),
    JSON.stringify({ ...fresh(), correct: 5 }),
    JSON.stringify({ ...fresh(), days: ["2026-02-30"] }),
  ])("descarta estado inválido %s", (raw) =>
    expect(parseState(raw)).toBeNull(),
  );
  it("recusa uma rodada com conteúdo trocado ou feedback impossível", () => {
    const s = start(fresh(), "daily", day);
    s.run!.ids.reverse();
    expect(parseState(JSON.stringify(s))).toBeNull();
    const lesson = start(fresh(), "lesson", day, "html");
    lesson.run!.feedback = true;
    expect(parseState(JSON.stringify(lesson))).toBeNull();
  });
  it("conta sequência atravessando mês e ano, com tolerância até ontem", () => {
    const days = ["2025-12-30", "2025-12-31", "2026-01-01"];
    expect(streak(days, "2026-01-01")).toBe(3);
    expect(streak(days, "2026-01-02")).toBe(3);
    expect(streak(days, "2026-01-03")).toBe(0);
    expect(streak(["2024-02-28", "2024-02-29"], "2024-03-01")).toBe(2);
  });
  it("valida datas reais e não inicia revisão vazia", () => {
    expect(validDay("2026-02-29")).toBe(false);
    expect(validDay("2024-02-29")).toBe(true);
    expect(start(fresh(), "review", day).run).toBeNull();
    expect(start(fresh(), "daily", "inválido").run).toBeNull();
  });
});
