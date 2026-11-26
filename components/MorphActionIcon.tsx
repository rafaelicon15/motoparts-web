'use client';

import { MorphIcon, type IconInput } from 'morphicons/react';
import {
  ArrowRight,
  Check,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingCart,
  Truck,
  X,
} from 'lucide';

type MorphIconName =
  | 'search'
  | 'close'
  | 'cart'
  | 'check'
  | 'arrow-right'
  | 'truck'
  | 'shield'
  | 'package';

const iconMap: Record<MorphIconName, IconInput> = {
  search: Search,
  close: X,
  cart: ShoppingCart,
  check: Check,
  'arrow-right': ArrowRight,
  truck: Truck,
  shield: ShieldCheck,
  package: PackageCheck,
};

type Props = {
  name: MorphIconName;
  size?: number;
  className?: string;
  label?: string;
  spring?: 'snappy' | 'smooth' | 'bouncy';
};

export default function MorphActionIcon({
  name,
  size = 18,
  className,
  label,
  spring = 'snappy',
}: Props) {
  return (
    <MorphIcon
      icon={iconMap[name]}
      size={size}
      className={className}
      label={label}
      spring={spring}
      reducedMotion="user"
      strokeWidth={2}
    />
  );
}
