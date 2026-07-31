import React from 'react';
import { 
  Stethoscope, 
  Heart, 
  Activity, 
  Baby, 
  ShieldAlert,
  Droplet,
  Droplets,
  Wind,
  Home,
  Ear,
  Smile,
  Scissors,
  ScanLine,
  HeartHandshake,
  Utensils,
  Bone,
  Siren,
  LucideProps
} from 'lucide-react';

export interface DepartmentTheme {
  bgTint: string;        // Soft pastel tint background for header/icon block
  borderTint: string;    // Soft border tint for header/icon block
  textTint: string;      // Dark accent text color
  iconColor: string;     // Matching icon color
  badgeBg: string;       // Badge background tint
  badgeText: string;     // Badge text color
}

export const DEPARTMENT_THEMES: Record<string, DepartmentTheme> = {
  'cardiology': {
    bgTint: 'bg-rose-50/90',
    borderTint: 'border-rose-200/70',
    textTint: 'text-rose-900',
    iconColor: 'text-rose-600',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-800'
  },
  'orthopedics': {
    bgTint: 'bg-amber-50/90',
    borderTint: 'border-amber-200/70',
    textTint: 'text-amber-950',
    iconColor: 'text-amber-600',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900'
  },
  'pediatrics': {
    bgTint: 'bg-sky-50/90',
    borderTint: 'border-sky-200/70',
    textTint: 'text-sky-950',
    iconColor: 'text-sky-600',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-900'
  },
  'obs-gyn': {
    bgTint: 'bg-purple-50/90',
    borderTint: 'border-purple-200/70',
    textTint: 'text-purple-950',
    iconColor: 'text-purple-600',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-900'
  },
  'radiology-sonology': {
    bgTint: 'bg-indigo-50/90',
    borderTint: 'border-indigo-200/70',
    textTint: 'text-indigo-950',
    iconColor: 'text-indigo-600',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-900'
  },
  'diabetology': {
    bgTint: 'bg-orange-50/90',
    borderTint: 'border-orange-200/70',
    textTint: 'text-orange-950',
    iconColor: 'text-orange-600',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-900'
  },
  'chest-pulmonology': {
    bgTint: 'bg-teal-50/90',
    borderTint: 'border-teal-200/70',
    textTint: 'text-teal-950',
    iconColor: 'text-teal-600',
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-900'
  },
  'gastroenterology': {
    bgTint: 'bg-amber-100/60',
    borderTint: 'border-amber-300/60',
    textTint: 'text-amber-950',
    iconColor: 'text-amber-700',
    badgeBg: 'bg-amber-200/70',
    badgeText: 'text-amber-950'
  },
  'family-medicine': {
    bgTint: 'bg-emerald-50/90',
    borderTint: 'border-emerald-200/70',
    textTint: 'text-emerald-950',
    iconColor: 'text-emerald-600',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-900'
  },
  'dialysis': {
    bgTint: 'bg-cyan-50/90',
    borderTint: 'border-cyan-200/70',
    textTint: 'text-cyan-950',
    iconColor: 'text-cyan-600',
    badgeBg: 'bg-cyan-100',
    badgeText: 'text-cyan-900'
  },
  'ent': {
    bgTint: 'bg-violet-50/90',
    borderTint: 'border-violet-200/70',
    textTint: 'text-violet-950',
    iconColor: 'text-violet-600',
    badgeBg: 'bg-violet-100',
    badgeText: 'text-violet-900'
  },
  'dental': {
    bgTint: 'bg-emerald-50/90',
    borderTint: 'border-emerald-200/70',
    textTint: 'text-emerald-950',
    iconColor: 'text-emerald-600',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-900'
  },
  'emergency-247': {
    bgTint: 'bg-red-50/90',
    borderTint: 'border-red-200/80',
    textTint: 'text-red-950',
    iconColor: 'text-red-600',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-900'
  },
  'gen-physician': {
    bgTint: 'bg-emerald-50/90',
    borderTint: 'border-emerald-200/70',
    textTint: 'text-emerald-950',
    iconColor: 'text-emerald-600',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-900'
  },
  'gen-lap-surgery': {
    bgTint: 'bg-slate-100/90',
    borderTint: 'border-slate-300/70',
    textTint: 'text-slate-900',
    iconColor: 'text-slate-700',
    badgeBg: 'bg-slate-200/80',
    badgeText: 'text-slate-900'
  }
};

export const DEFAULT_DEPARTMENT_THEME: DepartmentTheme = {
  bgTint: 'bg-emerald-50/90',
  borderTint: 'border-emerald-200/70',
  textTint: 'text-emerald-950',
  iconColor: 'text-emerald-600',
  badgeBg: 'bg-emerald-100',
  badgeText: 'text-emerald-900'
};

export function getDepartmentTheme(deptId: string): DepartmentTheme {
  const normalizedId = deptId.toLowerCase();
  return DEPARTMENT_THEMES[normalizedId] || DEFAULT_DEPARTMENT_THEME;
}

interface DepartmentIconProps extends LucideProps {
  iconType: string;
  deptId?: string;
}

export const DepartmentIcon: React.FC<DepartmentIconProps> = ({ iconType, deptId, ...props }) => {
  const normalized = (deptId || iconType || '').toLowerCase();

  if (normalized.includes('cardiology') || iconType === 'heart') {
    return <Heart {...props} />;
  }
  if (normalized.includes('orthopedics') || iconType === 'bone') {
    return <Bone {...props} />;
  }
  if (normalized.includes('pediatrics') || iconType === 'baby') {
    return <Baby {...props} />;
  }
  if (normalized.includes('obs-gyn') || normalized.includes('gynaec')) {
    return <HeartHandshake {...props} />;
  }
  if (normalized.includes('radiology') || iconType === 'flask') {
    return <ScanLine {...props} />;
  }
  if (normalized.includes('diabetology')) {
    return <Droplet {...props} />;
  }
  if (normalized.includes('chest') || normalized.includes('pulmonology')) {
    return <Wind {...props} />;
  }
  if (normalized.includes('gastro')) {
    return <Utensils {...props} />;
  }
  if (normalized.includes('family')) {
    return <Home {...props} />;
  }
  if (normalized.includes('dialysis')) {
    return <Droplets {...props} />;
  }
  if (normalized.includes('ent')) {
    return <Ear {...props} />;
  }
  if (normalized.includes('dental')) {
    return <Smile {...props} />;
  }
  if (normalized.includes('emergency') || iconType === 'shield-alert') {
    return <Siren {...props} />;
  }
  if (normalized.includes('surgery') || normalized.includes('surgical')) {
    return <Scissors {...props} />;
  }
  if (iconType === 'activity') {
    return <Activity {...props} />;
  }

  return <Stethoscope {...props} />;
};

