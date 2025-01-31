export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    name: "Cheer Split",
    description: "Split Bill App - Easily divide group expenses. Supports equal and customized splits, quick calculations, and automatic settlement—no registration needed.",
    navItems: [
        {
            label: "Home",
            href: "/",
        }
    ],
    navMenuItems: [
        {
            label: "Profile",
            href: "/profile",
        },
        {
            label: "Dashboard",
            href: "/dashboard",
        },
        {
            label: "Projects",
            href: "/projects",
        },
        {
            label: "Team",
            href: "/team",
        },
        {
            label: "Calendar",
            href: "/calendar",
        },
        {
            label: "Settings",
            href: "/settings",
        },
        {
            label: "Help & Feedback",
            href: "/help-feedback",
        },
        {
            label: "Logout",
            href: "/logout",
        },
    ],
    links: {
        github: "https://github.com/AutomaticOrca/cheers-split.git",
        linkedin: "https://www.linkedin.com/in/jyliang1013/",
    },
};
