import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

const dir = 'docs/evidence';
const statuses = ['planned', 'draft', 'locally verified', 'GitHub Actions verified', 'consumer verified'];
const files = readdirSync(dir).filter((name) => name.endsWith('.json'));

test('evidence directory has at least one record', () => {
  assert.ok(files.length > 0, `no JSON records in ${dir}`);
});

for (const file of files) {
  test(`${file} is a valid evidence record`, () => {
    const record = JSON.parse(readFileSync(`${dir}/${file}`, 'utf8'));
    assert.equal(record.schema_version, 1);
    assert.match(record.chapter, /^\d{2}$/);
    assert.ok(statuses.includes(record.status), `unknown status "${record.status}"`);
    assert.ok(Array.isArray(record.limitations), 'limitations must be an array');

    const tier = statuses.indexOf(record.status);
    if (tier <= statuses.indexOf('draft')) return;

    const required = ['tooling_revision', 'documentation_revision', 'verified_at', 'environment'];
    if (tier >= statuses.indexOf('GitHub Actions verified')) required.push('run_url');
    if (record.status === 'consumer verified') required.push('consumer_revision');
    for (const key of required) {
      assert.ok(record[key], `${key} is required once status is "${record.status}"`);
    }
    assert.ok(record.positive_check?.observed, 'positive_check.observed is required');
    assert.ok(record.negative_check?.observed, 'negative_check.observed is required');
  });
}
