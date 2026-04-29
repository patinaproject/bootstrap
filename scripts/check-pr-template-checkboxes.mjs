#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const REQUIRED_MARKER = /^<!--\s*pr-checkbox:\s*required\s*-->$/i;
const OPTIONAL_MARKER = /^<!--\s*pr-checkbox:\s*optional\s*-->$/i;
const CHOICE_MARKER =
  /^<!--\s*pr-checkbox-choice:\s*([a-z0-9-]+)\s+exactly-one\s*-->$/i;
const CHECKBOX = /^\s*-\s+\[( |x|X)\]\s+(.+)$/;
const HEADING = /^\s{0,3}(#{2,6})\s+(.+?)\s*$/;
const COMMENT_START = /^\s*<!--/;
const COMMENT_END = /-->\s*$/;

export function validatePrBody(body) {
  const errors = [];
  const choices = new Map();
  const lines = String(body ?? '').split(/\r?\n/);
  let pending = null;
  let section = 'PR body';
  let inComment = false;

  for (const [index, line] of lines.entries()) {
    const lineNumber = index + 1;
    const heading = line.match(HEADING);
    if (heading) section = heading[2];

    const choiceMarker = line.match(CHOICE_MARKER);
    if (choiceMarker) {
      pending = { kind: 'choice', group: choiceMarker[1], lineNumber };
      continue;
    }
    if (REQUIRED_MARKER.test(line)) {
      pending = { kind: 'required', lineNumber };
      continue;
    }
    if (OPTIONAL_MARKER.test(line)) {
      pending = { kind: 'optional', lineNumber };
      continue;
    }

    if (inComment || COMMENT_START.test(line)) {
      inComment = !COMMENT_END.test(line);
      continue;
    }

    const checkbox = line.match(CHECKBOX);
    if (!checkbox) continue;

    const checked = checkbox[1].toLowerCase() === 'x';
    const text = checkbox[2].trim();
    const marker = pending ?? { kind: 'required', lineNumber };
    pending = null;

    if (!marker) continue;
    if (marker.kind === 'optional') continue;

    if (marker.kind === 'required') {
      if (!checked) {
        errors.push(
          `line ${lineNumber}: ${section}: required checklist item is unchecked: ${text}`,
        );
      }
      continue;
    }

    const group = choices.get(marker.group) ?? {
      checked: 0,
      rows: [],
      firstLine: lineNumber,
    };
    group.rows.push({ checked, lineNumber, section, text });
    if (checked) group.checked += 1;
    choices.set(marker.group, group);
  }

  for (const [groupName, group] of choices.entries()) {
    if (group.checked !== 1) {
      const rows = group.rows.map((row) => row.text).join('; ');
      errors.push(
        `line ${group.firstLine}: ${groupName}: choice group must have exactly one checked item; ${group.checked} checked among: ${rows}`,
      );
    }
  }

  return { ok: errors.length === 0, errors };
}

function readBodyFromArgs() {
  const bodyFileIndex = process.argv.indexOf('--body-file');
  if (bodyFileIndex !== -1) {
    const bodyFile = process.argv[bodyFileIndex + 1];
    if (!bodyFile) {
      throw new Error('--body-file requires a path');
    }
    return readFileSync(bodyFile, 'utf8');
  }
  return process.env.PR_BODY ?? '';
}

function emitGithubError(message) {
  const escaped = message.replaceAll('%', '%25').replaceAll('\n', '%0A');
  console.error(`::error title=Required template checkbox::${escaped}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = validatePrBody(readBodyFromArgs());
  if (!result.ok) {
    for (const error of result.errors) emitGithubError(error);
    process.exit(1);
  }
  console.log('Required template checkboxes are satisfied.');
}
