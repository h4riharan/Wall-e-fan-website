/**
 * One-off codemod: replace em dashes (—) and en dashes (–) with plain hyphens
 * in all source files. Run: node scripts/replace-dashes.mjs [--dry]
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const dry = process.argv.includes('--dry')
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const EXTS = new Set(['.ts', '.tsx', '.html', '.css', '.md'])
const SKIP = new Set(['node_modules', 'dist', '.git', 'public'])
const hits = []

function walk(dir) {
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(f.name)) continue
    const p = join(dir, f.name)
    if (f.isDirectory()) walk(p)
    else if (EXTS.has(extname(f.name))) {
      const s = readFileSync(p, 'utf8')
      if (/[\u2014\u2013]/.test(s)) {
        const lines = s.split(/\r?\n/)
        lines.forEach((l, i) => {
          if (/[\u2014\u2013]/.test(l)) hits.push(`${relative(ROOT, p)}:${i + 1}: ${l.trim().slice(0, 110)}`)
        })
        if (!dry) {
          writeFileSync(p, s.replace(/[\u2014\u2013]/g, '-'), 'utf8')
        }
      }
    }
  }
}

walk(ROOT)
console.log(hits.join('\n'))
console.log(`TOTAL LINES: ${hits.length}${dry ? ' (dry run, nothing written)' : ' (replaced)'}`)
