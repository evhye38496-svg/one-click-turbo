import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { execFileSync } from 'child_process';
import { runTests } from '@vscode/test-electron';

function getWindowsShortPath(targetPath: string): string | undefined {
  try {
    const output = execFileSync('cmd.exe', ['/d', '/c', `for %I in ("${targetPath}") do @echo %~sI`], {
      encoding: 'utf8'
    }).trim();

    return output && !/\s/.test(output) ? output : undefined;
  } catch {
    return undefined;
  }
}

function getPathWithoutSpaces(projectRoot: string): string {
  if (!/\s/.test(projectRoot)) {
    return projectRoot;
  }

  if (process.platform !== 'win32') {
    return projectRoot;
  }

  const shortPath = getWindowsShortPath(projectRoot);
  if (shortPath) {
    return shortPath;
  }

  return createStagingCopy(projectRoot);
}

function createStagingCopy(projectRoot: string): string {
  const stagingRoot = path.join(os.tmpdir(), 'perfscope-vscode-test-root');
  fs.rmSync(stagingRoot, { recursive: true, force: true });
  fs.mkdirSync(stagingRoot, { recursive: true });

  for (const entry of ['package.json', 'out', 'node_modules']) {
    const source = path.join(projectRoot, entry);
    const target = path.join(stagingRoot, entry);
    if (fs.existsSync(source)) {
      fs.cpSync(source, target, { recursive: true });
    }
  }

  return stagingRoot;
}

async function main(): Promise<void> {
  const projectRoot = path.resolve(__dirname, '../../..');
  const extensionDevelopmentPath = getPathWithoutSpaces(projectRoot);
  const extensionTestsPath = path.join(extensionDevelopmentPath, 'out', 'test', 'vscode', 'suite', 'index');
  const testDataRoot = path.join(os.tmpdir(), 'perfscope-vscode-test-data');
  const userDataDir = path.join(testDataRoot, 'user-data');
  const extensionsDir = path.join(testDataRoot, 'extensions');
  fs.rmSync(testDataRoot, { recursive: true, force: true });
  fs.mkdirSync(userDataDir, { recursive: true });
  fs.mkdirSync(extensionsDir, { recursive: true });

  await runTests({
    extensionDevelopmentPath,
    extensionTestsPath,
    launchArgs: [
      '--disable-updates',
      '--skip-welcome',
      '--skip-release-notes',
      '--user-data-dir',
      userDataDir,
      '--extensions-dir',
      extensionsDir
    ]
  });
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
