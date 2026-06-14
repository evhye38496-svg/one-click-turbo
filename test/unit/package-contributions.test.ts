import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

type PackageJson = {
  version?: string;
  preview?: boolean;
  private?: boolean;
  icon?: string;
  activationEvents?: string[];
  contributes?: {
    viewsContainers?: {
      activitybar?: Array<{ id: string; title: string; icon: string }>;
    };
    views?: Record<string, Array<{ id: string; name: string; type?: string }>>;
  };
};

function packageJson(): PackageJson {
  return JSON.parse(readFileSync('package.json', 'utf8')) as PackageJson;
}

test('package contributes PerfScope activity bar container and dashboard view', () => {
  const pkg = packageJson();

  assert.ok(pkg.activationEvents?.includes('onView:perfscope.dashboard'));
  assert.deepEqual(pkg.contributes?.viewsContainers?.activitybar?.find((view) => view.id === 'perfscope'), {
    id: 'perfscope',
    title: 'PerfScope',
    icon: 'resources/perfscope.svg'
  });
  assert.deepEqual(pkg.contributes?.views?.perfscope?.find((view) => view.id === 'perfscope.dashboard'), {
    type: 'webview',
    id: 'perfscope.dashboard',
    name: 'Dashboard'
  });
});

test('package is marked as V1.0 Marketplace-ready metadata', () => {
  const pkg = packageJson();

  assert.equal(pkg.version, '1.0.0');
  assert.equal(pkg.preview, undefined);
  assert.equal(pkg.private, undefined);
  assert.equal(pkg.icon, 'resources/perfscope-128.png');
});
