#!/usr/bin/env node

import { main } from '../../packages/cli/src/index.mjs'

main(['feature', ...process.argv.slice(2)])
