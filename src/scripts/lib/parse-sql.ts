// src/scripts/lib/parse-sql.ts

export type SqlValue = string | number | boolean | null

/** Parse the VALUES(...) tuple from one INSERT statement into an array of JS values. */
export function parseSqlValues(valuesClause: string): SqlValue[] {
  // Strip outer parens: "(a, b, c)" → "a, b, c"
  const inner = valuesClause.trim().replace(/^\(/, '').replace(/\);?$/, '').replace(/\)$/, '')
  const result: SqlValue[] = []
  let i = 0

  while (i < inner.length) {
    // Skip whitespace and commas between values
    if (inner[i] === ',' || inner[i] === ' ') { i++; continue }

    if (inner[i] === "'") {
      // Quoted string — collect until closing unescaped quote
      let str = ''
      i++ // skip opening quote
      while (i < inner.length) {
        if (inner[i] === "'" && inner[i + 1] === "'") {
          str += "'"
          i += 2
        } else if (inner[i] === "'") {
          i++ // skip closing quote
          break
        } else {
          str += inner[i]
          i++
        }
      }
      result.push(str)
    } else if (inner.slice(i, i + 4) === 'NULL') {
      result.push(null)
      i += 4
    } else if (inner.slice(i, i + 4) === 'true') {
      result.push(true)
      i += 4
    } else if (inner.slice(i, i + 5) === 'false') {
      result.push(false)
      i += 5
    } else {
      // Number (possibly negative)
      let num = ''
      if (inner[i] === '-') { num += '-'; i++ }
      while (i < inner.length && inner[i] !== ',' && inner[i] !== ')') {
        num += inner[i]
        i++
      }
      result.push(Number(num))
    }
  }

  return result
}

/** Extract all INSERT rows for a given table from the full SQL dump string. */
export function parseSqlInserts(sql: string, tableName: string): SqlValue[][] {
  const prefix = `INSERT INTO ${tableName} VALUES `
  const rows: SqlValue[][] = []

  for (const line of sql.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed.startsWith(prefix)) continue
    const valuesClause = trimmed.slice(prefix.length)
    rows.push(parseSqlValues(valuesClause))
  }

  return rows
}
