"use client";
import { useEffect, useRef, useState } from "react";
import { byId, questions, tracks } from "../lib/content";
import type { Track } from "../lib/content";
import {
  answer,
  current,
  finish,
  fresh,
  next,
  parseState,
  progressText,
  score,
  start,
  streak,
  todayKey,
} from "../lib/game";
import type { Run, State } from "../lib/game";

const key = "codepop:progress:1";
function Pop({ happy = false }: { happy?: boolean }) {
  return (
    <svg viewBox="0 0 130 140" aria-hidden="true" className="pop">
      <path
        d="M23 106 9 119M109 102l13 14"
        stroke="#392377"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="m43 123-5 10m50-10 5 10"
        stroke="#392377"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <rect
        x="20"
        y="21"
        width="92"
        height="106"
        rx="35"
        fill="#aa87ef"
        stroke="#392377"
        strokeWidth="5"
      />
      <path
        d="m46 23 4-15 13 10L79 4l10 20"
        fill="#d7f578"
        stroke="#392377"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <rect x="32" y="49" width="68" height="46" rx="18" fill="#fff" />
      <path
        d={happy ? "M43 70q7-12 14 0m18 0q7-12 14 0" : "M49 64v10m34-10v10"}
        stroke="#392377"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M56 102q10 11 20 0"
        stroke="#392377"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
function exportProgress(s: State) {
  const url = URL.createObjectURL(
      new Blob([progressText(s)], { type: "text/plain;charset=utf-8" }),
    ),
    a = document.createElement("a");
  a.href = url;
  a.download = "codepop-progresso.txt";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function CodePop() {
  const [state, setState] = useState<State>(fresh),
    [ready, setReady] = useState(false),
    [page, setPage] = useState<"trail" | "review" | "passport">("trail"),
    [selected, setSelected] = useState<number | null>(null),
    [summary, setSummary] = useState<Run | null>(null),
    [notice, setNotice] = useState(""),
    [day, setDay] = useState(""),
    [modal, setModal] = useState<"help" | "leave" | null>(null);
  const main = useRef<HTMLElement>(null),
    dialog = useRef<HTMLDialogElement>(null),
    returnFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key),
        loaded = parseState(raw);
      if (loaded) setState(loaded);
      else if (raw)
        setNotice("O progresso não pôde ser lido. Uma trilha nova foi aberta.");
    } catch {
      setNotice(
        "Armazenamento indisponível. Seu progresso fica só nesta sessão.",
      );
    }
    setDay(todayKey());
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      setNotice(
        "Não foi possível salvar. Baixe seu progresso para guardar um registro.",
      );
    }
  }, [state, ready]);
  useEffect(() => {
    if (modal) dialog.current?.showModal();
    else if (dialog.current?.open) dialog.current.close();
  }, [modal]);
  const focus = () =>
    requestAnimationFrame(() => {
      main.current?.focus();
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  function navigate(p: typeof page) {
    setPage(p);
    setSummary(null);
    focus();
  }
  function begin(mode: Run["mode"], track: Track | null = null) {
    if (!ready) return;
    setState((s) => start(s, mode, todayKey(), track));
    setSummary(null);
    setSelected(null);
    focus();
  }
  function open(kind: typeof modal) {
    returnFocus.current = document.activeElement as HTMLElement;
    setModal(kind);
  }
  function close() {
    setModal(null);
    requestAnimationFrame(() => returnFocus.current?.focus());
  }
  function advance() {
    if (!state.run) return;
    if (state.run.answers.length === state.run.ids.length) {
      setSummary(state.run);
      setState((s) => finish(s, todayKey()));
      setDay(todayKey());
    } else setState(next);
    setSelected(null);
    focus();
  }
  const run = state.run,
    q = run ? current(run) : null,
    feedback = run?.feedback ?? false,
    choice = feedback ? run!.answers.at(-1)! : selected,
    correct = feedback && choice === q?.correct,
    xp = state.mastered.length * 10,
    done = Object.keys(state.best).length,
    days = streak(state.days, day),
    activeTrack = q ? tracks.find((t) => t.id === q.track)! : null;
  return (
    <>
      <a className="skip" href="#main">
        Pular para o conteúdo
      </a>
      <header className="hud">
        <button
          className="brand"
          onClick={() => {
            if (run) open("leave");
            else navigate("trail");
          }}
          aria-label="CodePop, abrir trilha"
        >
          code<span>pop</span>
          <i aria-hidden="true">✦</i>
        </button>
        <span className="local-label">SEU CLUBE DE PEQUENAS DESCOBERTAS</span>
        <div className="hud-stats">
          <span title="Dias consecutivos com uma rodada concluída">
            <b aria-hidden="true">♨</b>
            <strong>{days}</strong>
            <small>dias</small>
          </span>
          <span title="10 XP por pergunta dominada pela primeira vez">
            <b aria-hidden="true">✦</b>
            <strong>{xp}</strong>
            <small>XP</small>
          </span>
          <button
            aria-label="Como funciona o CodePop"
            onClick={() => open("help")}
          >
            ?
          </button>
        </div>
      </header>
      <main id="main" ref={main} tabIndex={-1}>
        {run && q ? (
          <section className="play-area">
            <div className="play-top">
              <button
                className="exit-round"
                onClick={() => open("leave")}
                aria-label="Sair da rodada"
              >
                ×
              </button>
              <div className="round-progress">
                <progress
                  max={run.ids.length}
                  value={run.answers.length}
                  aria-label="Progresso da rodada"
                />
                <span>
                  {run.answers.length} de {run.ids.length} respondidas
                </span>
              </div>
              <span className="round-mode">
                {run.mode === "daily"
                  ? "DO DIA"
                  : run.mode === "review"
                    ? "REVISÃO"
                    : activeTrack?.tag}
              </span>
            </div>
            <div className="question-heading">
              <div className="mini-pop">
                <Pop happy={correct} />
              </div>
              <div>
                <p className="eyebrow">
                  {activeTrack?.tag} · QUESTÃO{" "}
                  {run.answers.length + (feedback ? 0 : 1)}
                </p>
                <h1>{q.title}</h1>
              </div>
            </div>
            {q.code && (
              <div className="code-window">
                <div aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <span>leia com calma, sem executar</span>
                </div>
                <pre>
                  <code>{q.code}</code>
                </pre>
              </div>
            )}
            <fieldset className="answer-options grid gap-3" disabled={feedback}>
              <legend>Escolha uma resposta</legend>
              {q.options.map((option, i) => (
                <label
                  key={i}
                  className={`answer ${choice === i ? "chosen" : ""} ${feedback && i === q.correct ? "right" : ""} ${feedback && choice === i && !correct ? "wrong" : ""}`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={i}
                    checked={choice === i}
                    onChange={() => setSelected(i)}
                  />
                  <span className="answer-letter" aria-hidden="true">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{option}</span>
                  {feedback && i === q.correct && <b aria-hidden="true">✓</b>}
                </label>
              ))}
            </fieldset>
            {feedback ? (
              <div className={`feedback ${correct ? "yes" : "no"}`}>
                <div role="status">
                  <strong>
                    {correct
                      ? "Boa! Um conceito a mais."
                      : "Quase! É aqui que a ideia encaixa."}
                  </strong>
                  <p>{q.explanation}</p>
                  <a href={q.source} target="_blank" rel="noreferrer">
                    Conferir na documentação ↗
                  </a>
                </div>
                <button className="button primary" onClick={advance}>
                  {run.answers.length === run.ids.length
                    ? "Ver meu resultado"
                    : "Próxima pergunta"}{" "}
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            ) : (
              <div className="confirm-row">
                <p>Sem relógio. Pense no seu ritmo.</p>
                <button
                  className="button primary"
                  disabled={selected === null}
                  onClick={() => {
                    if (selected !== null) setState((s) => answer(s, selected));
                  }}
                >
                  Conferir resposta <span aria-hidden="true">↵</span>
                </button>
              </div>
            )}
          </section>
        ) : summary ? (
          <section className="result-page">
            <div className="result-confetti" aria-hidden="true">
              ✦ · ✧ · ✦
            </div>
            <Pop happy />
            <p className="eyebrow">RODADA CONCLUÍDA</p>
            <h1>
              {score(summary) === summary.ids.length
                ? "Deu pop em tudo!"
                : "Mais um passo na trilha."}
            </h1>
            <p className="result-copy">
              {score(summary)} de {summary.ids.length} respostas certas.{" "}
              {score(summary) < summary.ids.length
                ? "Os erros ficaram na revisão para você tentar de novo."
                : "Você pode explorar outro tema quando quiser."}
            </p>
            <div className="result-ribbon">
              <span>
                <b>{xp}</b> XP de domínio no total
              </span>
              <span>
                <b>{state.mistakes.length}</b> para revisar agora
              </span>
            </div>
            <div className="result-actions">
              <button
                className="button primary"
                onClick={() => navigate("trail")}
              >
                Voltar à trilha →
              </button>
              <button
                className="button soft"
                onClick={() => navigate("review")}
              >
                Olhar minha revisão
              </button>
            </div>
            <p className="fine">
              Repetir uma pergunta já dominada não gera XP extra. Seu
              conhecimento vale mais que o contador.
            </p>
          </section>
        ) : (
          <>
            <nav className="club-nav" aria-label="Áreas do CodePop">
              {(
                [
                  ["trail", "⌁", "Trilha"],
                  ["review", "↻", "Revisão"],
                  ["passport", "⚑", "Passaporte"],
                ] as const
              ).map(([id, icon, label]) => (
                <button
                  key={id}
                  aria-current={page === id ? "page" : undefined}
                  onClick={() => navigate(id)}
                >
                  <span aria-hidden="true">{icon}</span>
                  {label}
                  {id === "review" && state.mistakes.length > 0 && (
                    <small>{state.mistakes.length}</small>
                  )}
                </button>
              ))}
            </nav>
            {page === "trail" ? (
              <section className="trail-page">
                <div className="trail-heading">
                  <div>
                    <p className="eyebrow">TEMPORADA 01 / FUNDAMENTOS DA WEB</p>
                    <h1>
                      Um conceito
                      <br />
                      <em>de cada vez.</em>
                    </h1>
                    <p>Escolha uma parada. Descubra algo novo.</p>
                  </div>
                  <div className="hero-pop">
                    <Pop />
                    <span className="speech">Bora nessa?</span>
                  </div>
                </div>
                <div className="daily-capsule">
                  <span className="daily-symbol" aria-hidden="true">
                    ✷
                  </span>
                  <div>
                    <strong>O mix do dia</strong>
                    <span>5 perguntas para mudar de assunto.</span>
                  </div>
                  <button disabled={!ready} onClick={() => begin("daily")}>
                    {state.daily.includes(day)
                      ? "Jogar de novo"
                      : "Jogar rodada do dia"}{" "}
                    <span aria-hidden="true">↗</span>
                  </button>
                </div>
                <div className="trail">
                  <svg
                    className="trail-road"
                    viewBox="0 0 400 1000"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M110 60C110 150 280 100 280 230S110 330 110 400S280 490 280 570S110 680 110 740S280 850 280 910"
                      fill="none"
                      stroke="#c9c2dc"
                      strokeWidth="16"
                      strokeLinecap="round"
                      strokeDasharray="2 27"
                    />
                  </svg>
                  <ol>
                    {tracks.map((t, i) => {
                      const best = state.best[t.id],
                        mastered = questions.filter(
                          (q) =>
                            q.track === t.id && state.mastered.includes(q.id),
                        ).length;
                      return (
                        <li key={t.id} className={`station station-${i}`}>
                          <button
                            className="lesson-node"
                            style={{ "--node": t.color } as React.CSSProperties}
                            onClick={() => begin("lesson", t.id)}
                            disabled={!ready}
                            aria-label={`Jogar ${t.tag}: ${t.name}`}
                          >
                            <span aria-hidden="true">{t.icon}</span>
                            {best === 4 && <i aria-hidden="true">✓</i>}
                          </button>
                          <div className="station-label">
                            <span className="stop-count">
                              PARADA {String(i + 1).padStart(2, "0")} / {t.tag}
                            </span>
                            <h2>{t.name}</h2>
                            <p>{t.description}</p>
                            <div
                              className="mastery-dots"
                              aria-label={`${mastered} de 4 perguntas dominadas`}
                            >
                              {[0, 1, 2, 3].map((n) => (
                                <i
                                  key={n}
                                  className={n < mastered ? "filled" : ""}
                                />
                              ))}
                            </div>
                            <small>
                              {best === undefined
                                ? "4 perguntas · sem pressa"
                                : `Melhor rodada: ${best}/4 · toque para repetir`}
                            </small>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                  <div className="trail-end">
                    <span aria-hidden="true">⚑</span>
                    <strong>O próximo nível é praticar.</strong>
                    <p>Volte aos temas. Os conceitos vão ficando.</p>
                  </div>
                </div>
              </section>
            ) : page === "review" ? (
              <section className="review-page">
                <div className="page-heading">
                  <p className="eyebrow">ERRAR TAMBÉM É UM JEITO DE CHEGAR</p>
                  <h1>
                    Vamos virar
                    <br />
                    essa chave?
                  </h1>
                  <p>
                    Sua fila usa apenas perguntas que você errou. Acertou na
                    próxima tentativa? Ela sai daqui.
                  </p>
                </div>
                {!state.mistakes.length ? (
                  <div className="empty-state">
                    <Pop happy />
                    <h2>Tudo em dia por aqui.</h2>
                    <p>
                      Quando uma resposta escapar, ela ganha outra chance neste
                      espaço.
                    </p>
                    <button
                      className="button primary"
                      onClick={() => navigate("trail")}
                    >
                      Explorar a trilha →
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="review-start">
                      <strong>
                        {state.mistakes.length} perguntas esperando uma segunda
                        chance.
                      </strong>
                      <button
                        className="button primary"
                        onClick={() => begin("review")}
                      >
                        Começar revisão →
                      </button>
                    </div>
                    <ol className="review-list">
                      {state.mistakes.map((id, i) => {
                        const item = byId[id];
                        return (
                          <li key={id}>
                            <span>{String(i + 1).padStart(2, "0")}</span>
                            <div>
                              <small>
                                {tracks.find((t) => t.id === item.track)?.tag}
                              </small>
                              <h2>{item.title}</h2>
                            </div>
                            <span aria-hidden="true">↻</span>
                          </li>
                        );
                      })}
                    </ol>
                  </>
                )}
              </section>
            ) : (
              <section className="passport-page">
                <div className="page-heading">
                  <p className="eyebrow">CONQUISTAS QUE VOCÊ FEZ DE VERDADE</p>
                  <h1>
                    Seu jeito
                    <br />
                    de aprender.
                  </h1>
                  <p>
                    Este passaporte existe só neste navegador. Sem ranking, sem
                    comparação, sem pressa.
                  </p>
                </div>
                <div className="xp-medal">
                  <span aria-hidden="true">✦</span>
                  <strong>{xp}</strong>
                  <span>XP DE DOMÍNIO</span>
                  <p>{state.mastered.length} de 24 perguntas dominadas</p>
                </div>
                <div className="passport-numbers">
                  <span>
                    <b>{done}/6</b>trilhas concluídas
                  </span>
                  <span>
                    <b>
                      {state.attempts
                        ? Math.round((state.correct / state.attempts) * 100)
                        : 0}
                      %
                    </b>
                    acerto nas tentativas
                  </span>
                  <span>
                    <b>{days}</b>dias em sequência
                  </span>
                </div>
                <h2 className="milestones-title">Pequenas grandes marcas</h2>
                <ul className="milestones">
                  {[
                    {
                      title: "Dei o primeiro pop",
                      text: "Concluir uma rodada em qualquer modo.",
                      ok: state.days.length > 0,
                      symbol: "✧",
                    },
                    {
                      title: "Passei por todas",
                      text: "Concluir as seis trilhas.",
                      ok: done === 6,
                      symbol: "⚑",
                    },
                    {
                      title: "Web na ponta da língua",
                      text: "Dominar as 24 perguntas ao menos uma vez.",
                      ok: state.mastered.length === 24,
                      symbol: "✦",
                    },
                    {
                      title: "Ritual de curiosidade",
                      text: "Concluir o mix diário em três datas diferentes.",
                      ok: state.daily.length >= 3,
                      symbol: "☀",
                    },
                  ].map((v) => (
                    <li key={v.title} className={v.ok ? "earned" : ""}>
                      <span aria-hidden="true">{v.symbol}</span>
                      <div>
                        <strong>{v.title}</strong>
                        <p>{v.text}</p>
                      </div>
                      <b>{v.ok ? "CONQUISTADA" : "A CAMINHO"}</b>
                    </li>
                  ))}
                </ul>
                <div className="passport-export">
                  <button
                    className="button soft"
                    onClick={() => exportProgress(state)}
                  >
                    Baixar progresso .txt ↓
                  </button>
                  <p>Um registro para guardar. Não é arquivo de restauração.</p>
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <footer>
        <span>CODEPOP · APRENDER NÃO PRECISA SER UM EVENTÃO.</span>
        <span>DEMO COM CONTEÚDO LOCAL</span>
        <a
          href="https://github.com/gustapaz/codepop"
          target="_blank"
          rel="noreferrer"
        >
          Gustavo Paz · código ↗
        </a>
      </footer>
      {notice && (
        <div className="notice">
          <span role="status">{notice}</span>
          <button aria-label="Fechar aviso" onClick={() => setNotice("")}>
            ×
          </button>
        </div>
      )}
      {modal && (
        <dialog
          ref={dialog}
          className="club-dialog"
          aria-labelledby="dialog-title"
          onCancel={(e) => {
            e.preventDefault();
            close();
          }}
        >
          <button
            className="close-dialog"
            onClick={close}
            aria-label="Fechar janela"
          >
            ×
          </button>
          {modal === "leave" ? (
            <>
              <p className="eyebrow">PODE DAR UMA PAUSA</p>
              <h2 id="dialog-title">A rodada espera por você.</h2>
              <p>
                Continue agora, feche a aba para retomar depois ou encerre esta
                tentativa sem resultado de trilha.
              </p>
              <div className="dialog-actions">
                <button
                  className="button primary"
                  onClick={() => {
                    close();
                    focus();
                  }}
                >
                  Continuar rodada
                </button>
                <button
                  className="button soft"
                  onClick={() => {
                    setState((s) => ({ ...s, run: null }));
                    setSelected(null);
                    setPage("trail");
                    close();
                    focus();
                  }}
                >
                  Encerrar tentativa
                </button>
              </div>
              <p className="fine">
                As respostas já dadas continuam nas estatísticas e na revisão.
                Fechar a aba preserva a rodada para retomar depois.
              </p>
            </>
          ) : (
            <>
              <p className="eyebrow">UM CONCEITO DE CADA VEZ</p>
              <h2 id="dialog-title">O clube é seu.</h2>
              <p>
                Escolha uma trilha ou o mix do dia. São perguntas curtas com
                explicação após cada resposta. Não executamos o código dos
                exemplos.
              </p>
              <ul>
                <li>10 XP por pergunta acertada pela primeira vez.</li>
                <li>Erros vão para a revisão e saem quando você acerta.</li>
                <li>A sequência conta dias com uma rodada concluída.</li>
                <li>Você pode parar: não há vidas, cronômetro ou punição.</li>
              </ul>
              <p className="fine">
                Este projeto não é um curso certificado. Dados e progresso ficam
                neste navegador, sem conta ou sincronização. Fontes e exemplos
                estão documentados no repositório.
              </p>
              <button className="button primary" onClick={close}>
                Entendi. Bora jogar →
              </button>
            </>
          )}
        </dialog>
      )}
    </>
  );
}
