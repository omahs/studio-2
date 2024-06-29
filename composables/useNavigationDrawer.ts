interface NavItem {
  title: string;
  icon: string;
  to: string;
  onlyLoggedIn?: boolean;
  onlyAdmin?: boolean;
  exact?: boolean;
  badge?: {
    content: string;
    color?: string;
  };
}

export const useNavigationDrawer = () => {
  const drawer = useState<boolean | null>("drawer", () => null);

  const open = () => {
    drawer.value = true
  }

  const close = () => {
    drawer.value = false
  }

  const toggle = () => {
    drawer.value = !drawer.value
  }

  const navItems = computed<NavItem[]>(() => {
    return [
      {
        title: "Home",
        icon: "mdi-home",
        to: "/",
        onlyLoggedIn: false,
        exact: true,
      },
      {
        title: "Multisig",
        icon: "mdi-wallet",
        to: "/wallet/multisig",
        onlyLoggedIn: true,
        onlyAdmin: true,
        exact: true,
      },
      {
        title: "NFTs",
        icon: "mdi-music-box",
        to: "/admin/nfts",
        onlyLoggedIn: false,
        onlyAdmin: true,
        exact: true,
      },
      {
        title: "Tracks",
        icon: "mdi-music",
        to: "/admin/tracks",
        onlyLoggedIn: false,
        onlyAdmin: true,
        exact: true,
      },
      {
        title: "Player",
        icon: "mdi-music",
        to: "/player",
        onlyLoggedIn: true,
        onlyAdmin: true,
        exact: true,
      },
      {
        title: "Private Uploads",
        icon: "mdi-music",
        to: "/private-uploads",
        onlyLoggedIn: true,
        onlyAdmin: true,
        exact: true,
      },
      {
        title: "Radio",
        icon: "mdi-radio",
        to: "/radio",
        onlyLoggedIn: false,
        onlyAdmin: false,
        exact: true,
        badge: {
          content: "Preview",
          color: "primary",
        },
      }
    ];
  });

  return {
    drawer,
    open,
    close,
    toggle,
    navItems
  }
}