import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { C, R, T, TAP } from '../lib/theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export function Icon({ name, size = 18, color = C.text2 }: { name: IconName; size?: number; color?: string }) {
  return <Ionicons name={name} size={size} color={color} />;
}

/* ------------------------------------------------------------ type */

export function H1({ children }: { children: ReactNode }) {
  return <Text style={s.h1} accessibilityRole="header">{children}</Text>;
}

export function Muted({ children, style }: { children: ReactNode; style?: object }) {
  return <Text style={[s.muted, style]}>{children}</Text>;
}

export function Hint({ children, center }: { children: ReactNode; center?: boolean }) {
  return <Text style={[s.hint, center && { textAlign: 'center' }]}>{children}</Text>;
}

/* ------------------------------------------------------------ boxes */

export function Panel({ children, style, flush }: { children: ReactNode; style?: StyleProp<ViewStyle>; flush?: boolean }) {
  return <View style={[s.panel, flush && { padding: 0 }, style]}>{children}</View>;
}

export function SectionHead({ icon, title, action, onAction, sub }: {
  icon?: IconName; title: string; action?: string; onAction?: () => void; sub?: string;
}) {
  return (
    <View style={s.sectionHead}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {icon && <Icon name={icon} size={16} color={C.text2} />}
          <Text style={s.sectionTitle} accessibilityRole="header">{title}</Text>
        </View>
        {sub ? <Text style={s.sectionSub}>{sub}</Text> : null}
      </View>
      {action && <LinkBtn label={action} onPress={onAction} />}
    </View>
  );
}

export function Notice({ children, tone = 'warn' }: { children: ReactNode; tone?: 'warn' | 'info' }) {
  return (
    <View style={[s.notice, tone === 'info' && { backgroundColor: C.card2 }]}>
      <Icon name={tone === 'warn' ? 'warning-outline' : 'information-circle-outline'} size={18}
            color={tone === 'warn' ? C.warn : C.text2} />
      <Text style={s.noticeText}>{children}</Text>
    </View>
  );
}

export function Empty({ icon = 'search', title, body, children }: {
  icon?: IconName; title: string; body?: string; children?: ReactNode;
}) {
  return (
    <View style={s.empty}>
      <View style={s.emptyIcon}><Icon name={icon} size={22} color={C.text2} /></View>
      <Text style={s.emptyTitle}>{title}</Text>
      {body ? <Text style={s.emptyBody}>{body}</Text> : null}
      {children ? <View style={{ gap: 8, marginTop: 8, alignSelf: 'stretch' }}>{children}</View> : null}
    </View>
  );
}

export function Loading({ label }: { label?: string }) {
  return (
    <View style={{ padding: 32, alignItems: 'center', gap: 12 }}>
      <ActivityIndicator color={C.text2} />
      {label ? <Text style={s.muted}>{label}</Text> : null}
    </View>
  );
}

/* ------------------------------------------------------------ controls */

export function Btn({ label, onPress, icon, kind = 'primary', small, disabled, style }: {
  label: string; onPress?: () => void; icon?: IconName; kind?: 'primary' | 'ghost';
  small?: boolean; disabled?: boolean; style?: StyleProp<ViewStyle>;
}) {
  const primary = kind === 'primary';
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={label}
      style={({ pressed }) => [s.btn, small && s.btnSm, primary ? s.btnPrimary : s.btnGhost,
        pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }, disabled && { opacity: 0.4 }, style]}>
      {icon && <Icon name={icon} size={small ? 16 : 18} color={primary ? C.onAccent : C.text} />}
      <Text style={[s.btnText, small && { fontSize: T.sm }, { color: primary ? C.onAccent : C.text }]}>{label}</Text>
    </Pressable>
  );
}

