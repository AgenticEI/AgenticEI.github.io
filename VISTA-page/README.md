# VISTA project page

A buildless research page for **VISTA: Active Exploration for Self-Improvement in Embodied Agents**.

Serve the repository root locally:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/VISTA-page/`.

The page uses local images, a PDF, MP4/WebM video alternatives, and plain HTML/CSS/JavaScript. It has no build step, analytics, account integration, or external JavaScript dependency.

## Content notes

- Main results compare initial harnesses with task-specific selected versions across LIBERO-Pro, RoboCasa, and RoboTwin.
- The main project video is the supplied `VISTA.mp4`, preserved without edits, with original audio and embedded subtitles. A WebM alternative supports browsers without H.264 decoding. Playback starts only when the visitor chooses to play it.
- The case-study video contains three autonomous executions on the same Goal-t09 instance. It does not depict a live Meta-agent diagnostic session. Round 1 fails on this instance even though its aggregate result is 9/16.
- Case-study playback is 2× simulated physical time; inference waiting time is omitted. Final frames are held to align the comparison. This processing does not apply to the main project video.
- The Goal-T heatmap displays candidate outcomes. Its gains and lower curve use selected versions; dotted cells retain a result after development ends.
- `goal-t09-sources.json` records the video correspondence and processing information.

Use the actual paper and verified result tables when updating content. The page does not report an arXiv identifier until one is confirmed.
