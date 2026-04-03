#!/usr/bin/env node

import { main } from '../packages/cli/src/index.mjs'

main(['check', ...process.argv.slice(2)])
