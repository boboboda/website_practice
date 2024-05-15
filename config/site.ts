export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "코딩천재 부영실",
	description: "코딩천재 부영실의 개발한 앱 소개, 개발노트 정보 교환, 제작의뢰 등 정보 교환을 위한 홈페이지 입니다.",
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
