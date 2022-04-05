import { Compiler, Compilation } from "webpack";
export = ProjectMetaPlugin;

declare class ProjectMetaPlugin {
    constructor(options?: ProjectMetaPlugin.Options);
    apply(compiler: Compiler): void;
    static getHooks(compilation: Compilation): ProjectMetaPlugin.Hooks;

}

declare namespace ProjectMetaPlugin {
    interface Options {
        tag: boolean
        author: boolean,
        buildDate: boolean,
        commitMessage: boolean,
        some_variable: Record<string, string>
    }
    interface Hooks {
        after: () => any
        before: () => any
    }
}
