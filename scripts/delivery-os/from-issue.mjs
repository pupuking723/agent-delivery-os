#!/usr/bin/env node

import { main } from '../../packages/cli/src/index.mjs'

main(['issue', ...process.argv.slice(2)])
