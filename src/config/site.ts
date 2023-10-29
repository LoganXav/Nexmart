export type SiteConfig = typeof siteConfig;

import type { FooterItem } from "@/types"


const links = {
  twitter: "https://twitter.com",
  github: "https://github.com",
  githubAccount: "https://github.com",
  discord: "https://discord.com/users",
  calDotCom: "https://cal.com",
};

export const siteConfig = {
  name: "nexmart",
  description:
    "An open source e-commerce e-shop build with everything new in Next.js 13.",
  url: "",
  ogImage: "",
  links,

  footerNav: [
    {
      title: "Credits",
      items: [
        {
          title: "OneStopShop",
          href: "https://onestopshop.jackblatch.com",
          external: true,
        },
        {
          title: "Acme Corp",
          href: "https://acme-corp.jumr.dev",
          external: true,
        },
        {
          title: "craft.mxkaske.dev",
          href: "https://craft.mxkaske.dev",
          external: true,
        },
        {
          title: "Taxonomy",
          href: "https://tx.shadcn.com/",
          external: true,
        },
        {
          title: "shadcn/ui",
          href: "https://ui.shadcn.com",
          external: true,
        },
        {
          title: "Sandmann",
          href: "https://skateshop.sadmn.com/",
          external: true,
        },
      ],
    },
    {
      title: "Help",
      items: [
        {
          title: "About",
          href: "/about",
          external: false,
        },
        {
          title: "Contact",
          href: "/contact",
          external: false,
        },
        {
          title: "Terms",
          href: "/terms",
          external: false,
        },
        {
          title: "Privacy",
          href: "/privacy",
          external: false,
        },
      ],
    },
    {
      title: "Social",
      items: [
        {
          title: "Twitter",
          href: links.twitter,
          external: true,
        },
        {
          title: "GitHub",
          href: links.githubAccount,
          external: true,
        },
        {
          title: "Discord",
          href: links.discord,
          external: true,
        },
        {
          title: "cal.com",
          href: links.calDotCom,
          external: true,
        },
      ],
    },
    {
      title: "Lofi",
      items: [
        {
          title: "beats to study to",
          href: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
          external: true,
        },
        {
          title: "beats to chill to",
          href: "https://www.youtube.com/watch?v=rUxyKA_-grg",
          external: true,
        },
        {
          title: "a fresh start",
          href: "https://www.youtube.com/watch?v=rwionZbOryo",
          external: true,
        },
        {
          title: "coffee to go",
          href: "https://www.youtube.com/watch?v=2gliGzb2_1I",
          external: true,
        },
      ],
    },
  ] satisfies FooterItem[],
};
