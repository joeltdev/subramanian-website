// tests/int/scripts/html-to-lexical.int.spec.ts
import { describe, it, expect } from 'vitest'
import { htmlToLexical } from '../../../src/scripts/lib/html-to-lexical'

describe('htmlToLexical', () => {
  it('returns a valid root document for empty input', () => {
    const result: any = htmlToLexical('')
    expect(result.root.type).toBe('root')
    expect(result.root.version).toBe(1)
  })

  it('converts a paragraph', () => {
    const result: any = htmlToLexical('<p>Hello world</p>')
    const para = result.root.children[0]
    expect(para.type).toBe('paragraph')
    expect(para.children[0].type).toBe('text')
    expect(para.children[0].text).toBe('Hello world')
  })

  it('converts h2 heading', () => {
    const result: any = htmlToLexical('<h2>Title</h2>')
    expect(result.root.children[0].type).toBe('heading')
    expect(result.root.children[0].tag).toBe('h2')
    expect(result.root.children[0].children[0].text).toBe('Title')
  })

  it('converts bold text', () => {
    const result: any = htmlToLexical('<p><strong>Bold</strong></p>')
    const text = result.root.children[0].children[0]
    expect(text.type).toBe('text')
    expect(text.text).toBe('Bold')
    expect(text.format).toBe(1) // bold flag
  })

  it('converts italic text', () => {
    const result: any = htmlToLexical('<p><em>Italic</em></p>')
    const text = result.root.children[0].children[0]
    expect(text.format).toBe(2) // italic flag
  })

  it('converts unordered list', () => {
    const result: any = htmlToLexical('<ul><li>Item 1</li><li>Item 2</li></ul>')
    const list = result.root.children[0]
    expect(list.type).toBe('list')
    expect(list.listType).toBe('bullet')
    expect(list.children).toHaveLength(2)
    expect(list.children[0].type).toBe('listitem')
    expect(list.children[0].children[0].text).toBe('Item 1')
  })

  it('converts ordered list', () => {
    const result: any = htmlToLexical('<ol><li>First</li></ol>')
    expect(result.root.children[0].listType).toBe('number')
    expect(result.root.children[0].tag).toBe('ol')
  })

  it('converts anchor links', () => {
    const result: any = htmlToLexical('<p><a href="https://example.com">Click</a></p>')
    const link = result.root.children[0].children[0]
    expect(link.type).toBe('link')
    expect(link.fields.url).toBe('https://example.com')
    expect(link.children[0].text).toBe('Click')
  })

  it('converts line breaks', () => {
    const result: any = htmlToLexical('<p>Line 1<br>Line 2</p>')
    const children = result.root.children[0].children
    expect(children[1].type).toBe('linebreak')
  })

  it('normalizes &nbsp; to regular space', () => {
    const result: any = htmlToLexical('<p>Hello&nbsp;world</p>')
    const text = result.root.children[0].children[0].text
    expect(text).toBe('Hello world')
  })

  it('skips empty paragraphs', () => {
    const result: any = htmlToLexical('<p>Real</p><p></p><p>Content</p>')
    expect(result.root.children).toHaveLength(2)
  })
})
