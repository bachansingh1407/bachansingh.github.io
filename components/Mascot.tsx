"use client";

import { Mascot } from "page-mascot";

export default function PortfolioMascot() {
  return (
    <div className="mascot-wrap" aria-label="Interactive portfolio mascot">
      <Mascot
        directions="/mascots/hamster-directions.webp"
        size={118}
        label="Portfolio hamster"
        className="portfolio-mascot"
      />
      <span className="mascot-hint">hey 👋</span>
    </div>
  );
}