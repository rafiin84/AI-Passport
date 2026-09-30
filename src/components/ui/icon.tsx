import {
  House, BookOpenText, Compass, Target, IdentificationCard, Rocket, Medal, UserCircle, SquaresFour, BookBookmark, ListChecks, UsersThree, FileMagnifyingGlass, Certificate,
  ChartLineUp, Article, GearSix, Lightning, Cube, Leaf, Heartbeat, Books, Translate, Robot, GraduationCap, Plant, Bank, CloudSun, Coins, Wheelchair, Storefront, Hammer,
  PaintBrush, RocketLaunch, Lightbulb, Star, type IconProps,
} from "@phosphor-icons/react";
import type { ComponentType } from "react";

const REGISTRY: Record<string, ComponentType<IconProps>> = {
  House, BookOpenText, Compass, Target, IdentificationCard, Rocket, Medal, UserCircle, SquaresFour, BookBookmark, ListChecks, UsersThree, FileMagnifyingGlass, Certificate,
  ChartLineUp, Article, GearSix, Lightning, Cube, Leaf, Heartbeat, Books, Translate, Robot, GraduationCap, Plant, Bank, CloudSun, Coins, Wheelchair, Storefront, Hammer,
  PaintBrush, RocketLaunch, Lightbulb, Star,
};

export function Icon({ name, ...props }: { name: string } & IconProps) {
  const C = REGISTRY[name] ?? Star;
  return <C aria-hidden="true" {...props} />;
}
