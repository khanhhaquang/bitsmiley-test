<br />
<p align="center">
<img src="./public/smiley.svg" with="100" height="100" /> 
</p>
<br />

# BitSmiley Frontend

## Getting start

This project was bootstrapped with [Vite](https://vitejs.dev/).

1. We are using `npm` for management.
2. Run `npm ci` to init `node_modules`
3. Run `npm run dev` to start development mode

## State management

- `Redux` for global config data
- `React-query` for managing data states from server APIs

## Styling

- TailwindCSS for styling
- [shadcn/ui](https://ui.shadcn.com/docs/installation/vite) for generating base components

## Contract interactions

- [Wagmi](https://wagmi.sh/) and [Viem](https://viem.sh/) as client for EVM.
- [Particle Network SDK](https://particle.network/) for BTC connecting and AA accounts.

## How to generate contract hooks ?

- Adding ABI file in `abi/` folder.
- Adding definition of new file in `wagmi.config.ts`.
- Run `npm run generateContractHooks`.
