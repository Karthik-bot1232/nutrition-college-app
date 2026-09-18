import { fmt, titleCase } from '../theme';

/** One menu item at a glance: name, calories, protein.

    Deliberately two numbers. The card's job is to let you skim a station and
    decide what to open; carbs, fat, fibre, sugar and sodium are all one tap
    away and putting them here turns a list into a spreadsheet. */
export default function ItemCard({ item, onOpen, onAdd, inPlate, excluded = [] }) {
  const hits = item.allergens.filter(a => excluded.includes(a));
  const unknown = !item.allergenDataPublished;

  return (
    <li className="card">
      <button className="card__main" onClick={() => onOpen(item)}>
        <div className="card__head">
          <h3 className="card__name">{item.name}</h3>
          <p className="card__serving">{item.servingSize}</p>
        </div>

        <div className="card__nums">
          <span className="num num--cal">
            <b>{fmt(item.calories)}</b>
            <span>cal</span>
          </span>
          <span className="num num--protein" data-zero={Math.round(item.protein ?? 0) > 0 ? '0' : '1'}>
            <b>{fmt(item.protein, 'g')}</b>
            <span>protein</span>
          </span>
        </div>

        <div className="card__tags">
          {item.dietaryTags.map(t => (
            <span key={t} className="tag tag--diet">{titleCase(t)}</span>
          ))}
          {hits.length > 0 && (
            <span className="tag tag--danger">
              Contains {hits.map(titleCase).join(', ')}
            </span>
          )}
          {hits.length === 0 && unknown && (
            <span className="tag tag--unknown">No allergen data</span>
          )}
        </div>
      </button>

      <button
        className="card__add"
        data-in={inPlate ? '1' : '0'}
        aria-label={`${inPlate ? 'Remove' : 'Add'} ${item.name} ${inPlate ? 'from' : 'to'} plate`}
        onClick={() => onAdd(item)}
      >
        {inPlate ? '✓' : '+'}
      </button>
    </li>
  );
}
