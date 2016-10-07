const esprima = require('esprima')

const traverse = (object, visitor) => {
  visitor(object)
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const child = object[key]
      if (typeof child === 'object' && child !== null) {
        traverse(child, visitor)
      }
    }
  }
}

const getNodes = (ast, types) => {
  let nodes = []
  traverse(ast, (node) => {
    if (types.includes(node.type)) {
      nodes.push(node)
    }
  })
  return nodes
}

module.exports = program => {
  if (!program) {
    return {
      error: 'parser did not receive a program'
    }
  }
  const ast = esprima.parse(program, { loc: true, range: true })
  const conditionals = ['IfStatement', 'ConditionalExpression', 'SwitchStatement']
  const loops = ['ForStatement', 'ForInStatement', 'ForOfStatement', 'WhileStatement', 'DoWhileStatement']
  const nodeCount = ((ast, types) => getNodes(ast, types).length).bind({}, ast)

  return {
    loc: ast.loc.end.line,
    chars: program.match(/[^\s\\]/g).length,
    conditionals: nodeCount(conditionals),
    loops: nodeCount(loops)
  }
}

