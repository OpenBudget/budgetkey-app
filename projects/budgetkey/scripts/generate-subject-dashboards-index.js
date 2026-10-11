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
    } else if (entry.isFile()) {
      const slug = path.relative(ASSETS_DIR, fullPath).split(path.sep).join('/');
      console.log(`[generate-subject-dashboards-index] Skipping ${slug}: not a markdown file.`);
    }
  }
  return results;
}

function depthOf(filePath) {
  return path.relative(ASSETS_DIR, filePath).split(path.sep).length;
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
  const markdownFiles = walkMarkdownFiles(ASSETS_DIR);

  for (const filePath of markdownFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatter = parseFrontmatter(content);
    const slug = toSlug(filePath);

    if (!frontmatter) {
      console.warn(`[generate-subject-dashboards-index] Skipping ${slug}: no frontmatter block found.`);
      continue;
    }

    const missingFields = REQUIRED_FIELDS.filter((field) => !frontmatter[field]);
    if (missingFields.length > 0) {
      console.warn(
        `[generate-subject-dashboards-index] Skipping ${slug}: missing required frontmatter field(s): ${missingFields.join(', ')}.`,
      );
      continue;
    }

    entries.push({
      slug,
      depth: depthOf(filePath),
      title: frontmatter.title,
      created: frontmatter.created,
      updated: frontmatter.updated,
      model: frontmatter.model,
      path: frontmatter.path,
    });
  }

  entries.sort((a, b) => b.depth - a.depth || a.slug.localeCompare(b.slug));
  const orderedEntries = entries.map(({ depth, ...entry }) => entry);

  fs.writeFileSync(INDEX_PATH, JSON.stringify(orderedEntries, null, 2), 'utf8');
  console.log(
    `[generate-subject-dashboards-index] Scanned ${markdownFiles.length} markdown file(s), wrote ${orderedEntries.length} entries to ${INDEX_PATH}.`,
  );
}

buildIndex();
