import { readFile } from 'node:fs/promises';

const reviewedFiles = [
  'src/pages/projects/axiomatic-am-test-artifact.mdx',
  'src/pages/fr/projets/artefact-fabrication-additive-conception-axiomatique.mdx',
  'public/projects/am-test-artifact/metrology-summary.svg',
];

const forbiddenPhrases = [
  'owner-supplied',
  'supplied photo sheet',
  'reported values',
  'available archive does not contain the raw point cloud',
  'no raw point cloud',
  'valeurs rapportées',
  'planche photographique fournie',
  'l’archive disponible ne contient ni le nuage de points brut',
];

const requiredAuthorship = new Map([
  [reviewedFiles[0], ['I carried out the design and metrology activities', 'cleaning and adaptively filtering the laser-scan point cloud']],
  [reviewedFiles[1], ['J’ai réalisé les activités de conception et de métrologie', 'nettoyage et le filtrage adaptatif du nuage de points laser']],
]);

const failures = [];

for (const file of reviewedFiles) {
  const text = await readFile(file, 'utf8');
  const lower = text.toLowerCase();

  for (const phrase of forbiddenPhrases) {
    if (lower.includes(phrase.toLowerCase())) {
      failures.push(`${file}: forbidden wording “${phrase}”`);
    }
  }

  for (const phrase of requiredAuthorship.get(file) ?? []) {
    if (!text.includes(phrase)) {
      failures.push(`${file}: missing authorship wording “${phrase}”`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Author-voice check passed for ${reviewedFiles.length} files.`);
