#!/usr/bin/env zx

await Promise.all([
    $`cd timer.ts-frontend; npm install`,
    $`cd timer.ts-backend; npm install`,
])
