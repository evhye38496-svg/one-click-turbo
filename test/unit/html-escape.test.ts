import assert from 'node:assert/strict';
import test from 'node:test';
import { escapeHtml } from '../../src/utils/html-escape';

test('escapes HTML-sensitive characters', () => {
  assert.equal(
    escapeHtml(`<img src=x onerror="alert('x')">&`),
    '&lt;img src=x onerror=&quot;alert(&#039;x&#039;)&quot;&gt;&amp;'
  );
});
