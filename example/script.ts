import CodeAnalysis from "../script";

const config = {
    scanSource: ['src']
}

const analysisInstance = new CodeAnalysis(config);
analysisInstance.analysis();