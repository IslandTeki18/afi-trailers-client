import * as React from "react";

export const footerNavItems = {
  main: [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Trailers", href: "/trailers" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ],
  social: [
    {
      name: "Facebook",
      href: "https://www.facebook.com/people/Afi-Rental-Trailers/61566905078603/",
      icon: (props: any) => <i className="fa-brands fa-facebook text-2xl" />,
    },
    {
      name: "Instagram",
      href: "#",
      icon: (props: any) => <i className="fa-brands fa-instagram text-2xl" />,
    },
    {
      name: "YouTube",
      href: "#",
      icon: (props: any) => <i className="fa-brands fa-youtube text-2xl" />,
    },
  ],
};
