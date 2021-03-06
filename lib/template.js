/**
 * 
 * @name 根据用户选择添加不同的配置
 * 
 * @param {string} name 项目名称
 * @param {object} config 项目配置
 * @param {boolen} tc 是否为tnpm
 * 
 */


const path = require('path')
const copy = require('./copy')
const concat = require('./concat')
const fs = require('fs')
const ora = require('ora')
const install = require('./install')

module.exports = (name, config, tc) => {
  const __project = path.join(process.cwd(), name)
  const __pkg = path.join(__project, 'package.json')

  const typescript = config.typescript,
    useLint = config.lint,
    useTest = config.test

  const __temp = path.resolve(__dirname, '..', 'template', typescript ? 'ts' : 'es')

  const options = {
    "name": name,
    "version": config.version,
    "author": config.author || "",
    "description": config.description,
    "keywords": config.keywords.split(' '),
    "license": config.license
  }
  const Ora = new ora(`创建文件... `)

  Ora.start()

  copy(__pkg, path.join(__temp, 'package.json'))
  concat(__pkg, options)

  fs.mkdirSync(path.join(__project, 'src'))
  useTest && fs.mkdirSync(path.join(__project, 'test'))

  if (typescript) {

    copy(path.join(__project, 'src', 'index.ts'), path.join(__temp, 'index.ts'))

    if (useLint) {

      concat(__pkg, path.join(__temp, 'package-tslint.json'))

      copy(path.join(__project, 'tslint.json'), path.join(__temp, 'tslint.json'))

      copy(path.join(__project, 'tsconfig.json'), path.join(__temp, 'tsconfig.json'))

      copy(path.join(__project, 'build', 'plugins.js'), path.join(__temp, 'tslint.dev.js'))

    } else {

      copy(path.join(__project, 'build', 'plugins.js'), path.join(__temp, 'dev.js'))
    }

    if (useTest) {

      concat(__pkg, path.join(__temp, 'test', 'package-test.json'))

      copy(path.join(__project, 'jest.config.js'), path.join(__temp, 'test', 'jest.config.js'))

      copy(path.join(__project, 'test', 'index.test.ts'), path.join(__temp, 'test', 'index.test.ts'))
    }
  } else {

    copy(path.join(__project, 'src', 'index.js'), path.join(__temp, 'index.js'))

    copy(path.join(__project, '.babelrc'), path.join(__temp, '.babelrc'))

    if (useLint) {

      concat(__pkg, path.join(__temp, 'package-eslint.json'))

      copy(path.join(__project, '.eslintrc'), path.join(__temp, '.eslintrc'))

      copy(path.join(__project, 'build', 'plugins.js'), path.join(__temp, 'eslint.dev.js'))

    } else {

      copy(path.join(__project, 'build', 'plugins.js'), path.join(__temp, 'dev.js'))

    }

    if (useTest) {

      concat(__pkg, path.join(__temp, 'test', 'package-test.json'))

      copy(path.join(__project, 'test', 'index.test.js'), path.join(__temp, 'test', 'index.test.js'))
    }
  }
  
  Ora.text = '正在准备依赖包...'
  install(name, tc, Ora)
}