import Icon from './Icon';

const TABS = [
  { id: 'menu', label: 'Menu', icon: 'menu' },
  { id: 'plate', label: 'Plate', icon: 'plate' },
  { id: 'track', label: 'Track', icon: 'track' },
  { id: 'more', label: 'More', icon: 'more' },
];

export default function BottomNav({ tab, onTab, plateCount = 0 }) {
  return (
    <nav className="nav" aria-label="Sections">
      <div className="nav__inner">
        {TABS.map(t => (
          <button
            key={t.id}
            className="nav__tab"
            aria-current={tab === t.id ? 'page' : undefined}
            onClick={() => onTab(t.id)}
          >
            <span className="nav__iconwrap">
              <Icon name={t.icon} size={22} />
              {t.id === 'plate' && plateCount > 0 && (
                <span className="nav__badge">{plateCount}</span>
              )}
            </span>
            <span className="nav__label">{t.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
