# Animated Next.js Portfolio

A from-scratch Next.js portfolio built around a playful, dark, kinetic product-engineering aesthetic.

## Includes

- Next.js App Router + TypeScript
- `page-mascot` cursor-following mascot
- Hamster mascot path wired to `/public/mascots/hamster-directions.webp`
- Animated system-thinking hero
- Interactive thinking loop
- Animated marquee
- Product/system project diagrams
- Responsive layout
- Reduced-motion support
- Career OS, PathForge and Digital Literacy OS content based on the supplied projects

## Run

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Mascot asset

The component is intentionally configured exactly around:

```tsx
<Mascot
  directions="/mascots/hamster-directions.webp"
  size={118}
  label="Portfolio hamster"
/>
```

The directions sprite sheet must exist at:

`public/mascots/hamster-directions.webp`

The `page-mascot` package normally uses a directions sheet and optionally a reactions sheet. This starter wires the directions sheet so the mascot can follow the cursor. See the package documentation for the matching reactions sheet if you want click expressions.
