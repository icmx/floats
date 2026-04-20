# Floats: Decisions

> This document describes architecture and design decisions made while developing Floats project. Simply put, it answers questions like *"Why did you do ... ?"* or similar

## Why does this project even exist?

First, I really need to check currency exchange rates, like daily or so. There are lots of apps for this indeed, but, unfortunately, none of them support all the features I need. My workflow currently lives in Google Sheets, which is not as effective as it could be.

Second, React development and the fintech context are relatively new to me. As a frontend developer (more broadly: UI, design and [HCI](https://en.wikipedia.org/wiki/Human%E2%80%93computer_interaction) enthusiast) I see this project as an interesting challenge. Lots of tasks and problems are non-trivial for me here, and it seems like a good opportunity to develop my skills by solving them.

## What have you tried before?

To check rates, I've already tried:

- [Google Finance](https://www.google.com/finance/) — nice and clean, nearly the best option available (still lacking a lot of features I need)
- [Trading Economics](https://tradingeconomics.com/) — same as Google Finance, but too noisy and spammy with alerts
- [TradingView](https://www.tradingview.com/) — advanced UI, but too complex for my use cases. Also spamming with modal windows
- [Xe](https://www.xe.com/) — too simple and became strangely clumsy when you just need to view chart

These options might be good in their own way, but none of them has these features (all at once):

- Feature-rich chart with decades of historical data
- Table like in Excel, where one can select and copy any range of cells
- Compare mode (like when you want to compare similar pairs, e.g. USDEUR and GBPEUR)

On top of that, most of the tools are obviously commercial. They're designed to "involve" you and make money as a result. They like to spam with notifications and flashy blocks which I don't really appreciate. By making Floats, I wanted to reach calm, non-distracting experience.

## Why this stack?

I see that React and Vite are most widely used frontend options currently, and they're really good. They have a large and active community, which means most of typical problems are already resolved and documented.

TypeScript here is a must. It's 2026, any developer now deals with types and contracts, especially in complex projects. One can't just keep it all in own head or JSDoc comments.

## Why SPA?

This app is initially made as a dynamic SPA (single-page application). I've decided to do this for two main reasons:

1. SPA development is simpler (thus faster) than SSR. When done correctly, one can migrate to SSR relatively easily
2. The most important parts of this app are full-screen chart and table. This is dynamic content anyway that will be pre-rendered just as a gray skeleton for the entire app screen

## Why not a real backend?

This app uses CSV files as a main data source. Those files are updated daily by a script, so they're not fully "static". Still, it's obviously not a real backend.

Although I can write server code, for this project I want to focus on frontend part. A good backend needs to be deployed properly, which implies a lot of infrastructure work. This is overkill for this project's scope.

On top of that, semi-static CSV files are fast, cheap — well, even free solution. They can be stored anywhere, and many of CI/CD providers can build them by running a simple script.

Obvious tradeoff here is update frequency (only once in a day), which might be unacceptable e.g. for trading or similar cases. However, if you need to just check exchange rates occasionally, this might be good enough.

## Why CSV, not JSON?

Currency exchange data is natively *tabular*:

```csv
date,rate
2020-01-01,65.926712
2020-01-02,63.618244
```

Naive JSON structure here takes much more space:

```json
[
  {
    "date": "2020-01-01",
    "rate": 65.926712
  },
  {
    "date": "2020-01-02",
    "rate": 63.618244
  }
]
```

Minified JSON tuples option is better:

```json
[[1577836800,65.926712],[1577923200,63.618244]]
```

But it's still a JSON, and it still has all the JSON features, some of which make data processing pipeline much harder than it can be. Consider at least the following:

**Appending updates.** In CSV, updating script should just append a new line to a file. In JSON, script must parse the whole file, perform in-memory appending, and then build it. This is crucial for relatively large files, i.e. 10k entries or more.

Custom JSON dialects like [JSONL](https://jsonlines.org/) ([NDJSON](https://ndjson.com/)) can manage that, but they're *custom*. They're not a part of V8 or any other JS engine, which means that they're likely as fast as manual CSV parsing, or maybe even slower.

**Human readability.** CSV record like `2020-01-01,65.926712` is more human-friendly than JSON's `[1577836800,65.926712]`. One can easily see date values and each entry is naturally divided by a newline, which is good for debugging, for instance.

In future I plan to implement a partial download by using [range HTTP requests technique](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Range_requests). From my current experience I think that it will be easier to implement it on CSV, not JSON — but this is not a final decision.

## Why own implementation for ... ?

This project uses many custom solutions, including:

- Custom UI primitives (layout, inputs, color themes, etc)
- Custom chips select and autocomplete
- Custom data table
  - Custom virtual scroll (for rows)
  - Custom selection (select and copy any range of cells)
- Custom currency cross-rates calculation engine

Honestly, for production-level app that's more of a risk than advantage. In real commercial projects I would most likely use mature solutions like [MUI](https://mui.com/), [AG Grid](https://www.ag-grid.com/), [React Virtuoso](https://virtuoso.dev/) or similar options.

However, this project is a hobby after all. I'm always interested in building complex, architecture-wise things. By manual implementing such solutions I can build stronger intuition about tradeoffs and edge cases, which later allows me to make more robust code for realworld applications.

It is worth noting that custom approach allows building specific solution which leads to (potentially) thinner and faster code, as well as smaller resulting bundle size.
