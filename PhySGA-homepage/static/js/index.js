const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealItems = document.querySelectorAll(".reveal");

if (reducedMotion.matches || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  document.body.classList.add("reveal-ready");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

const architectureDemo = document.querySelector("#architecture-demo");

if (architectureDemo) {
  const architectureCanvas = architectureDemo.querySelector(".physga-architecture");
  const stageTabs = [...architectureDemo.querySelectorAll("[data-architecture-stage]")];
  const playbackButton = architectureDemo.querySelector(".architecture-playback");
  const playbackIcon = playbackButton.querySelector("i");
  const playbackLabel = playbackButton.querySelector("span");
  const stageNumber = architectureDemo.querySelector(".architecture-stage-number");
  const stageTitle = architectureDemo.querySelector(".architecture-stage-title");
  const stageDescription = architectureDemo.querySelector(".architecture-stage-description");

  const stageContent = [
    {
      title: "Global planning",
      description: "The Assembly Agent turns the task into an ordered construction plan and prepares a release state through coarse adjustment.",
    },
    {
      title: "Action grounding",
      description: "Action Routers convert the Assembly Agent's semantic adjustments into executable geometric, joint, and velocity commands.",
    },
    {
      title: "Physical simulation",
      description: "The simulator executes the release state and returns multi-view observations of contact, motion, deformation, and stability.",
    },
    {
      title: "Feedback refinement",
      description: "The Critic Agent attributes the observed failure, applies pixel-grounded fine adjustment, and verifies the refinement through another simulation.",
    },
    {
      title: "Experience evolution",
      description: "After a successful composition, the Self-Evolving Skill Library distills the interaction experience into reusable task-specific guidance.",
    },
  ];

  let activeStage = 0;
  let paused = reducedMotion.matches;
  let visible = true;
  let stageClock = null;

  function setStage(nextStage) {
    activeStage = (nextStage + stageContent.length) % stageContent.length;
    architectureCanvas.dataset.stage = String(activeStage);

    stageTabs.forEach((tab, index) => {
      const selected = index === activeStage;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
    });

    const content = stageContent[activeStage];
    stageNumber.textContent = String(activeStage + 1).padStart(2, "0");
    stageTitle.textContent = content.title;
    stageDescription.textContent = content.description;
  }

  function updatePlaybackButton() {
    architectureDemo.classList.toggle("is-paused", paused || !visible || document.hidden);
    playbackButton.setAttribute("aria-pressed", String(paused));
    playbackButton.setAttribute("aria-label", paused ? "Play architecture animation" : "Pause architecture animation");
    playbackIcon.className = paused ? "fas fa-play" : "fas fa-pause";
    playbackLabel.textContent = paused ? "Play" : "Pause";
  }

  function syncPlayback() {
    window.clearInterval(stageClock);
    stageClock = null;
    const shouldPlay = !paused && visible && !document.hidden;
    updatePlaybackButton();
    if (shouldPlay) {
      stageClock = window.setInterval(() => setStage(activeStage + 1), 4800);
    }
  }

  stageTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      paused = true;
      setStage(Number(tab.dataset.architectureStage));
      syncPlayback();
    });
  });

  playbackButton.addEventListener("click", () => {
    paused = !paused;
    syncPlayback();
  });

  document.addEventListener("visibilitychange", syncPlayback);

  if ("IntersectionObserver" in window) {
    const architectureObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.18 }
    );
    architectureObserver.observe(architectureDemo);
  }

  setStage(0);
  syncPlayback();
}

