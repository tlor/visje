const header = {
  logo: {
    image: "/assets/images/logo/logo.svg",
    title: "Ichthus Zwolle",
    link: "/",
  },
  logoWhite: {
    image: "/assets/images/logo/logo-white.svg",
    title: "Ichthus Zwolle",
    link: "/",
  },
  nav: {
    actionbar: {
      items: [
        {
          link: "#",
          icon: "now-ui-icons ui-1_bell-53",
          title: "Meldingen",
          items: [],
        },
        // {
        //     link: "#",
        //     icon: "now-ui-icons ui-2_chat-round",
        //     title: "Inbox",
        //     items: [
        //     ]
        // },
        {
          link: "/beheer",
          icon: "now-ui-icons ui-1_settings-gear-63",
          title: "Beheer",
          role: ["admin"],
        },
      ],
    },
  },
};

export default header;
