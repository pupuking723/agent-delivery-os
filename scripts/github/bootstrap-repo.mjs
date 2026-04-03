#!/usr/bin/env node

import { main } from '../../packages/cli/src/index.mjs'

main(['bootstrap-github', ...process.argv.slice(2)])
