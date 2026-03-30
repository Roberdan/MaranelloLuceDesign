import { STARTER_MANIFESTS } from './manifest.js';

export interface InstantiationResult {
  success: boolean;
  manifestId: string;
  targetDir: string;
  files: string[];
  errors: string[];
}

/**
 * Dry-run instantiation: validates the manifest and returns the file list that
 * WOULD be created in targetDir. No filesystem I/O is performed.
 */
export function instantiateStarter(manifestId: string, targetDir: string): InstantiationResult {
  const manifest = STARTER_MANIFESTS.find((m) => m.id === manifestId);

  if (!manifest) {
    return {
      success: false,
      manifestId,
      targetDir,
      files: [],
      errors: [`Unknown starter manifest: "${manifestId}". Valid ids: ${STARTER_MANIFESTS.map((m) => m.id).join(', ')}`],
    };
  }

  if (!targetDir || targetDir.trim() === '') {
    return {
      success: false,
      manifestId,
      targetDir,
      files: [],
      errors: ['targetDir must be a non-empty string'],
    };
  }

  const resolvedFiles = manifest.files.map((f) => `${targetDir}/${f}`);

  return {
    success: true,
    manifestId,
    targetDir,
    files: resolvedFiles,
    errors: [],
  };
}
