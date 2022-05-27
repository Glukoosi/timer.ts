#!/usr/bin/env zx

await Promise.all([
    $`cd timer.ts-frontend; npm run dev`,
    $`cd timer.ts-backend; npm run dev`,
])
