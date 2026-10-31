window.KINETIKA_HQ_CONFIG = {
  shell: {
    locationPill: "Private Node",
    modePill: "Private Portal",
    versionLabel: "Private Build",
  },
  routing: {
    privateSuffix: ".internal.example",
    publicSuffix: ".example.com",
  },
  groups: [
    {
      title: "Operations",
      note: "Replace these placeholders with your real internal services.",
      items: [
        {
          name: "Admin Console",
          description: "Private service entry point.",
          href: "https://service.internal.example",
          fallbackHref: "https://127.0.0.1:8080",
          mark: "AC",
          zone: "001",
          status: "live",
        },
      ],
    },
  ],
};
