import { scanFileTs } from "./file";
import { ICodeAnalysisOptions } from "./interface";

class CodeAnalysis {
    private _scanSource: string[];
    constructor(options: ICodeAnalysisOptions) {
         // 私有属性
        this._scanSource = options.scanSource; // 需要扫描的目录 
    }

     // 扫描文件
  _scanFiles(scanSource: string[], type) {
    console.log('scanSource', scanSource);
    let entrys = [];
    scanSource.forEach((path: string) => {
        const tsFiles = scanFileTs(path);
    });
  }

  analysis(){
    this._scanFiles(this._scanSource, 'ts');
  }
}

export default CodeAnalysis