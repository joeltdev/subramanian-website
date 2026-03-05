// tests/int/scripts/parse-sql.int.spec.ts
import { describe, it, expect } from 'vitest'
import { parseSqlValues, parseSqlInserts } from '../../../src/scripts/lib/parse-sql'

describe('parseSqlValues', () => {
  it('parses integers', () => {
    expect(parseSqlValues('(1, 2, 3)')).toEqual([1, 2, 3])
  })

  it('parses quoted strings', () => {
    expect(parseSqlValues("(1, 'hello', 'world')")).toEqual([1, 'hello', 'world'])
  })

  it('parses empty string', () => {
    expect(parseSqlValues("(1, '', 2)")).toEqual([1, '', 2])
  })

  it('parses NULL', () => {
    expect(parseSqlValues('(1, NULL, 3)')).toEqual([1, null, 3])
  })

  it('parses booleans', () => {
    expect(parseSqlValues('(true, false)')).toEqual([true, false])
  })

  it('handles escaped single quotes inside strings', () => {
    expect(parseSqlValues("(1, 'it''s here', 2)")).toEqual([1, "it's here", 2])
  })

  it('handles JSON string values', () => {
    const input = `(1, '{"uploadId":210,"alt":""}', 3)`
    const result = parseSqlValues(input)
    expect(result[1]).toBe('{"uploadId":210,"alt":""}')
  })

  it('handles HTML content with embedded quotes', () => {
    const html = `<p>Wall-mounted it''s here</p>`
    const input = `(1, '${html}')`
    const result = parseSqlValues(input)
    expect(result[1]).toBe("<p>Wall-mounted it's here</p>")
  })
})

describe('parseSqlInserts', () => {
  it('extracts rows for a given table', () => {
    const sql = [
      `INSERT INTO product_tags VALUES (1, 'en', 'abc', 'New', '1', '', '', 1000, 2000);`,
      `INSERT INTO product_tags VALUES (2, 'en', 'def', 'Old', '2', '', '', 3000, 4000);`,
      `INSERT INTO other_table VALUES (99, 'skip');`,
    ].join('\n')

    const rows = parseSqlInserts(sql, 'product_tags')
    expect(rows).toHaveLength(2)
    expect(rows[0][0]).toBe(1)
    expect(rows[0][3]).toBe('New')
    expect(rows[1][3]).toBe('Old')
  })
})
