import { describe, expect, it } from 'vitest';

import { renderMarkdown } from '../renderMarkdown';

describe('renderMarkdown', () => {
  it('renders headings', () => {
    expect(renderMarkdown('# Title')).toContain('<h1>Title</h1>');
    expect(renderMarkdown('## Sub')).toContain('<h2>Sub</h2>');
  });

  it('renders fenced code block', () => {
    const html = renderMarkdown('```ts\nconst x = 1;\n```');
    expect(html).toContain('<pre');
    expect(html).toContain('<code');
    expect(html).toContain('const x = 1;');
  });

  it('renders list and linkify', () => {
    const html = renderMarkdown('- a\n- b\n\nhttps://example.com');
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>a</li>');
    expect(html).toContain('href="https://example.com"');
  });

  it('escapes raw HTML to prevent XSS (html:false)', () => {
    const html = renderMarkdown('<script>alert(1)</script>');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('adds safe attrs to links', () => {
    const html = renderMarkdown('https://example.com');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('renders empty string for empty input', () => {
    expect(renderMarkdown('').trim()).toBe('');
  });
});
