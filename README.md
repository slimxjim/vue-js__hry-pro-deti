### hry-pro-deti-vuejs | # vue-js__hry-pro-deti

# How to RUN:
```
npm run dev -- --port 8000
```

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
# Next preparation
```
npm install vuetify
```


# Deployment:
```
npm run build
```
copy content from:
```
*/dist/
```
## .htaccess
```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /vuejs_hry/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /vuejs_hry/index.html [L]
</IfModule>
```

# TODO:
## vylepšit hru:
- hráč proti PC, monster - obrázek
- animace kulek, střelby: https://jsfiddle.net/5bcncsv2/- plusové příklady seberou příšeře jen třetinu damage
- mínusové celé a mínusy přes desete budou za dvojnásobek
- animace hráčova avatara, animace monster avatara: https://www.shutterstock.com/image-vector/goblin-character-ready-animation-mobile-applications-643122487
- čím rychlejší budou odpovědi, tím ničivější budou - formát odměn: do 3s - 2x damage + život navíc, do 10s - 1.5x, nad 30s ztráta života, nad 60s ztráta života a heal příšeře
- různé mody (0-10, 0-20, jen plus, jen mínus, kombinace)
- přidat hru na trénink - tři chlívečky, rozklad čísel (trojúhelník, nahoře nejvyšší číslo)

## Inspirations:
- JS 3D (OMG): https://playground.babylonjs.com/#UK6WTT#8 (https://forum.babylonjs.com/t/create-a-simple-machine-gun/14771/2)
- Blast off a rocket (JS) https://codepen.io/mel-ociraptor/pen/rGJLeN  
  - **=> místo zabíjení monstra, start rakety a přistání**
- Animation sprite: how to Vue: https://vueschool.io/articles/vuejs-tutorials/how-to-create-an-animated-sprite-with-vueuse/