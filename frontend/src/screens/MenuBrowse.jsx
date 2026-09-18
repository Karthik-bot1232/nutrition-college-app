import { useMemo, useState } from 'react';
import Icon from '../components/Icon';
import ItemCard from '../components/ItemCard';
import ItemSheet from '../components/ItemSheet';
import FilterSheet from '../components/FilterSheet';
import { titleCase } from '../theme';

const SORTS = [
  { id: 'station', label: 'By station' },
  { id: 'protein', label: 'High protein' },
  { id: 'calories', label: 'Low calorie' },
];

export default function MenuBrowse({
  items, halls, meals, allergens, dietaryTags,
  hall, meal, onHall, onMeal,
  plate, onToggleItem,
  excluded, diets, onToggleAllergen, onToggleDiet, onResetFilters,
}) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('station');
  const [open, setOpen] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const inPlate = id => plate.some(p => p.item.id === id);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(i => {
      if (i.diningHall !== hall || i.mealPeriod !== meal) return false;
      if (q && !i.name.toLowerCase().includes(q)) return false;
      if (diets.length && !diets.every(d => i.dietaryTags.includes(d))) return false;
      if (excluded.length) {
        // An item nobody published allergens for is hidden rather than treated
        // as safe -- the whole point of the filter is not to guess.
        if (!i.allergenDataPublished) return false;
        if (excluded.some(a => i.allergens.includes(a))) return false;
      }
      return true;
    });
  }, [items, hall, meal, query, diets, excluded]);

  const groups = useMemo(() => {
    if (sort !== 'station') {
      const rows = [...visible].sort((a, b) =>
        sort === 'protein'
          ? (b.protein ?? -1) - (a.protein ?? -1)
          : (a.calories ?? 1e9) - (b.calories ?? 1e9));
      return [{ station: sort === 'protein' ? 'Highest protein' : 'Fewest calories', items: rows }];
    }
    const by = new Map();
    visible.forEach(i => {
      if (!by.has(i.station)) by.set(i.station, []);
      by.get(i.station).push(i);
    });
    return [...by.entries()]
      .map(([station, rows]) => ({ station, items: rows.sort((a, b) => a.name.localeCompare(b.name)) }))
      .sort((a, b) => a.station.localeCompare(b.station));
  }, [visible, sort]);

  const filterCount = excluded.length + diets.length;

  return (
    <div className="screen">
      <header className="head">
        <div className="wrap">
          <div className="head__row">
            <div>
              <p className="head__eyebrow">Dining hall</p>
              <label className="hallpick">
                <select value={hall} onChange={e => onHall(e.target.value)}>
                  {halls.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <span className="hallpick__value">
                  {hall}
                  <Icon name="chevron" size={16} />
                </span>
              </label>
            </div>
          </div>

          <div className="segmented" role="tablist" aria-label="Meal period">
            {meals.map(m => (
              <button
                key={m}
                role="tab"
                aria-selected={m === meal}
                onClick={() => onMeal(m)}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="searchrow">
            <div className="search">
              <Icon name="search" size={17} className="search__icon" />
              <input
                type="search"
                value={query}
                placeholder="Search items…"
                aria-label="Search items"
                onChange={e => setQuery(e.target.value)}
              />
              {query && (
                <button className="search__clear" aria-label="Clear search" onClick={() => setQuery('')}>
                  <Icon name="close" size={15} />
                </button>
              )}
            </div>
            <button className="iconbtn" onClick={() => setFiltersOpen(true)} aria-label="Filters">
              <Icon name="filter" size={19} />
              {filterCount > 0 && <span className="iconbtn__badge">{filterCount}</span>}
            </button>
          </div>

          <div className="chiprow">
            {SORTS.map(s => (
              <button
                key={s.id}
                className="chip"
                aria-pressed={sort === s.id}
                onClick={() => setSort(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {filterCount > 0 && (
            <div className="chiprow chiprow--active">
              {excluded.map(a => (
                <button key={a} className="activechip activechip--danger"
                        onClick={() => onToggleAllergen(a)}>
                  No {titleCase(a)}<Icon name="close" size={13} />
                </button>
              ))}
              {diets.map(d => (
                <button key={d} className="activechip" onClick={() => onToggleDiet(d)}>
                  {titleCase(d)}<Icon name="close" size={13} />
                </button>
              ))}
              <button className="activechip activechip--clear" onClick={onResetFilters}>
                Clear all
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="wrap">
        <p className="resultline">
          <strong>{visible.length}</strong> item{visible.length === 1 ? '' : 's'}
          {filterCount > 0 && ' matching your filters'}
        </p>

        {visible.length === 0 ? (
          <div className="empty">
            <div className="empty__icon"><Icon name="search" size={26} /></div>
            <h2>Nothing matches</h2>
            <p>
              {query
                ? <>No {meal.toLowerCase()} item at {hall} matches &ldquo;{query}&rdquo;.</>
                : <>Nothing on this {meal.toLowerCase()} menu fits the filters you have set.</>}
            </p>
            {(query || filterCount > 0) && (
              <button className="btn btn--ghost" onClick={() => { setQuery(''); onResetFilters(); }}>
                Clear search and filters
              </button>
            )}
          </div>
        ) : (
          groups.map(g => (
            <section className="station" key={g.station}>
              <h2 className="station__head">
                {g.station}
                <span>{g.items.length}</span>
              </h2>
              <ul className="cards">
                {g.items.map(i => (
                  <ItemCard
                    key={i.id}
                    item={i}
                    excluded={excluded}
                    inPlate={inPlate(i.id)}
                    onOpen={setOpen}
                    onAdd={onToggleItem}
                  />
                ))}
              </ul>
            </section>
          ))
        )}
      </main>

      <ItemSheet
        item={open}
        excluded={excluded}
        inPlate={open ? inPlate(open.id) : false}
        onClose={() => setOpen(null)}
        onAdd={item => { onToggleItem(item); setOpen(null); }}
      />

      <FilterSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        allergens={allergens}
        dietaryTags={dietaryTags}
        excluded={excluded}
        diets={diets}
        onToggleAllergen={onToggleAllergen}
        onToggleDiet={onToggleDiet}
        onReset={onResetFilters}
      />
    </div>
  );
}
