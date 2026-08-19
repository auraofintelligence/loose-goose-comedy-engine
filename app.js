const BPM = 92;
const SEC_PER_BEAT = 60 / BPM;
const STORAGE_KEY = "loose-goose-comedy-engine-v01";
const lensDefinitions = [
  ["Observational", "What ordinary human absurdity does this expose?"],
  ["Anecdotal", "What is the shortest truthful story with a want, obstacle, turn and result?"],
  ["Stand-up sketch", "What miniature scene can be replayed with distinct roles?"],
  ["Act-out", "Who or what can be physically embodied?"],
  ["Self-deprecation", "How are you the idiot, hypocrite or overconfident one?"],
  ["People in your life", "What behaviour can be mocked without inventing motives?"],
  ["Crowd work / controlled risk", "What personal, sexual, social, status or moral question creates useful tension in this room? Map the risk, first riff, escalation, clapback and return line—not a bland icebreaker."],
  ["Comic flaw", "What stable flaw makes this happen repeatedly?"],
  ["Character", "What exaggerated but truthful stage character lives here?"],
  ["Edgy / forbidden", "What are you not supposed to say here? Build enough shared truth that the room wants you to say it, then turn, reveal or escalate it."],
  ["Institutional put-down", "Which powerful system has earned the attack?"],
  ["Specialty / music / visual", "Can a song, prop, receipt or image carry the reveal?"],
  ["Ad-lib", "Where can the track open, play, then return?"],
  ["Status reversal", "Who appears powerful or competent, and how does that flip?"],
  ["Scale mismatch", "Where does a tiny human problem collide with a giant ambition?"]
];

const state = loadState() || newState();
const $ = id => document.getElementById(id);

