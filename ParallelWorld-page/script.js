const tabs = [...document.querySelectorAll('[role="tab"]')];
function activateTab(tab, focus = false) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); activateTab(tabs[next], true); }
  });
});
const copyButton = document.getElementById('copy-bib');
copyButton.addEventListener('click', async () => {
  const citation = document.getElementById('bib-content');
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText(citation.textContent.trim());
    status.textContent = 'Citation copied to clipboard.';
    copyButton.textContent = 'Copied ✓';
    setTimeout(() => { copyButton.textContent = 'Copy citation'; }, 2000);
  } catch {
    const range = document.createRange();
    range.selectNodeContents(citation);
    const selection = window.getSelection();
    selection.removeAllRanges(); selection.addRange(range);
    status.textContent = 'Citation selected. Press Ctrl+C (or Command+C) to copy.';
  }
});
