import { useEffect, useRef } from 'react';
import Icon from './Icon';

/** A bottom sheet. Closes on Escape and on the backdrop, restores focus to
    whatever opened it, and traps nothing it does not need to -- the native
    <dialog> gives modality and the top layer for free. */
export default function Sheet({ open, onClose, title, subtitle, children, footer }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onCancel = e => { e.preventDefault(); onClose(); };
    el.addEventListener('cancel', onCancel);
    return () => el.removeEventListener('cancel', onCancel);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      className="sheet"
      onClick={e => { if (e.target === ref.current) onClose(); }}
    >
      <div className="sheet__body">
        <div className="sheet__grip" aria-hidden="true" />
        <header className="sheet__head">
          <div className="sheet__titles">
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="sheet__close" onClick={onClose} aria-label="Close">
            <Icon name="close" size={18} />
          </button>
        </header>
        <div className="sheet__content">{children}</div>
        {footer && <div className="sheet__foot">{footer}</div>}
      </div>
    </dialog>
  );
}
