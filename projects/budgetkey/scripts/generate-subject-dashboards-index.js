const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'src', 'assets', 'subject-dashboards');
const INDEX_PATH = path.join(ASSETS_DIR, 'index.json');
const REQUIRED_FIELDS = ['title', 'created', 'updated', 'model', 'path'];

function walkMarkdownFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walkMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return null;
  }

  const frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const fieldMatch = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (!fieldMatch) {
      continue;
    }
    const [, key, rawValue] = fieldMatch;
    frontmatter[key] = rawValue.trim().replace(/^["'](.*)["']$/, '$1');
  }
  return frontmatter;
}

function toSlug(filePath) {
  return path
    .relative(ASSETS_DIR, filePath)
    .replace(/\.md$/, '')
    .split(path.sep)
    .join('/');
}

function buildIndex() {
  const entries = [];

  for (const filePath of walkMarkdownFiles(ASSETS_DIR)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatter = parseFrontmatter(content);
    const slug = toSlug(filePath);

    if (!frontmatter || REQUIRED_FIELDS.some((field) => !frontmatter[field])) {
      console.warn(`[generate-subject-dashboards-index] Skipping ${slug}: missing required frontmatter field(s).`);
      continue;
    }

    entries.push({
      slug,
      title: frontmatter.title,
      created: frontmatter.created,
      updated: frontmatter.updated,
      model: frontmatter.model,
      path: frontmatter.path,
    });
  }

  fs.writeFileSync(INDEX_PATH, JSON.stringify(entries, null, 2), 'utf8');
  console.log(`[generate-subject-dashboards-index] Wrote ${entries.length} entries to ${INDEX_PATH}`);
}

buildIndex();
