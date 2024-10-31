import { Project } from "ts-morph";
import path from "path";
import { execSync } from "child_process";

/**
 * 从 Git 暂存区获取已修改的文件路径
 * @returns 已修改文件的路径列表
 */
function getModifiedFilesFromGitStaging(): string[] {
    try {
        const result = execSync('git diff --name-only').toString();
        return result.split('\n').filter(file => file); // 过滤掉空行
    } catch (error) {
        console.error('无法获取 Git 暂存区中的文件:', error);
        return [];
    }
}

/**
 * 查找引用指定文件的其他文件
 * @param projectPath 项目根目录路径
 * @param targetFilePath 目标文件路径（相对于项目根目录）
 * @returns 引用该文件的文件列表
 */
function findFileReferencesWithTsMorph(projectPath: string, targetFilePath: string): string[] {
    const project = new Project({
        tsConfigFilePath: path.join(projectPath, "tsconfig.json"),
    });

    const references: string[] = [];
    const targetSourceFile = project.getSourceFileOrThrow(targetFilePath);
    const targetFileAbsolutePath = targetSourceFile.getFilePath();

    project.getSourceFiles().forEach(sourceFile => {
        sourceFile.getImportDeclarations().forEach(importDecl => {
            const resolvedPath = importDecl.getModuleSpecifierSourceFile()?.getFilePath();

            if (resolvedPath === targetFileAbsolutePath) {
                references.push(sourceFile.getFilePath());
                const firstNode = sourceFile.getFirstChild()!; // 获取第一个子节点
                const lineNumber = firstNode.getStartLineNumber();
                const fileContent = sourceFile.getFullText().split("\n").slice(0, lineNumber-1).join("\n");
                console.log(`文件: ${sourceFile.getFilePath()} 的文件头部注释: ${fileContent}`);
            }
        });
    });

    return references;
}

const projectRoot = process.cwd();
const modifiedFiles = getModifiedFilesFromGitStaging();

if (modifiedFiles.length === 0) {
    console.log("没有找到已修改的文件。");
} else {
    modifiedFiles.forEach(targetFile => {
        const references = findFileReferencesWithTsMorph(projectRoot, targetFile);
        console.log(`引用文件 ${targetFile} 的文件:`, references);
    });
}
