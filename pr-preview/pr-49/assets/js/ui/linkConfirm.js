import { LINK_CONFIRM } from '../config/constants.js';

const canHover = () => window.matchMedia?.('(hover: hover)').matches ?? true;

// A link needs confirming when the click can't have shown a URL preview first:
// a touch or pen tap, or (when the event doesn't say) a device with no hover.
export function needsLinkConfirm(event) {
    const type = event?.pointerType;
    return type ? type !== 'mouse' : !canHover();
}

let openDialog = null;

// Asks before opening `url` in a new tab. Go is a real <a> so the new tab
// opens straight from the user's tap, which popup blockers allow.
export function confirmLink(url, prompt) {
    openDialog?.close();
    const C = LINK_CONFIRM;

    const backdrop = document.createElement('div');
    backdrop.style.cssText = [
        'position:fixed', 'inset:0', 'z-index:9999',
        'display:flex', 'align-items:center', 'justify-content:center',
        `background:${C.BACKDROP}`, 'padding:16px',
    ].join(';');

    const box = document.createElement('div');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.style.cssText = [
        `background:${C.BG}`, `color:${C.TEXT}`,
        'padding:18px 20px', 'border-radius:12px', 'max-width:320px', 'width:100%',
        'font:15px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
        'box-shadow:0 8px 28px rgba(0,0,0,0.5)', 'backdrop-filter:blur(6px)',
        'text-align:center',
    ].join(';');

    const text = document.createElement('p');
    text.style.cssText = 'margin:0 0 16px;';
    text.textContent = prompt ?? `Open ${new URL(url).host} in a new tab?`;

    const buttons = document.createElement('div');
    buttons.style.cssText = 'display:flex;gap:10px;justify-content:center;';
    const btnCss = 'flex:1;padding:10px 0;border-radius:8px;font:inherit;' +
        'font-weight:600;cursor:pointer;text-decoration:none;text-align:center;';

    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.textContent = 'Cancel';
    cancel.style.cssText = btnCss + `background:transparent;color:${C.TEXT};border:1px solid ${C.TEXT};`;

    const go = document.createElement('a');
    go.href   = url;
    go.target = '_blank';
    go.rel    = 'noopener noreferrer';
    go.textContent = 'Go';
    go.style.cssText = btnCss + `background:${C.ACCENT};color:${C.BG_SOLID};border:1px solid ${C.ACCENT};`;

    const close = () => {
        backdrop.remove();
        document.removeEventListener('keydown', onKey);
        if (openDialog === dialog) openDialog = null;
    };
    const onKey = e => { if (e.key === 'Escape') close(); };
    const dialog = { close };

    cancel.addEventListener('click', close);
    go.addEventListener('click', close);
    backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
    document.addEventListener('keydown', onKey);

    buttons.append(cancel, go);
    box.append(text, buttons);
    backdrop.appendChild(box);
    document.body.appendChild(backdrop);
    go.focus();
    openDialog = dialog;
}
