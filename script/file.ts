import { glob } from "glob";
import path from "path";

// 扫描TS文件
export async function scanFileTs(scanPath: string) {
    console.log('scan:',path.join(process.cwd(), `${scanPath}/*.ts`));
    const tsFiles = await glob.sync(path.join(process.cwd(), `${scanPath}/*.ts`), {
        windowsPathsNoEscape:true
    });
    const tsxFiles = await glob.sync(path.join(process.cwd(), `${scanPath}/**/*.tsx`));
    console.log(tsFiles);
    console.log(tsxFiles);
    return tsFiles.concat(tsxFiles);
}