export function LinkBtn({ label, onPress, quiet }: { label: string; onPress?: () => void; quiet?: boolean }) {
  return (
    <Pressable onPress={onPress} hitSlop={10} accessibilityRole="button">
      <Text style={[s.link, quiet && { color: C.text2 }]}>{label}</Text>
    </Pressable>
  );
}

export function IconBtn({ name, onPress, label, color = C.text, active }: {
  name: IconName; onPress?: () => void; label: string; color?: string; active?: boolean;
}) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} hitSlop={6}
      style={({ pressed }) => [s.iconBtn, active && { backgroundColor: C.card2 }, pressed && { opacity: 0.7 }]}>
      <Icon name={name} size={20} color={color} />
    </Pressable>
  );
}

export function Chip({ label, on, onPress, icon, removable }: {
  label: string; on?: boolean; onPress?: () => void; icon?: IconName; removable?: boolean;
}) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: !!on }}
      style={({ pressed }) => [s.chip, on && s.chipOn, pressed && { opacity: 0.8 }]}>
      {icon && <Icon name={icon} size={14} color={on ? C.text : C.text2} />}
      <Text style={[s.chipText, on && { color: C.text }]}>{label}</Text>
      {removable && <Icon name="close" size={14} color={C.text2} />}
    </Pressable>
  );
}

type PillTone = 'warn' | 'protein' | 'diet' | 'unknown' | 'allergen' | 'hit';
const PILL: Record<PillTone, { bg: string; fg: string }> = {
  warn: { bg: C.warnWash, fg: C.warn },
  protein: { bg: C.proteinWash, fg: C.protein },
  diet: { bg: C.goodWash, fg: C.good },
  unknown: { bg: C.card2, fg: C.text2 },
  allergen: { bg: C.card2, fg: C.text2 },
  hit: { bg: C.dangerWash, fg: C.danger },
};

export function Pill({ label, tone }: { label: string; tone: PillTone }) {
  return (
    <View style={[s.pill, { backgroundColor: PILL[tone].bg }]}>
      <Text style={[s.pillText, { color: PILL[tone].fg }]}>{label}</Text>
    </View>
  );
}

