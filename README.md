# solana-nft-anchor

Solana NFT marketplace built with **Anchor** and **Metaplex Token Metadata**. Mint NFTs, list them for sale, and buy them — all on Solana.

---

## Stack

- **Program** — Rust + [Anchor](https://www.anchor-lang.com/) (`programs/solana-nft-anchor/`)
- **Metadata** — Metaplex Token Metadata
- **Frontend** — React + Vite + TypeScript (`app/`)
- **Wallet** — Solana wallet adapter (`@solana/wallet-adapter-react`)
- **SDK** — `@metaplex-foundation/umi`, `@metaplex-foundation/mpl-token-metadata`, `@project-serum/anchor`

## Layout

```
.
├── Anchor.toml                       Anchor workspace config
├── programs/
│   └── solana-nft-anchor/            Rust program — mint / list / buy instructions
├── tests/
│   └── solana-nft-anchor.ts          Program test suite (Mocha + Anchor)
├── migrations/
│   └── deploy.ts
└── app/                              React + Vite frontend
    ├── src/                          Wallet connect, mint UI, marketplace UI
    ├── public/
    └── webpack.config.js
```

## Build & test

```bash
# Build the program
anchor build

# Run program tests against a local validator
anchor test

# Run the frontend
cd app && npm install && npm run dev
```

## Deploy to devnet

```bash
solana config set --url devnet
anchor deploy
```

## License

MIT
