#!/usr/bin/env node

/**
 * Update version badges in documentation
 * Fetches version info from GitHub repository branches
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const GITHUB_REPO = 'sparkison/m3u-editor';
const BRANCHES = {
  latest: 'main',
  dev: 'dev',
  experimental: 'experimental'
};

/**
 * Fetch content from GitHub raw URL
 */
function fetchGitHubFile(branch, filePath) {
  return new Promise((resolve, reject) => {
    const url = `https://raw.githubusercontent.com/${GITHUB_REPO}/${branch}/${filePath}`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`Failed to fetch ${url}: ${res.statusCode}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Parse version from dev.php content
 */
function parseVersion(content) {
  // Look for: 'version' => 'v0.8.1',
  const match = content.match(/'version'\s*=>\s*'([^']+)'/);
  return match ? match[1] : null;
}

/**
 * Update versions in documentation
 */
async function updateVersions() {
  console.log('Fetching version information from GitHub...\n');
  
  const versions = {};
  
  for (const [name, branch] of Object.entries(BRANCHES)) {
    try {
      console.log(`Fetching ${name} version from ${branch} branch...`);
      const content = await fetchGitHubFile(branch, 'config/dev.php');
      const version = parseVersion(content);
      
      if (version) {
        versions[name] = version;
        console.log(`✓ ${name}: ${version}`);
      } else {
        console.log(`✗ ${name}: Could not parse version`);
      }
    } catch (error) {
      console.log(`✗ ${name}: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('Version Summary:');
  console.log('='.repeat(50));
  
  for (const [name, version] of Object.entries(versions)) {
    console.log(`${name.padEnd(15)}: ${version}`);
  }
  
  // Save to JSON file for use in docs
  const outputPath = path.join(__dirname, '..', 'versions.json');
  fs.writeFileSync(outputPath, JSON.stringify(versions, null, 2));
  console.log(`\n✓ Versions saved to ${outputPath}`);
  
  // Update intro.md with version badges
  updateIntroMd(versions);
}

/**
 * Update intro.md with version information
 */
function updateIntroMd(versions) {
  const introPath = path.join(__dirname, '..', 'docs', 'intro.md');
  
  if (!fs.existsSync(introPath)) {
    console.log('✗ intro.md not found');
    return;
  }
  
  let content = fs.readFileSync(introPath, 'utf8');
  
  // Create version badges markdown
  const versionBadges = `
<div style={{ textAlign: 'center', padding: '0.5rem 0 1rem 0', fontSize: '0.9em' }}>
  <strong>Latest:</strong> <code>${versions.latest || 'N/A'}</code>
  {' • '}
  <strong>Dev:</strong> <code>${versions.dev || 'N/A'}</code>
  {' • '}
  <strong>Experimental:</strong> <code>${versions.experimental || 'N/A'}</code>
</div>
`;
  
  // Insert after the badges section (or create it)
  const badgesSectionRegex = /(<div style=\{\{ textAlign: 'center'[^}]+\}\}>[\s\S]*?<\/div>\s*)+/;
  
  if (content.includes('Latest:') && content.includes('Dev:')) {
    // Replace existing version section
    content = content.replace(
      /<div style=\{\{ textAlign: 'center'[^}]+fontSize[^}]+\}\}>[\s\S]*?<\/div>/,
      versionBadges.trim()
    );
  } else {
    // Insert after stats badges
    content = content.replace(
      /(<img src="https:\/\/img\.shields\.io[^>]+>\s*\}\s*<\/div>)/,
      `$1\n${versionBadges}`
    );
  }
  
  fs.writeFileSync(introPath, content);
  console.log('✓ Updated intro.md with version information');
}

// Run the script
updateVersions().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
