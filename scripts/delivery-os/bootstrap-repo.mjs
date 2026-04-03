#!/usr/bin/env node

import { main } from '../../packages/cli/src/index.mjs'

main(['bootstrap-repo', ...process.argv.slice(2)])
