import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { validatePrBody } from './check-pr-template-checkboxes.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixtureDir = join(__dirname, 'fixtures', 'pr-template-checkboxes');

function fixture(name) {
  return readFileSync(join(fixtureDir, name), 'utf8');
}

test('fails unchecked required checklist rows with row text', () => {
  const result = validatePrBody(fixture('unchecked-required.md'));
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /Linux evidence/);
  assert.match(result.errors.join('\n'), /AC-64-1/);
});

test('passes checked required checklist rows', () => {
  assert.equal(validatePrBody(fixture('checked-required.md')).ok, true);
});

test('passes explicitly optional unchecked checklist rows', () => {
  assert.equal(validatePrBody(fixture('optional-unchecked.md')).ok, true);
});

test('fails docs choice group when no option is checked', () => {
  const result = validatePrBody(fixture('docs-choice-none.md'));
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /docs-updated/);
  assert.match(result.errors.join('\n'), /exactly one/);
});

test('passes docs choice group when exactly one option is checked', () => {
  assert.equal(validatePrBody(fixture('docs-choice-one.md')).ok, true);
});

test('fails docs choice group when more than one option is checked', () => {
  const result = validatePrBody(fixture('docs-choice-two.md'));
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /docs-updated/);
  assert.match(result.errors.join('\n'), /2 checked/);
});

test('fails included E2E gap acknowledgement while unchecked', () => {
  const result = validatePrBody(fixture('e2e-gap-unchecked.md'));
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /E2E gap/);
});

test('fails manual test row while unchecked', () => {
  const result = validatePrBody(fixture('manual-unchecked.md'));
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /Manual test/);
});

test('fails unmarked visible unchecked checklist rows by default', () => {
  const result = validatePrBody('- [ ] Rotate the production secret.');
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /Rotate the production secret/);
});

test('ignores unchecked checklist examples inside HTML comments', () => {
  const body = `## Do before merging

<!--
  Example: - [ ] Rotate the production secret after deploy.
-->
`;
  assert.equal(validatePrBody(body).ok, true);
});
