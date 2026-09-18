/* Stroke icons at a single weight. Emoji are font-dependent and cannot be
   themed, so everything structural is drawn here. */
const paths = {
  menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h10" /></>,
  plate: <><circle cx="12" cy="12" r="8.2" /><circle cx="12" cy="12" r="3.4" /></>,
  track: <><path d="M4 19V5" /><path d="M4 19h16" /><path d="M8 16v-5" /><path d="M13 16V8" /><path d="M18 16v-3" /></>,
  more: <><circle cx="5" cy="12" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="19" cy="12" r="1.4" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.6-3.6" /></>,
  filter: <><path d="M4 6h16" /><path d="M7 12h10" /><path d="M10 18h4" /></>,
  close: <><path d="M6 6l12 12" /><path d="M18 6L6 18" /></>,
  chevron: <path d="M6 9l6 6 6-6" />,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  check: <path d="M4.5 12.5l5 5 10-11" />,
  warn: <><path d="M12 3.6 2.6 20h18.8L12 3.6Z" /><path d="M12 10v4.2" /><path d="M12 17.1v.1" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 7.6v.6" /></>,
};

export default function Icon({ name, size = 20, className = '', ...rest }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
