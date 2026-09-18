import Sheet from './Sheet';
import { titleCase } from '../theme';

export default function FilterSheet({
  open, onClose, allergens, dietaryTags, excluded, diets, onToggleAllergen, onToggleDiet, onReset,
}) {
  const count = excluded.length + diets.length;
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Filters"
      subtitle="Narrow the menu to what you can actually eat"
      footer={
        <div className="sheet__actions">
          <button className="btn btn--ghost" onClick={onReset} disabled={!count}>
            Clear all
          </button>
          <button className="btn btn--primary" onClick={onClose}>
            {count ? `Show results` : 'Done'}
          </button>
        </div>
      }
    >
      <h3 className="sheet__h3">Exclude allergens</h3>
      <div className="chips">
        {allergens.map(a => (
          <button
            key={a}
            className="chip chip--danger"
            aria-pressed={excluded.includes(a)}
            onClick={() => onToggleAllergen(a)}
          >
            {titleCase(a)}
          </button>
        ))}
      </div>
      <p className="hint">
        Items whose hall published no allergen data are hidden while an exclusion is
        on, because &ldquo;nothing published&rdquo; is not the same as &ldquo;free of it&rdquo;.
      </p>

      <h3 className="sheet__h3">Dietary</h3>
      <div className="chips">
        {dietaryTags.map(t => (
          <button
            key={t}
            className="chip chip--diet"
            aria-pressed={diets.includes(t)}
            onClick={() => onToggleDiet(t)}
          >
            {titleCase(t)}
          </button>
        ))}
      </div>
    </Sheet>
  );
}
