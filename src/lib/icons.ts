import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Clapperboard,
  Coffee,
  Dumbbell,
  Hammer,
  PawPrint,
  Pill,
  Scissors,
  ShoppingCart,
  Smartphone,
  Utensils,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  utensils: Utensils,
  pill: Pill,
  hammer: Hammer,
  "shopping-cart": ShoppingCart,
  scissors: Scissors,
  dumbbell: Dumbbell,
  "paw-print": PawPrint,
  clapperboard: Clapperboard,
  coffee: Coffee,
  smartphone: Smartphone,
  "book-open": BookOpen,
};

export function categoryIcon(slugOrIcon?: string) {
  if (!slugOrIcon) return Utensils;
  return CATEGORY_ICONS[slugOrIcon] ?? Utensils;
}
