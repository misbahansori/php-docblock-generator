const util = require('./util');

/**
 * @param {string} selectedText
 */
function comment(selectedText) {
    selectedText = util.stripComments(selectedText);
    const varName = getVarName(selectedText);
    const type = getType(selectedText);
    return getComment(varName, type);
}

exports.comment = comment;

/**
 * @param {string} selectedText
 */
function getVarName(selectedText) {
    const parts = /\$([\w_-]+)/.exec(selectedText);
    return parts[0];
}

/**
 * @param {string} selectedText
 */
function getType(selectedText) {
    let type = 'mixed';
    const parts = /=\s?(.+)::/.exec(selectedText);
    if (parts != null) {
        type = parts[1].replace(/[\r\n;,]$/, '');
    }

    console.log({parts, type})

    return type;
}

/**
 * @param {string} varName
 * @param {string} type
 */
function getComment(varName, type) {
    return `/** @var ${type} ${varName} */`;
}
