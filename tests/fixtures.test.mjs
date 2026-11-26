import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8' });
  assert.ifError(result.error);
  return { status: result.status, output: `${result.stdout}${result.stderr}` };
}

test('remark rejects a broken relative link and names the missing file', () => {
  const { status, output } = run('node_modules/.bin/remark', [
    '--frail',
    '--no-stdout',
    '--no-color',
    'fixtures/docs/broken-link.md',
  ]);
  assert.notEqual(status, 0, output);
  assert.match(output, /fixtures\/docs\/broken-link\.md/);
  assert.match(output, /Cannot find file `does-not-exist\.md`/);
});

test('actionlint rejects a job with no runs-on and names the file', () => {
  const { status, output } = run('actionlint', ['-no-color', 'fixtures/workflows/malformed.yml']);
  assert.notEqual(status, 0, output);
  assert.match(output, /fixtures\/workflows\/malformed\.yml/);
  assert.match(output, /"runs-on" section is missing/);
});
