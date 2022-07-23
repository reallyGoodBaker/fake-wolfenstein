"use strict";
//简单的 paths 映射
//缺陷：paths 中每个数组只能存放一个路径
//特殊：通过/**@map*/标记需要映射的字符串
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
//此文件默认路径"/out/pathMap.js"
//映射时从相对于此文件的这个位置开始遍历文件
const MAP_ENTRY = path.resolve(__dirname, '../dist');
//tsconfig 文件相对于此文件打包后的位置
const TSCONFIG_PATH = path.resolve(__dirname, '../tsconfig.json');
//具有数组内后缀名的文件才会被处理
const matchedSuffix = [
    '.js', '.mjs'
];
function pathJoin(...paths) {
    return path.join(...paths).replace(/\\/g, '/');
}
function matchSuffix(target, matchArr) {
    for (const suffix of matchArr) {
        if (target.endsWith(suffix))
            return true;
    }
    return false;
}
const tsConfig = JSON.parse(fs.readFileSync(TSCONFIG_PATH)
    .toString()
    .replace(/\/\/.*[\n\r]*/g, '')
    .replace(/[\s]\/\*[\s|\S]*?\*\//g, ''));
function fileForeach(dir, handler) {
    fs.readdirSync(dir).forEach(_file => {
        const realPath = pathJoin(dir, _file);
        const stat = fs.statSync(realPath);
        if (stat.isFile() && matchSuffix(_file, matchedSuffix)) {
            fs.writeFile(realPath, handler.call(null, fs.readFileSync(realPath).toString(), pathJoin(realPath, '../')), () => null);
        }
        if (stat.isDirectory()) {
            fileForeach(realPath, handler);
        }
    });
}
async function main() {
    const { paths, outDir, rootDir, baseUrl } = tsConfig.compilerOptions;
    const baseUrlFromTsconfigDir = path.join(TSCONFIG_PATH, '../', baseUrl);
    const virtPaths = Object.keys(paths);
    const virtRealMap = new Map();
    for (let virt of virtPaths) {
        let real = paths[virt][0].replace(rootDir, outDir); //在编译之后进行映射，目标就从rootDir变成outDir了
        real = pathJoin(baseUrlFromTsconfigDir, real); //绝对真实路径
        real = path.relative(MAP_ENTRY, real); //相对真实路径
        if (virt[virt.length - 1] === '*') {
            virt = virt.slice(0, -1);
            real = real.slice(0, -1);
        }
        virtRealMap.set(virt, real);
    }
    const rewriteRequires = (rawScript, scriptDir) => {
        const replacer = (_, requirePath) => {
            for (const virt of virtRealMap.keys()) {
                if (!requirePath.startsWith(virt))
                    continue;
                const relativeRealPath = virtRealMap.get(virt), scriptToRoot = path.relative(scriptDir, MAP_ENTRY), rootToRequire = requirePath.replace(virt, relativeRealPath), trueRequirePath = pathJoin(scriptToRoot, rootToRequire);
                _ = _.replace(requirePath, trueRequirePath.startsWith('.')
                    ? trueRequirePath + '.js'
                    : './' + trueRequirePath + '.js');
            }
            return _;
        };
        return rawScript.replace(/from '(.*?)'/g, replacer)
            .replace(/\/\*\*@map\*\/[\s]*'(.*?)'/g, replacer)
            .replace(/\/\*\*@map\*\/[\s]*"(.*?)"/g, replacer)
            .replace(/\/\*\*@map\*\/[\s]*`(.*?)`/g, replacer);
    };
    fileForeach(MAP_ENTRY, rewriteRequires);
}
// main();
module.exports = main