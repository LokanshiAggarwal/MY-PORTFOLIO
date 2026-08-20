import type { ReactNode } from 'react';
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiAngular,
  SiBootstrap,
} from 'react-icons/si';

/**
 * Technology → icon map.
 * Used for the glassmorphism tech chips inside each project scene.
 */
const ICONS: Record<string, ReactNode> = {
  HTML: <SiHtml5 />,
  CSS: <SiCss />,
  JavaScript: <SiJavascript />,
  'Node.js': <SiNodedotjs />,
  Express: <SiExpress />,
  MongoDB: <SiMongodb />,
  React: <SiReact />,
  TypeScript: <SiTypescript />,
  Tailwind: <SiTailwindcss />,
  Angular: <SiAngular />,
  Bootstrap: <SiBootstrap />,
};

export const techIcon = (name: string): ReactNode => ICONS[name] ?? null;

export default techIcon;
