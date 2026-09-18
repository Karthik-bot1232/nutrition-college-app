import Sheet from './Sheet';
import { FULL_NUTRIENTS, MACROS, fmt, titleCase } from '../theme';

/** Full label for one item: every nutrient, both allergen states, and the
    action. */
export default function ItemSheet({ item, onClose, onAdd, inPlate, excluded = [] }) {
  if (!item) return null;
  const hits = item.allergens.filter(a => excluded.includes(a));
  const macros = MACROS.filter(m => m.key !== 'calories');

  return (
    <Sheet
      open={!!item}
      onClose={onClose}
      title={item.name}
      subtitle={`${item.servingSize} · ${item.station} · ${item.diningHall}`}
      footer={
        <button className="btn btn--primary btn--block" onClick={() => onAdd(item)}>
          {inPlate ? 'Remove from plate' : 'Add to plate'}
        </button>
      }
    >
      {hits.length > 0 && (
        <div className="alert alert--danger" role="alert">
          <span className="alert__icon" aria-hidden="true">!</span>
          <div>
            <strong>Contains {hits.map(titleCase).join(', ')}</strong>
            <p>You have excluded {hits.length === 1 ? 'this allergen' : 'these allergens'}.</p>
          </div>
        </div>
      )}

      <div className="bignums">
        <div className="bignum bignum--cal">
          <b>{fmt(item.calories)}</b>
          <span>Calories</span>
        </div>
        {macros.map(m => (
          <div key={m.key} className={`bignum bignum--${m.key}`}>
            <b>{fmt(item[m.key], m.unit)}</b>
            <span>{m.label}</span>
          </div>
        ))}
      </div>

      <h3 className="sheet__h3">Full label</h3>
      <table className="nutrients">
        <tbody>
          {FULL_NUTRIENTS.map(n => (
            <tr key={n.key} className={n.indent ? 'is-sub' : undefined}>
              <th scope="row">{n.label}</th>
              <td>{fmt(item[n.key], n.unit)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="sheet__h3">Allergens</h3>
      {item.allergenDataPublished ? (
        item.allergens.length ? (
          <div className="chips">
            {item.allergens.map(a => (
              <span
                key={a}
                className={`tag ${excluded.includes(a) ? 'tag--danger' : 'tag--allergen'}`}
              >
                {titleCase(a)}
              </span>
            ))}
          </div>
        ) : (
          <p className="muted">None listed on the published label.</p>
        )
      ) : (
        <p className="muted">
          This hall published no allergen information for this item. That is not a
          claim that it is free of anything.
        </p>
      )}

      {item.dietaryTags.length > 0 && (
        <>
          <h3 className="sheet__h3">Dietary</h3>
          <div className="chips">
            {item.dietaryTags.map(t => (
              <span key={t} className="tag tag--diet">{titleCase(t)}</span>
            ))}
          </div>
        </>
      )}
    </Sheet>
  );
}
