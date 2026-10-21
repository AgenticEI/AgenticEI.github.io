"use strict";

const stages = {
  inspect: { label: "Start from a version and its evidence", title: "Connect an outcome to the decisions that produced it.", copy: "Inspect the current harness together with observations, tool calls, robot actions, and task outcomes. Use this evidence to identify a behavior to improve and a hypothesis worth testing.", artifact: "A concrete development hypothesis" },
  explore: { label: "Actively acquire additional evidence", title: "Choose what to observe, what to try, and what to test next.", copy: "The meta-agent can start a private simulator session, inspect execution states, and invoke public sensing and control capabilities. New observations and interventions help it investigate questions that the existing records do not resolve.", artifact: "Diagnostic evidence from environment interaction" },
  develop: { label: "Turn discoveries into executable changes", title: "Write skills and coordination logic that another run can use.", copy: "Revise instructions, executable skills, decision hooks, or persistent knowledge. The meta-agent can request autonomous candidate tests and use their results to refine a version before submission.", artifact: "A versioned, executable harness candidate" },
  evaluate: { label: "Freeze, evaluate, and retain", title: "Check whether the revised harness works autonomously.", copy: "The host evaluates the submitted frozen version through fresh autonomous executions without meta-agent intervention. Selection determines the retained version; candidate code and evidence remain available in the harness history.", artifact: "A selected harness and evidence for the next iteration" }
};

function wireTabs(buttons, select) {
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => select(button));
    button.addEventListener("keydown", event => {
      let next = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % buttons.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = buttons.length - 1;
      if (next !== null) { event.preventDefault(); select(buttons[next]); buttons[next].focus(); }
    });
  });
}

const methodTabs = Array.from(document.querySelectorAll(".method-tabs [role=tab]"));
wireTabs(methodTabs, button => {
  methodTabs.forEach(item => { const active = item === button; item.setAttribute("aria-selected", String(active)); item.tabIndex = active ? 0 : -1; });
  const stage = stages[button.dataset.stage];
  document.getElementById("stage-label").textContent = stage.label;
  document.getElementById("stage-title").textContent = stage.title;
  document.getElementById("stage-copy").textContent = stage.copy;
  document.getElementById("stage-artifact").textContent = stage.artifact;
  document.getElementById("method-detail").setAttribute("aria-labelledby", button.id);
});

const resultTabs = Array.from(document.querySelectorAll(".result-tabs [role=tab]"));
wireTabs(resultTabs, button => {
  resultTabs.forEach(item => { const active = item === button; item.setAttribute("aria-selected", String(active)); item.tabIndex = active ? 0 : -1; document.getElementById(item.getAttribute("aria-controls")).hidden = !active; });
});

const dialog = document.getElementById("figure-dialog");
let opener = null;
document.querySelectorAll(".figure-zoom").forEach(button => {
  button.addEventListener("click", () => {
    opener = button;
    const img = document.getElementById("dialog-image");
    img.src = button.dataset.figure;
    img.alt = button.querySelector("img").alt;
    document.getElementById("dialog-caption").textContent = button.dataset.caption;
    document.getElementById("dialog-original").href = button.dataset.figure;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else window.open(button.dataset.figure, "_blank", "noopener");
  });
});
dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
dialog.addEventListener("close", () => opener?.focus());

document.getElementById("copy-citation").addEventListener("click", async () => {
  const status = document.getElementById("copy-status");
  try { await navigator.clipboard.writeText(document.getElementById("bibtex").textContent); status.textContent = "Citation copied."; }
  catch { const range = document.createRange(); range.selectNodeContents(document.getElementById("bibtex")); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); status.textContent = "Citation selected. Use your browser’s copy command."; }
});

// The user starts playback; preserve a quiet, motion-free initial page.
const videos = Array.from(document.querySelectorAll("video"));
videos.forEach(video => video.addEventListener("play", () => {
  videos.forEach(other => { if (other !== video) other.pause(); });
}));
document.addEventListener("visibilitychange", () => {
  if (document.hidden) videos.forEach(video => video.pause());
});
