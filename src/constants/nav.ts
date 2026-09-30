export const LEARNER_NAV = [
  { href: "/dashboard", key: "nav.home", icon: "House" },
  { href: "/learning", key: "nav.learning", icon: "BookOpenText" },
  { href: "/discover", key: "nav.discover", icon: "Compass" },
  { href: "/assessment", key: "nav.assessments", icon: "Target" },
  { href: "/passport", key: "nav.passport", icon: "IdentificationCard" },
  { href: "/projects", key: "nav.projects", icon: "Rocket" },
  { href: "/recognition", key: "nav.recognition", icon: "Medal" },
] as const;

export const MOBILE_NAV = [
  { href: "/dashboard", key: "nav.home", icon: "House" },
  { href: "/learning", key: "nav.learn", icon: "BookOpenText" },
  { href: "/passport", key: "nav.passport", icon: "IdentificationCard" },
  { href: "/projects", key: "nav.projects", icon: "Rocket" },
  { href: "/settings", key: "nav.profile", icon: "UserCircle" },
] as const;

export const ADMIN_NAV = [
  { href: "/admin", label: "Overview", icon: "SquaresFour" },
  { href: "/admin/courses", label: "Courses", icon: "BookBookmark" },
  { href: "/admin/assessments", label: "Assessments", icon: "ListChecks" },
  { href: "/admin/learners", label: "Learners", icon: "UsersThree" },
  { href: "/admin/evidence", label: "Evidence", icon: "FileMagnifyingGlass" },
  { href: "/admin/credentials", label: "Credentials", icon: "Certificate" },
  { href: "/admin/projects", label: "Projects", icon: "Rocket" },
  { href: "/admin/top-100", label: "Top 100", icon: "Medal" },
  { href: "/admin/analytics", label: "Analytics", icon: "ChartLineUp" },
  { href: "/admin/content", label: "Content", icon: "Article" },
  { href: "/admin/settings", label: "Settings", icon: "GearSix" },
] as const;
