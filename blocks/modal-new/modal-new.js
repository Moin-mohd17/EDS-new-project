export default function decorate(block) {
  const title = block.querySelector('p:first-child');
  const content = block.querySelector('p:nth-child(2)');
  const buttons = block.querySelectorAll('button');

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.hidden = true;

  const modal = document.createElement('div');
  modal.className = 'modal-container';
  modal.innerHTML = `
    <h2>${title.textContent}</h2>
    <p>${content.textContent}</p>
  `;

  buttons.forEach((btn) => modal.append(btn));
  overlay.append(modal);
  document.body.append(overlay);

  document.querySelectorAll('[data-open-modal]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      overlay.hidden = false;
    });
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.hidden = true;
  });
}