function newState() {
  return {
    kind: "track_draft",
    seed: { title: "", sensitivity: "private", timePeriod: "", location: "", rawMemory: "", want: "", obstacle: "", weirdDetail: "", emotionalTruth: "", thoughtThen: "", thoughtNow: "", receipts: "", unknowns: "", claims: [] },
    track: { premise: "", game: "", scene: "", comicFlaw: "", openingLine: "", button: "", beats: [] }
  };
}

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); renderSummary(); }
function words(text) { return (text.match(/\b[\w’'-]+\b/g) || []).length; }
function duration(seconds) { const s = Math.max(0, Math.round(seconds)); const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const r = s % 60; return h ? `${h}:${String(m).padStart(2,"0")}:${String(r).padStart(2,"0")}` : `${m}:${String(r).padStart(2,"0")}`; }

function bindText(id, obj, key) {
  const el = $(id); el.value = obj[key] || "";
  el.addEventListener("input", () => { obj[key] = el.value; saveState(); updateRuntime(); });
}

function renderClaims() {
  const root = $("claims"); root.innerHTML = "";
  state.seed.claims.forEach((claim, i) => {
    const row = document.createElement("div"); row.className = "claim-row";
    row.innerHTML = `
      <label class="mini-label">Claim<input data-k="text" value="${escapeAttr(claim.text || "")}"></label>
      <label class="mini-label">Status<select data-k="status">${["fact","memory","inference","comic_exaggeration","unknown"].map(v=>`<option ${v===claim.status?"selected":""}>${v}</option>`).join("")}</select></label>
      <label class="mini-label">Source / base claim<input data-k="source" value="${escapeAttr(claim.source || "")}"></label>
      <button class="remove">Remove</button>`;
    row.querySelectorAll("[data-k]").forEach(el => el.addEventListener("input", () => { claim[el.dataset.k] = el.value; saveState(); }));
    row.querySelector(".remove").addEventListener("click", () => { state.seed.claims.splice(i,1); renderClaims(); saveState(); });
    root.appendChild(row);
  });
}

function renderLenses() {
  const root = $("lensCards"); root.innerHTML = "";
  lensDefinitions.forEach(([name, question]) => {
    const card = document.createElement("article"); card.className = "lens-card";
    card.innerHTML = `<h3>${name}</h3><p>${question}</p><textarea rows="5" placeholder="Possibilities, not canon..."></textarea>`;
    root.appendChild(card);
  });
}

function renderBeats() {
  const root = $("beatsList"); root.innerHTML = "";
  state.track.beats.forEach((beat, i) => {
    const row = document.createElement("div"); row.className = "beat-row";
    row.innerHTML = `
      <label class="mini-label">Kind<select data-k="kind">${["setup","detail","turn","punch","tag","act_out","pause","callback","crowd","music","button"].map(v=>`<option ${v===beat.kind?"selected":""}>${v}</option>`).join("")}</select></label>
      <label class="mini-label">Text<textarea data-k="text" rows="3">${escapeHtml(beat.text || "")}</textarea></label>
      <label class="mini-label">WPM<input data-k="wpm" type="number" min="1" value="${beat.wpm || 145}"></label>
      <label class="mini-label">Pause beats<input data-k="pauseBeats" type="number" min="0" step=".5" value="${beat.pauseBeats || 0}"></label>
      <label class="mini-label">Laugh beats<input data-k="laughBeats" type="number" min="0" step=".5" value="${beat.laughBeats || 0}"></label>
      <label class="mini-label">Fixed sec<input data-k="fixedSeconds" type="number" min="0" step=".5" value="${beat.fixedSeconds || 0}"></label>
      <div><label class="mini-label"><span>Optional</span><input data-k="optional" type="checkbox" ${beat.optional?"checked":""}></label><button class="remove">Remove</button></div>`;
    row.querySelectorAll("[data-k]").forEach(el => el.addEventListener("input", () => {
      const key = el.dataset.k;
      beat[key] = el.type === "checkbox" ? el.checked : (el.type === "number" ? Number(el.value) : el.value);
      saveState(); updateRuntime();
    }));
    row.querySelector(".remove").addEventListener("click", () => { state.track.beats.splice(i,1); renderBeats(); saveState(); updateRuntime(); });
    root.appendChild(row);
  });
}

function beatSeconds(beat) {
  const speech = words(beat.text || "") / Math.max(1, Number(beat.wpm || 145)) * 60;
  return speech + (Number(beat.pauseBeats || 0) + Number(beat.laughBeats || 0)) * SEC_PER_BEAT + Number(beat.fixedSeconds || 0);
}

function updateRuntime() {
  let required = 0, optional = 0, wordTotal = 0;
  state.track.beats.forEach(beat => { const s = beatSeconds(beat); wordTotal += words(beat.text || ""); beat.optional ? optional += s : required += s; });
  $("wordTotal").textContent = wordTotal;
  $("runtimeRequired").textContent = duration(required);
  $("runtimeMax").textContent = duration(required + optional);
  $("beatEquivalent").textContent = Math.round((required + optional) / SEC_PER_BEAT);
}

function markdownSummary() {
  const s = state.seed, t = state.track;
  const claims = s.claims.map(c => `- **${c.status || "unknown"}:** ${c.text || ""}${c.source ? ` — ${c.source}` : ""}`).join("\n") || "- None yet";
  const beats = t.beats.map((b,i) => `${i+1}. **${b.kind}** — ${b.text || ""}  \n   WPM ${b.wpm || 145}; pause ${b.pauseBeats || 0}; laugh ${b.laughBeats || 0}${b.optional ? "; optional" : ""}`).join("\n") || "1. No beats yet";
  return `# ${s.title || "Untitled track"}\n\n## Truth seed\n\n${s.rawMemory || ""}\n\n- **Want:** ${s.want || ""}\n- **Obstacle:** ${s.obstacle || ""}\n- **Weird detail:** ${s.weirdDetail || ""}\n- **Thought then:** ${s.thoughtThen || ""}\n- **Thought now:** ${s.thoughtNow || ""}\n- **Emotional truth:** ${s.emotionalTruth || ""}\n- **Unknowns:** ${s.unknowns || ""}\n\n### Claims\n${claims}\n\n## Comic track\n\n- **Premise:** ${t.premise || ""}\n- **Game:** ${t.game || ""}\n- **Scene:** ${t.scene || ""}\n- **Comic flaw:** ${t.comicFlaw || ""}\n- **Opening:** ${t.openingLine || ""}\n- **Button:** ${t.button || ""}\n\n### Beat score\n${beats}`;
}
function renderSummary() { $("summaryText").textContent = markdownSummary(); }

function exportJson() {
  const blob = new Blob([JSON.stringify(state, null, 2)], {type:"application/json"});
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${slug(state.seed.title || "loose-goose-track")}.json`; a.click(); URL.revokeObjectURL(a.href);
}
function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); }
function escapeAttr(s) { return String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;"); }
function escapeHtml(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

function init() {
  bindText("title", state.seed, "title"); bindText("timePeriod", state.seed, "timePeriod"); bindText("location", state.seed, "location"); bindText("rawMemory", state.seed, "rawMemory"); bindText("want", state.seed, "want"); bindText("obstacle", state.seed, "obstacle"); bindText("weirdDetail", state.seed, "weirdDetail"); bindText("emotionalTruth", state.seed, "emotionalTruth"); bindText("thoughtThen", state.seed, "thoughtThen"); bindText("thoughtNow", state.seed, "thoughtNow"); bindText("receipts", state.seed, "receipts"); bindText("unknowns", state.seed, "unknowns");
  $("sensitivity").value = state.seed.sensitivity; $("sensitivity").addEventListener("change", e => { state.seed.sensitivity = e.target.value; saveState(); });
  bindText("premise", state.track, "premise"); bindText("game", state.track, "game"); bindText("scene", state.track, "scene"); bindText("comicFlaw", state.track, "comicFlaw"); bindText("openingLine", state.track, "openingLine"); bindText("button", state.track, "button");
  document.querySelectorAll(".tab").forEach(tab => tab.addEventListener("click", () => { document.querySelectorAll(".tab,.panel").forEach(x=>x.classList.remove("active")); tab.classList.add("active"); $(tab.dataset.tab).classList.add("active"); renderSummary(); }));
  $("addClaim").addEventListener("click", () => { state.seed.claims.push({text:"",status:"memory",source:""}); renderClaims(); saveState(); });
  $("addBeat").addEventListener("click", () => { state.track.beats.push({kind:"setup",text:"",wpm:145,pauseBeats:0,laughBeats:0,fixedSeconds:0,optional:false}); renderBeats(); saveState(); updateRuntime(); });
  $("generateLenses").addEventListener("click", renderLenses);
  $("exportBtn").addEventListener("click", exportJson);
  $("importBtn").addEventListener("click", () => $("importFile").click());
  $("importFile").addEventListener("change", async e => { const file = e.target.files[0]; if (!file) return; const incoming = JSON.parse(await file.text()); Object.keys(state).forEach(k=>delete state[k]); Object.assign(state,incoming); localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); location.reload(); });
  $("newDraft").addEventListener("click", () => { if (!confirm("Clear the local draft? Export first if needed.")) return; localStorage.removeItem(STORAGE_KEY); location.reload(); });
  $("copySummary").addEventListener("click", async () => { await navigator.clipboard.writeText(markdownSummary()); $("copySummary").textContent = "Copied"; setTimeout(()=>$("copySummary").textContent="Copy Markdown",1000); });
  renderClaims(); renderLenses(); renderBeats(); updateRuntime(); renderSummary();
}
init();
