# PRD

## Problem

Users can understand Delivery OS as a delivery framework, but they still need a concrete answer to a more practical question: how do I combine official CLIs, browser automation, and source-available tools into one repeatable flow?

## Target Users

- builders creating internal automations
- agent users orchestrating open-source projects
- teams that need a repeatable pattern for mixed toolchains

## Scope

- provide recipe-level entry points
- provide one example workspace with an interface map
- show when to choose official CLI, `opencli`, or `CLI-Anything`

## Acceptance Criteria

- a user can run `pnpm recipes`
- a user can open a recipe and understand when to use it
- a user can inspect an example workspace that includes `tool-interface-map.md`
