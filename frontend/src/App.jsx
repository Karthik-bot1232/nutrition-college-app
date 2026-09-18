import { useMemo, useState } from 'react';
import BottomNav from './components/BottomNav';
import Icon from './components/Icon';
import MenuBrowse from './screens/MenuBrowse';
import { DINING_HALLS, MEAL_PERIODS, ALLERGENS, DIETARY_TAGS, MENU_ITEMS } from './mockData';

/** Placeholder for the screens still to be built, so the nav is honest about
    what exists rather than dropping you on a blank page. */
function Stub({ title, body }) {
  return (
    <div className="screen">
      <div className="wrap">
        <div className="empty empty--tall">
          <div className="empty__icon"><Icon name="plate" size={26} /></div>
          <h2>{title}</h2>
          <p>{body}</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState('menu');
  const [hall, setHall] = useState(DINING_HALLS[0]);
  const [meal, setMeal] = useState(MEAL_PERIODS[1] ?? MEAL_PERIODS[0]);
  const [plate, setPlate] = useState([]);
  const [excluded, setExcluded] = useState([]);
  const [diets, setDiets] = useState([]);

  const toggle = (list, set, value) =>
    set(list.includes(value) ? list.filter(v => v !== value) : [...list, value]);

  /** Plate entries carry their own multiplier, so the same item can be on the
      plate once at 2x rather than twice. */
  const toggleItem = item =>
    setPlate(p => p.some(e => e.item.id === item.id)
      ? p.filter(e => e.item.id !== item.id)
      : [...p, { item, multiplier: 1 }]);

  const allergenList = useMemo(() => ALLERGENS, []);

  return (
    <div className="app">
      {tab === 'menu' && (
        <MenuBrowse
          items={MENU_ITEMS}
          halls={DINING_HALLS}
          meals={MEAL_PERIODS}
          allergens={allergenList}
          dietaryTags={DIETARY_TAGS}
          hall={hall}
          meal={meal}
          onHall={setHall}
          onMeal={setMeal}
          plate={plate}
          onToggleItem={toggleItem}
          excluded={excluded}
          diets={diets}
          onToggleAllergen={a => toggle(excluded, setExcluded, a)}
          onToggleDiet={d => toggle(diets, setDiets, d)}
          onResetFilters={() => { setExcluded([]); setDiets([]); }}
        />
      )}

      {tab === 'plate' && (
        <Stub
          title="Plate builder"
          body="Next screen up. Items you add from Menu will land here with serving multipliers and live totals."
        />
      )}
      {tab === 'track' && (
        <Stub title="Daily tracker" body="Log plates into breakfast, lunch and dinner, with daily totals against your targets." />
      )}
      {tab === 'more' && (
        <Stub title="More" body="Macro targets, meal suggestions, favorites and the weekly view live here." />
      )}

      <BottomNav tab={tab} onTab={setTab} plateCount={plate.length} />
    </div>
  );
}
