#!/usr/bin/env node

import { main } from '../packages/cli/src/index.mjs'

main(['bootstrap-all', ...process.argv.slice(2)])
