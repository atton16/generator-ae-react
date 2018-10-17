const Generator = require('yeoman-generator');

const config = {
  repoUrl: 'https://github.com/atton16/react-ts-boilerplate.git',
  defaultProjectName: 'react-ts-boilerplate'
}

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('projectName', { type: String, required: false });
  }

  async prompting() {
    if (!this.options.projectName) {
      this.answers = await this.prompt([{
        type    : 'input',
        name    : 'projectName',
        message : `Please state your project name (${config.defaultProjectName}):`
      }]);
    }
  }

  install() {
    const projectName =
      this.options.projectName ||
      this.answers.projectName ||
      config.defaultProjectName;

    const pkgJson = { name: projectName };

    const done = this.async();

    this.log('[1/8] Project name is ' + projectName);
    
    this.log('[2/8] Cloning boilerplate...');
    this.spawnCommand('git', ['clone', config.repoUrl, projectName]).on('close', () => {
      this.log('[3/8] Boilerplate cloned.');
  
      this.log('[4/8] Configuring project...');
      this.fs.extendJSON(this.destinationPath(`${projectName}/package.json`), pkgJson);
      this.fs.commit(() => {
        this.log('[5/8] Project configured.');
  
        this.log('[6/8] Installing dependencies...');
        this.yarnInstall([], {}, { cwd: this.destinationPath(projectName) });
        done();
      });
    });
  }

  end() {
    this.log('[7/8] Dependencies installed.');
    this.log('[8/8] Done!');
  }
};