export function Segmented<T extends string>({ options, value, onChange }: {
  options: { value: T; label: string; sub?: string; live?: boolean; disabled?: boolean }[];
  value: T; onChange: (v: T) => void;
}) {
  return (
    <View style={s.seg} accessibilityRole="tablist">
      {options.map(o => {
        const sel = o.value === value;
        return (
          <Pressable key={o.value} disabled={o.disabled} onPress={() => onChange(o.value)}
            accessibilityRole="tab" accessibilityState={{ selected: sel, disabled: o.disabled }}
            style={[s.segBtn, sel && s.segBtnOn, o.disabled && { opacity: 0.4 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              {o.live && <View style={s.liveDot} />}
              <Text style={[s.segText, sel && { color: C.text }]}>{o.label}</Text>
            </View>
            {o.sub ? <Text style={s.segSub}>{o.sub}</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

/* ------------------------------------------------------------ charts */

/** Calories against the day's target, as a ring. */
export function Ring({ value, target, size = 112, children }: {
  value: number; target: number; size?: number; children?: ReactNode;
}) {
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  const pct = target ? Math.min(value / target, 1) : 0;
  const over = target > 0 && value > target;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={C.card3} strokeWidth={12} fill="none" />
        {pct > 0 && (
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={over ? C.danger : C.accent} strokeWidth={12}
            fill="none" strokeLinecap="round" strokeDasharray={`${pct * c} ${c}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`} />
        )}
      </Svg>
      {children}
    </View>
  );
}

/** A labelled bar showing where a total lands against its target. */
export function GoalBar({ label, value, target, unit, color, ceiling }: {
  label: string; value: number; target: number; unit: string; color: string; ceiling?: boolean;
}) {
  const pct = target ? Math.min(value / target, 1.35) : 0;
  const state = !target ? 'none' : ceiling ? (value > target ? 'over' : 'ok')
    : pct >= 0.95 ? 'ok' : pct >= 0.7 ? 'near' : 'under';
  const fill = state === 'over' ? C.danger : color;
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={s.barLabel}>{label}</Text>
        <Text style={s.barValue}>{Math.round(value)}{unit}
          {target ? <Text style={{ color: C.text3, fontWeight: '500' }}> / {Math.round(target)}{unit}</Text> : null}
        </Text>
      </View>
      <View style={s.track}>
        <View style={[s.trackFill, { width: `${Math.min(pct, 1) * 100}%`, backgroundColor: fill }]} />
        {target > 0 && value > target * 0.08 && (
          <View style={[s.notch, { left: `${(1 / Math.max(pct, 1)) * 100}%` }]} />
        )}
      </View>
    </View>
  );
}

export const s = StyleSheet.create({
  h1: { color: C.text, fontSize: T.xl, fontWeight: '800', letterSpacing: -0.3 },
  muted: { color: C.text2, fontSize: T.md, lineHeight: 21 },
  hint: { color: C.text3, fontSize: T.sm, lineHeight: 18, marginTop: 8 },
  panel: { backgroundColor: C.card, borderRadius: R.card, padding: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: C.border },
  sectionHead: { flexDirection: 'row', alignItems: 'center', marginTop: 24, marginBottom: 10, gap: 8 },
  sectionTitle: { color: C.text, fontSize: T.lg, fontWeight: '700' },
  sectionSub: { color: C.text3, fontSize: T.sm, marginTop: 2 },
  notice: { flexDirection: 'row', gap: 10, backgroundColor: C.warnWash, padding: 12, borderRadius: R.ctl, marginVertical: 8, alignItems: 'flex-start' },
  noticeText: { color: C.text, fontSize: T.sm, lineHeight: 19, flex: 1 },
  empty: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24, gap: 8 },
  emptyIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.card2, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  emptyTitle: { color: C.text, fontSize: T.lg, fontWeight: '700', textAlign: 'center' },
  emptyBody: { color: C.text2, fontSize: T.md, lineHeight: 21, textAlign: 'center' },
  btn: { minHeight: TAP + 4, borderRadius: R.ctl, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 18 },
  btnSm: { minHeight: 36, paddingHorizontal: 12 },
  btnPrimary: { backgroundColor: C.accent },
  btnGhost: { backgroundColor: C.card2, borderWidth: StyleSheet.hairlineWidth, borderColor: C.borderControl },
  btnText: { fontSize: T.md, fontWeight: '700' },
  link: { color: C.accentText, fontSize: T.sm, fontWeight: '700' },
  iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 36, paddingHorizontal: 14, borderRadius: R.pill, backgroundColor: C.card, borderWidth: StyleSheet.hairlineWidth, borderColor: C.border },
  chipOn: { backgroundColor: C.accentWash, borderColor: C.accent },
  chipText: { color: C.text2, fontSize: T.sm, fontWeight: '600' },
  pill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: R.pill },
  pillText: { fontSize: T.xs, fontWeight: '700' },
  seg: { flexDirection: 'row', backgroundColor: C.card, borderRadius: R.ctl, padding: 4, gap: 4 },
  segBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 9, minHeight: TAP },
  segBtnOn: { backgroundColor: C.card3 },
  segText: { color: C.text2, fontSize: T.md, fontWeight: '700' },
  segSub: { color: C.text3, fontSize: T.xs, marginTop: 2 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.good },
  barLabel: { color: C.text2, fontSize: T.sm, fontWeight: '600' },
  barValue: { color: C.text, fontSize: T.sm, fontWeight: '700' },
  track: { height: 8, borderRadius: 4, backgroundColor: C.card3, overflow: 'visible' },
  trackFill: { height: 8, borderRadius: 4 },
  notch: { position: 'absolute', top: -3, width: 2, height: 14, backgroundColor: C.text, marginLeft: -1, borderRadius: 1 },
});
