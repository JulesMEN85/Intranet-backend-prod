const { winProToSql, sqlToWinPro } = require('./mapping');

/**
 * Traduit un texte compacté SQL vers WinPro lisible
 * @param {string} sqlText - Le texte compacté
 * @returns {string} - Le texte WinPro lisible
 */
function sqlToWinProText(sqlText) {
  let result = sqlText;
  // On remplace d'abord les symboles les plus longs pour éviter les sous-remplacements
  const sortedEntries = Object.entries(sqlToWinPro).sort((a, b) => b[0].length - a[0].length);
  for (const [sqlSymbol, winProSymbol] of sortedEntries) {
    // On échappe les caractères spéciaux pour regex JS
    const esc = sqlSymbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(esc, "g"), winProSymbol);
  }
  return result;
}

/**
 * Traduit un texte WinPro lisible vers la version SQL compactée
 * @param {string} winProText - Le texte lisible
 * @returns {string} - Le texte compacté
 */
function winProTextToSql(winProText) {
  let result = winProText;
  const sortedEntries = Object.entries(winProToSql).sort((a, b) => b[0].length - a[0].length);
  for (const [winProSymbol, sqlSymbol] of sortedEntries) {
    const esc = winProSymbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(esc, "g"), sqlSymbol);
  }
  return result;
}

/**
 * Modifie la valeur d’une remise dans le texte WinPro lisible
 * @param {string} winProText - Le texte WinPro
 * @param {number|string} numeroRemise - Le numéro de remise à modifier
 * @param {number|string} nouvelleValeur - La nouvelle valeur à mettre
 * @returns {string} - Le texte modifié
 */
function updateRemiseWinPro(winProText, numeroRemise, nouvelleValeur) {
  const intValue = parseInt(nouvelleValeur, 10);

  if (isNaN(intValue)) {
    throw new Error("La nouvelle valeur de remise doit être un nombre");
  }
  if (intValue < 0 || intValue > 100) {
    throw new Error("La nouvelle valeur de remise doit être comprise entre 0 et 100%");
  }

  const pattern = new RegExp(
    `((Si|Sinon Si)\\s*\\(familleremise\\s*=\\s*${numeroRemise}\\)[\\s\\S]*?_Remise\\s*:?\\s*=?\\s*)\\d+`,
    "g"
  );

  return winProText.replace(pattern, (match, p1) => p1 + intValue);
}

module.exports = {
  sqlToWinProText,
  winProTextToSql,
  updateRemiseWinPro,
};

