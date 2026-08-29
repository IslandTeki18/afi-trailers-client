import { business } from "~src/data/business";
import { primaryBookingPath } from "~src/data/trailers";

export type FooterColumn = {
  heading: string;
  links: { name: string; href: string; external?: boolean }[];
};

export const footerColumns: FooterColumn[] = [
  {
    heading: "Rent",
    links: [
      { name: "All trailers", href: "/trailers" },
      { name: "Pricing", href: "/pricing" },
      { name: "Request dates", href: primaryBookingPath },
    ],
  },
  {
    heading: "Know before you tow",
    links: [
      { name: "Trailer etiquette", href: "/trailers/usage-guidelines" },
      { name: "Drop-off contract", href: "/trailers/rental-contract/drop-off" },
      { name: "Drive-off contract", href: "/trailers/rental-contract/drive-off" },
    ],
  },
  {
    heading: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Facebook", href: business.facebookUrl, external: true },
    ],
  },
];
