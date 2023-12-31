export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "코딩천재 부영실",
	description: "Make beautiful websites regardless of your design experience.",
	navItems: [
		{
			label: "홈",
			href: "/",
		},
    {
      label: "출시어플",
      href: "/release",
    },
    {
      label: "제작의뢰",
      href: "/makeorder",
    },
    {
      label: "연락하기",
      href: "https://open.kakao.com/o/ss0BBmVb",
    }
	],
	links: {
		github: "https://github.com/nextui-org/nextui",
		twitter: "https://twitter.com/getnextui",
		docs: "https://nextui.org",
		discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev"
	},
};
