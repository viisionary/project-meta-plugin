const {writeFileSync} = require("fs");
const chalk = require('chalk');
const path = require("path");
const {execSync} = require("child_process");

function git(command) {
    return execSync(`git ${command}`, {encoding: 'utf8'}).trim();
}

const GIT_TAG_VERSION = git('describe --abbrev=0')
const GIT_LATEST_AUTHOR = git('log -1 --pretty=format:%an')
const GIT_LATEST_MESSAGE = git('log -1 --pretty=format:%s')
const GIT_COMMIT_DATE = git('log -1 --pretty=format:%ad --date=format:\'%Y/%m/%d %H:%M:%S\'')

const distPath = path.resolve(__dirname, 'build/public');

class ProjectMetaPlugin {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        const {
            outputPath = distPath,
            fileName = 'meta.json',
            some_variable = {},
            tag,
            author,
            commitDate,
            commitMessage
        } = this.options;
        compiler.hooks.done.tap('meta', stats => {
            const git = {
                GIT_TAG_VERSION: tag ? GIT_TAG_VERSION : undefined,
                GIT_LATEST_AUTHOR: author ? GIT_LATEST_AUTHOR : undefined,
                GIT_LATEST_MESSAGE: commitMessage ? GIT_LATEST_MESSAGE : undefined,
                GIT_COMMIT_DATE: commitDate ? GIT_COMMIT_DATE : undefined,
                ...some_variable
            };
            const {assets} = stats.compilation;

            try {
                let filePath = outputPath + '/' + fileName;
                writeFileSync(filePath, JSON.stringify(git, null, 4));
                console.log(chalk.green.bold('meta file generated'));
            } catch (error) {
                console.log(chalk.bold.bgRed('Exception:'), chalk.bold.red(error.message));
            }
        });
    }
}

module.exports = ProjectMetaPlugin;