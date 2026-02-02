/**
 * Load all i18n translation files and expose them as global data
 * This allows templates to access translations via {{ i18n.en.key }} or {{ i18n.de.key }}
 */
const fs = require('fs');
const path = require('path');

module.exports = function() {
  const i18nDir = path.join(__dirname, 'i18n');
  const translations = {};

  // Read all JSON files in the i18n directory
  const files = fs.readdirSync(i18nDir).filter(f => f.endsWith('.json'));
  
  for (const file of files) {
    const lang = path.basename(file, '.json');
    const filePath = path.join(i18nDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    translations[lang] = JSON.parse(content);
  }

  return translations;
};
