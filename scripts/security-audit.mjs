import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()
const ignoredDirs = new Set(['.git', 'node_modules', 'dist', 'dist-ssr', '.tmp'])
const ignoredExact = new Set(['.env', '.env.local'])
const ignoredEnvPattern = /^\.env\.(?!example$).+/i
const placeholderPattern = /your_|your-|placeholder|replace[-_ ]?me|changeme/i

const secretChecks = [
  {
    label: 'Google API key',
    pattern: /AIza[0-9A-Za-z\-_]{35}/g,
  },
  {
    label: 'OpenWeather key assignment',
    pattern: /VITE_OPENWEATHER_API_KEY\s*=\s*["']?(?!your_openweather_api_key)[0-9a-f]{32}["']?/gi,
  },
  {
    label: 'MSG91 key assignment',
    pattern: /VITE_MSG91_AUTH_KEY\s*=\s*["']?(?!your_msg91_auth_key)[A-Za-z0-9]{12,}["']?/gi,
  },
  {
    label: 'Agmarknet key assignment',
    pattern: /VITE_AGMARKNET_API_KEY\s*=\s*["']?(?!your_agmarknet_api_key)[A-Za-z0-9]{20,}["']?/gi,
  },
  {
    label: 'Private key block',
    pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
  },
  {
    label: 'GitHub token',
    pattern: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g,
  },
]

const toLines = text => text.split(/\r?\n/)

const shouldSkipFile = relativePath =>
  ignoredExact.has(relativePath) || ignoredEnvPattern.test(relativePath)

const getCandidateFiles = (dir = repoRoot, prefix = '') => {
  const entries = readdirSync(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) continue
      files.push(...getCandidateFiles(path.join(dir, entry.name), `${prefix}${entry.name}/`))
      continue
    }

    if (!entry.isFile()) continue

    const relativePath = `${prefix}${entry.name}`
    if (shouldSkipFile(relativePath)) continue
    files.push(relativePath)
  }

  return files
}

const isProbablyText = filePath => {
  const sample = readFileSync(filePath)
  const limit = Math.min(sample.length, 2048)
  let suspicious = 0

  for (let index = 0; index < limit; index++) {
    const byte = sample[index]
    if (byte === 0) return false
    const isAllowed =
      byte === 9 ||
      byte === 10 ||
      byte === 13 ||
      (byte >= 32 && byte <= 126) ||
      byte >= 128
    if (!isAllowed) suspicious++
  }

  return suspicious / Math.max(limit, 1) < 0.15
}

const summarizeMatch = (line, matchText) => {
  const compact = line.trim()
  if (!compact) return matchText
  if (placeholderPattern.test(compact)) return null
  return compact.length > 160 ? `${compact.slice(0, 157)}...` : compact
}

const findFindings = file => {
  const absolutePath = path.join(repoRoot, file)
  const stats = statSync(absolutePath)
  if (!stats.isFile()) return []
  if (!isProbablyText(absolutePath)) return []

  const content = readFileSync(absolutePath, 'utf8')
  const lines = toLines(content)
  const findings = []

  lines.forEach((line, index) => {
    for (const check of secretChecks) {
      const matches = line.match(check.pattern)
      if (!matches?.length) continue

      const summary = summarizeMatch(line, matches[0])
      if (!summary) continue

      findings.push({
        file,
        lineNumber: index + 1,
        label: check.label,
        summary,
      })
    }
  })

  return findings
}

const auditGitignore = () => {
  const gitignorePath = path.join(repoRoot, '.gitignore')
  const gitignore = readFileSync(gitignorePath, 'utf8')
  const requiredEntries = ['.env.*', '!.env.example']
  return requiredEntries
    .filter(entry => !gitignore.includes(entry))
    .map(entry => ({
      file: '.gitignore',
      lineNumber: 0,
      label: 'Missing gitignore safeguard',
      summary: `Expected "${entry}" to be present.`,
    }))
}

const candidateFiles = getCandidateFiles()
const findings = candidateFiles.flatMap(findFindings).concat(auditGitignore())

if (!findings.length) {
  console.log('Security audit passed: no obvious secrets found in tracked files.')
  process.exit(0)
}

console.error('Security audit failed:')
for (const finding of findings) {
  const location = finding.lineNumber > 0 ? `${finding.file}:${finding.lineNumber}` : finding.file
  console.error(`- ${location} [${finding.label}] ${finding.summary}`)
}
process.exit(1)
