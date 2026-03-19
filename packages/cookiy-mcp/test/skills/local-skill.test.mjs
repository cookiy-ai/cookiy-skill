import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, realpath, symlink, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { platform, tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import {
  installLocalSkill,
  removeLocalSkill,
  resolvePackagedSkillAssetsDir,
  resolveLocalSkillPath,
  supportsLocalSkillInstall,
} from '../../lib/skills/local-skill.mjs';

const testDir = dirname(fileURLToPath(import.meta.url));
const packageDir = join(testDir, '..', '..');

test('resolves local skill paths for supported clients', () => {
  assert.equal(resolveLocalSkillPath('codex', 'cookiy', '/tmp/home'), '/tmp/home/.agents/skills/cookiy');
  assert.equal(resolveLocalSkillPath('claudeCode', 'cookiy', '/tmp/home'), '/tmp/home/.claude/skills/cookiy');
  assert.equal(resolveLocalSkillPath('openclaw', 'cookiy', '/tmp/home'), '/tmp/home/.openclaw/skills/cookiy');
  assert.equal(resolveLocalSkillPath('cursor', 'cookiy', '/tmp/home'), null);
  assert.equal(supportsLocalSkillInstall('codex'), true);
  assert.equal(supportsLocalSkillInstall('cursor'), false);
});

test('resolves packaged skill assets from explicit env path', () => {
  process.env.COOKIY_SKILL_ASSETS_DIR = join(tmpdir(), 'cookiy-nonexistent-skill-assets');
  const resolved = resolvePackagedSkillAssetsDir({
    runtimePath: '/tmp/app/bin/cli.mjs',
    execPath: '/tmp/app/cookiy',
  });
  assert.equal(resolved, null);
  delete process.env.COOKIY_SKILL_ASSETS_DIR;
});

test('resolves packaged skill assets when runtime path is an npx-style .bin symlink', {
  skip: platform() === 'win32',
}, async () => {
  const tempRoot = await mkdtemp(join(tmpdir(), 'cookiy-skill-assets-'));
  const packageRoot = join(tempRoot, 'node_modules', 'cookiy-mcp');
  const binDir = join(packageRoot, 'bin');
  const skillAssetsDir = join(packageRoot, 'skill-assets');
  const shimDir = join(tempRoot, 'node_modules', '.bin');
  const cliPath = join(binDir, 'cli.mjs');
  const shimPath = join(shimDir, 'cookiy-mcp');

  await mkdir(binDir, { recursive: true });
  await mkdir(skillAssetsDir, { recursive: true });
  await mkdir(shimDir, { recursive: true });
  await writeFile(cliPath, '#!/usr/bin/env node\n');
  await symlink('../cookiy-mcp/bin/cli.mjs', shimPath);

  const resolved = resolvePackagedSkillAssetsDir({
    runtimePath: shimPath,
    execPath: '/usr/bin/node',
  });

  assert.equal(resolved, await realpath(skillAssetsDir));
});

test('installs and removes packaged local skill assets', async () => {
  const homeDir = await mkdtemp(join(tmpdir(), 'cookiy-skill-home-'));
  const targetDir = await installLocalSkill('claudeCode', 'cookiy', {
    homeDir,
    skillAssetsDir: join(packageDir, 'skill-assets'),
  });

  const rootSkill = await readFile(join(targetDir, 'SKILL.md'), 'utf8');
  const nestedSkill = await readFile(join(targetDir, 'skills', 'cookiy', 'SKILL.md'), 'utf8');

  assert.match(rootSkill, /^---/m);
  assert.match(nestedSkill, /^---/m);

  await removeLocalSkill('claudeCode', 'cookiy', { homeDir });
  assert.equal(resolveLocalSkillPath('claudeCode', 'cookiy', homeDir), join(homeDir, '.claude', 'skills', 'cookiy'));
});
