/* ------------------------------------------------------------------ */
/* Projects data — typed content for the luxury agency showcase        */
/* ------------------------------------------------------------------ */

export type Layout = 'splitLeft' | 'splitRight' | 'centered' | 'offset';

export interface ProjectDetails {
  role: string;
  duration: string;
  technologies: string[];
  problem: string;
  solution: string;
  outcome: string;
}

export interface CaseStudySection {
  title: string;
  body: string;
  bullets?: string[];
}

export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  technology: string[];
  features: string[];
  description: string;
  layout: Layout;
  image: string;
  gallery: string[];
  liveUrl: string;
  githubUrl: string;
  details: ProjectDetails;
  caseStudy: CaseStudySection[];
}

const W = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const PROJECTS: Project[] = [
  /* ------------------------------------------------------------------ */
  /* 01 — PANJDHARA                                                      */
  /* ------------------------------------------------------------------ */
  {
    id: 'panjdhara',
    number: '01',
    title: 'PANJDHARA',
    category: 'Full Stack Website',
    technology: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express', 'MongoDB'],
    features: ['Responsive', 'Backend', 'Order System', 'Modern UI', 'Animations'],
    description:
      'A premium mustard oil brand website featuring responsive UI, backend integration, online ordering and modern branding.',
    layout: 'splitLeft',
    image: W('photo-1515003197210-e0cd71810b5f', 1600),
    gallery: ['/panjdhara1.png', '/panjdhara2.png', '/panjdhara3.png'],
liveUrl: 'https://github.com/',
    githubUrl: 'https://github.com/LokanshiAggarwal',
    details: {
      role: 'Design + Full-Stack Development',
      duration: '3 Weeks',
      technologies: ['Node.js', 'Express', 'MongoDB'],
      problem:
        'PANJDHARA is a mustard oil brand rooted in tradition, but its digital presence felt invisible — customers could not discover the story, understand the product or place an order online.',
      solution:
        'Designed an editorial, heritage-led brand experience and built a responsive site with a Node.js + Express API, a MongoDB product catalogue and a lightweight online ordering flow.',
      outcome:
        'A polished, animated brand website that positions PANJDHARA as a premium oil maker and gives customers a direct, trustworthy order channel.',
    },
    caseStudy: [
      {
        title: 'Problem',
        body: 'A heritage food brand with a rich product had no digital shelf. The site was static, disconnected from the brand story, and offered no way for customers to buy.',
        bullets: [
          'No brand identity or emotional narrative',
          'No online ordering path',
          'Broken mobile experience',
        ],
      },
      {
        title: 'Research',
        body: 'Studied heritage FMCG brands and regional food e-commerce to understand how trust is built online, then mapped a simple journey: discover the story, trust the product, place an order.',
        bullets: [
          'Competitor analysis of premium oil brands',
          'Journey: Discover → Trust → Order',
          'Mobile-first usage patterns',
        ],
      },
      {
        title: 'Wireframes',
        body: 'Sketched a single-page narrative — hero story, product showcase, cold-press process, testimonials — followed by a focused order flow with a persistent cart summary.',
      },
      {
        title: 'Design Process',
        body: 'Crafted a warm, artisanal visual language with golden tones, serif display type and oil-drop motifs, then translated it into a responsive interface with scroll-driven animations.',
      },
      {
        title: 'Final Solution',
        body: 'A modern brand website with a Node.js + Express API and a MongoDB-backed catalogue. Customers browse products, choose quantities and place orders directly from the page.',
        bullets: [
          'Responsive editorial layout',
          'Backend integration with Express + MongoDB',
          'End-to-end online ordering',
          'Modern branding and motion',
        ],
      },
      {
        title: 'Technologies',
        body: 'HTML, CSS, JavaScript, Node.js, Express, MongoDB — with GSAP for scroll choreography.',
      },
      {
        title: 'Challenges',
        body: 'Balancing a heritage brand voice with modern interaction patterns, designing a smooth order flow, and keeping the site fast on low-end mobile devices.',
      },
      {
        title: 'Key Learnings',
        body: 'Full-stack ownership taught me to design with data in mind — structuring the catalogue API first made the frontend, ordering and admin flows dramatically simpler.',
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 02 — Portfolio Website                                              */
  /* ------------------------------------------------------------------ */
  {
    id: 'portfolio',
    number: '02',
    title: 'Portfolio Website',
    category: 'Creative Portfolio',
    technology: ['React', 'TypeScript', 'Tailwind', 'GSAP', 'Framer Motion'],
    features: ['Storytelling', 'Editorial Layout', 'Immersive Interactions', 'Smooth Scroll'],
    description:
      'A cinematic portfolio focused on storytelling, editorial layouts and immersive interactions.',
    layout: 'splitRight',
    image: W('photo-1545235617-9465d2a55698', 1600),
    gallery: [
      W('photo-1518005020951-eccb494ad742', 800),
      W('photo-1559028012-481c04fa702d', 800),
      W('photo-1512756290469-ec264b7fbf87', 800),
    ],
liveUrl: 'https://github.com/',
    githubUrl: 'https://github.com/LokanshiAggarwal',
    details: {
      role: 'Design + Frontend Engineering',
      duration: '4 Weeks',
      technologies: ['React', 'TypeScript', 'GSAP'],
      problem:
        'I needed a portfolio that felt like the work I want to make — not a template. Most portfolios are static galleries that fail to hold attention or communicate craft.',
      solution:
        'Built this cinematic experience: a loader, custom cursor, Lenis smooth scroll, GSAP choreography and Framer Motion micro-interactions, all wrapped in an editorial design system.',
      outcome:
        'A portfolio that reads like a magazine and plays like a film — where scrolling, hovering and clicking all feel considered.',
    },
    caseStudy: [
      {
        title: 'Problem',
        body: 'A portfolio should be proof of craft. Static grids and default scroll undermine that. I wanted every interaction to demonstrate the same care I put into client work.',
      },
      {
        title: 'Research',
        body: 'Studied award-winning agency portfolios and interaction patterns — scroll choreography, magnetic UI, custom cursors and editorial typography systems.',
        bullets: [
          'Awwwards / FWA portfolio references',
          'Motion pacing and easing studies',
          'Lenis + GSAP ScrollTrigger integration',
        ],
      },
      {
        title: 'Wireframes',
        body: 'Mapped the page as a sequence of chapters: Hero → About → Skills → Experience → Projects → Testimonials → Contact, each with its own visual rhythm.',
      },
      {
        title: 'Design Process',
        body: 'Created a warm, magazine-inspired system — Playfair Display paired with Inter, a parchment palette and generous whitespace — then layered motion on top.',
      },
      {
        title: 'Final Solution',
        body: 'A cinematic single-page site with a loader, custom cursor, smooth scroll and deeply considered micro-interactions across every section.',
        bullets: [
          'SplitType word reveals and blur transitions',
          'Pinned scroll-driven scenes',
          'Magnetic buttons and image parallax',
          'Fully responsive, reduced-motion aware',
        ],
      },
      {
        title: 'Technologies',
        body: 'React, TypeScript, Tailwind, GSAP, Framer Motion, Lenis, Vite.',
      },
      {
        title: 'Challenges',
        body: 'Coordinating Lenis with ScrollTrigger pinning, keeping 60fps during heavy blur filters, and designing for both mouse and touch without losing the experience.',
      },
      {
        title: 'Key Learnings',
        body: 'Motion is a design material. Restraint, easing and timing matter more than the number of effects — and accessibility (reduced motion) is part of premium.',
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 03 — Spotify Clone                                                  */
  /* ------------------------------------------------------------------ */
  {
    id: 'spotify',
    number: '03',
    title: 'Spotify Clone',
    category: 'Frontend',
    technology: ['HTML', 'CSS', 'JavaScript'],
    features: ['Playlists', 'Navigation', 'Modern UI', 'Responsive'],
    description:
      'Responsive Spotify-inspired interface with playlists, navigation and modern UI patterns.',
    layout: 'centered',
    image: W('photo-1614680376593-902f74cf0d41', 1600),
    gallery: ['/sp1.png', '/sp2.png', '/sp3.png'],
    liveUrl: 'https://github.com/',
githubUrl: 'https://github.com/LokanshiAggarwal',
    details: {
      role: 'Frontend Development',
      duration: '2 Weeks',
      technologies: ['HTML', 'CSS', 'JavaScript'],
      problem:
        'Music interfaces are packed with dense states — playlists, queues, now-playing bars. Recreating one from scratch is the fastest way to learn layout discipline and UI polish.',
      solution:
        'Built a fully responsive Spotify-inspired interface from scratch with HTML, CSS and vanilla JavaScript — sidebar navigation, playlist grids, a player bar and smooth interactions.',
      outcome:
        'A pixel-conscious clone demonstrating modern UI patterns, layout systems and interactive states without a single framework.',
    },
    caseStudy: [
      {
        title: 'Problem',
        body: 'Understanding complex, state-rich interfaces. A music app forces you to solve sticky layout problems: scrollable sidebars, fixed player bars, responsive grids and active states.',
      },
      {
        title: 'Research',
        body: 'Deconstructed the Spotify desktop and mobile apps — navigation architecture, visual hierarchy, hover states and how the player persists across screens.',
        bullets: [
          'App architecture review',
          'Component inventory',
          'Responsive breakpoint mapping',
        ],
      },
      {
        title: 'Wireframes',
        body: 'Planned the shell first: left sidebar, main content area and bottom player. Then laid out playlist cards, headers and detail views inside the content area.',
      },
      {
        title: 'Design Process',
        body: 'Recreated the dark, high-contrast aesthetic with careful spacing, custom scrollbars and hover treatments that make the interface feel alive.',
      },
      {
        title: 'Final Solution',
        body: 'A responsive, vanilla-JavaScript music interface with working navigation between views, playlist grids, and a persistent player bar.',
        bullets: [
          'Sidebar + content + player layout',
          'Playlist and navigation views',
          'Custom scrollbars and hover states',
          'Fully responsive across breakpoints',
        ],
      },
      {
        title: 'Technologies',
        body: 'HTML, CSS and JavaScript — no frameworks, pure layout and interaction craft.',
      },
      {
        title: 'Challenges',
        body: 'Managing the fixed player without overlapping content, and keeping the interface usable at every breakpoint while preserving the visual density.',
      },
      {
        title: 'Key Learnings',
        body: 'Vanilla CSS grid and flexbox are powerful enough for real product UIs. Understanding the layout system first makes every interaction easier to build.',
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 04 — Angular Practice                                               */
  /* ------------------------------------------------------------------ */
  {
    id: 'angular',
    number: '04',
    title: 'Angular Practice',
    category: 'Frontend',
    technology: ['Angular', 'TypeScript'],
    features: ['Components', 'Routing', 'Data Binding', 'Reusable Architecture'],
    description:
      'Interactive Angular applications demonstrating components, routing, data binding and reusable architecture.',
    layout: 'offset',
    image: W('photo-1461749280684-dccba630e2f6', 1600),
    gallery: [
      W('photo-1555066931-4365d14bab8c', 800),
      W('photo-1517180102446-f3ece451e9d8', 800),
      W('photo-1504639725590-34d0984388bd', 800),
    ],
liveUrl: 'https://github.com/',
    githubUrl: 'https://github.com/LokanshiAggarwal',
    details: {
      role: 'Frontend Engineering',
      duration: 'Ongoing',
      technologies: ['Angular', 'TypeScript'],
      problem:
        'Modern frameworks need more than familiarity — they need architectural thinking. I wanted to move beyond tutorials and build real, structured Angular applications.',
      solution:
        'Created a suite of interactive Angular apps — dashboards, productivity tools and component libraries — exploring modules, routing, services and reactive data binding.',
      outcome:
        'A growing collection of practice projects that demonstrate scalable Angular patterns, clean component design and TypeScript-first architecture.',
    },
    caseStudy: [
      {
        title: 'Problem',
        body: 'React and vanilla JavaScript come naturally, but Angular demands a different mental model — modules, dependency injection, observables. I wanted deep, hands-on fluency.',
      },
      {
        title: 'Research',
        body: 'Studied Angular official docs, RxJS patterns and real-world Angular codebases to understand idiomatic structure rather than transplanting React habits.',
        bullets: [
          'Angular architecture patterns',
          'RxJS state and async handling',
          'Scalable folder structure',
        ],
      },
      {
        title: 'Wireframes',
        body: 'Designed a set of small apps with clear boundaries: a dashboard, a task manager and a component gallery — each with its own routing tree and shared modules.',
      },
      {
        title: 'Design Process',
        body: 'Focused on reusable, typed components. Each practice app follows the same design language so I can compare structure, data flow and maintainability.',
      },
      {
        title: 'Final Solution',
        body: 'Interactive Angular applications demonstrating components, routing, data binding and reusable architecture — with clean TypeScript models throughout.',
        bullets: [
          'Component-based architecture',
          'Routing with lazy modules',
          'Reactive forms and data binding',
          'Reusable UI building blocks',
        ],
      },
      {
        title: 'Technologies',
        body: 'Angular and TypeScript — with RxJS for reactive state and SCSS for styling.',
      },
      {
        title: 'Challenges',
        body: 'Letting go of React patterns and embracing dependency injection and observables — the biggest shift was structuring state reactively instead of imperatively.',
      },
      {
title: 'Key Learnings',
        body: 'Frameworks are opinions about structure. Learning Angular deeply has made me a better React developer too — architecture and patterns transfer across tools.',
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 05 — Tech Career Roadmap                                            */
  /* ------------------------------------------------------------------ */
  {
    id: 'tech-roadmap',
    number: '05',
    title: 'Tech Career Roadmap',
    category: 'Career Roadmap Website',
    technology: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
    features: ['4 Career Streams', 'Interactive Roadmaps', 'Educational UI', 'Laptop Optimized'],
    description:
      'A career roadmap website covering four technical streams — Cybersecurity, Data Analyst, Developer and AI/ML — with clear step-by-step learning paths, resources and salary insights.',
    layout: 'splitRight',
    image: W('photo-1531482615713-2afd69097998', 1600),
    gallery: ['/clg1.png', '/clg2.png', '/clg3.png'],
liveUrl: 'https://lokanshiaggarwal.github.io/College-Project-/',
    githubUrl: 'https://github.com/LokanshiAggarwal',
    details: {
      role: 'Design + Frontend Development',
      duration: '3 Weeks',
      technologies: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
      problem:
        'Students exploring tech careers are overwhelmed by scattered, contradictory information. There was no single, structured place that compared the four popular technical streams side by side.',
      solution:
        'Designed a clean, laptop-first roadmap website that presents Cybersecurity, Data Analyst, Developer and AI/ML as four full career paths — each with skills, tools, projects and steps to break in.',
      outcome:
        'A visual, easy-to-navigate guide that helps students compare streams, see what to learn in order, and pick a realistic path forward.',
    },
    caseStudy: [
      {
        title: 'Problem',
        body: 'Choosing a tech career is confusing. Roadmaps exist, but they are scattered across posts and videos, rarely compared side by side, and rarely tailored for absolute beginners.',
        bullets: [
          'No single trusted comparison of the 4 streams',
          'Beginners do not know what to learn first',
          'No clear salary or difficulty context',
        ],
      },
      {
        title: 'Research',
        body: 'Studied popular developer roadmaps and job-portal data to structure each stream as a progression: foundations → core skills → tools → projects → job readiness.',
        bullets: [
          'Mapped learning paths for all 4 streams',
          'Compared roles, tools and difficulty',
          'Reviewed entry-level job requirements',
        ],
      },
      {
        title: 'Wireframes',
        body: 'Sketched a landing page with four prominent stream cards, each linking to a detailed roadmap page — plus a comparison section and a "where to start" quick guide.',
      },
      {
        title: 'Design Process',
        body: 'Built a focused, laptop-first layout with a clear sidebar and card-based navigation. Each stream gets its own colour accent and a consistent step-by-step roadmap table.',
      },
      {
        title: 'Final Solution',
        body: 'A complete career roadmap website covering Cybersecurity, Data Analyst, Developer and AI/ML — with skills, learning resources, project ideas and step-by-step paths for each.',
        bullets: [
          'Four dedicated career stream pages',
          'Step-by-step skill roadmaps',
          'Comparison and difficulty overview',
          'Clean, laptop-optimized interface',
        ],
      },
      {
        title: 'Technologies',
        body: 'HTML, CSS, JavaScript and Bootstrap — chosen to keep the college project lightweight, fast and easy to deploy to GitHub Pages.',
      },
      {
        title: 'Challenges',
        body: 'Condensing four deep career paths into digestible pages without losing accuracy, and keeping the layout stable across common laptop screen sizes.',
      },
      {
        title: 'Key Learnings',
        body: 'Information architecture matters. Grouping content into clear, comparable streams made a dense subject feel approachable — and Bootstrap helped me iterate on layout quickly.',
      },
    ],
  },
];

export default PROJECTS;

