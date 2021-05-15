const util = require('./util');
let Resolver = require('./Resolver');
/**
 * @param {string} selectedText
 */
async function comment(selectedText) {
    selectedText = util.stripComments(selectedText);
    const varName = getVarName(selectedText);
    const type = await getType(selectedText);
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
async function getType(selectedText) {
    let type = 'mixed';
    const parts = /=\s?(.+)::/.exec(selectedText);
    if (parts != null) {
        type = parts[1].replace(/[\r\n;,]$/, '');
        const resolver = new Resolver();
        let files = await resolver.findFiles(type);
        let namespaces = await resolver.findNamespaces(type, files);
        let fqcn = await resolver.pickClass(namespaces);
        type = `\\${fqcn}`
    }
    console.log(type)

    return type;
}

/**
 * @param {string} varName
 * @param {string} type
 */
function getComment(varName, type) {
    return `/** @var ${type} ${varName} */`;
}
