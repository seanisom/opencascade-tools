#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { program } from 'commander';
import figlet from 'figlet';
import { readFileSync } from 'fs';
import { basename, dirname, extname, resolve } from "path";
import { fileURLToPath } from 'url';
import { /*readIgesFile, readStepFile,*/ triangulate } from './api/node.js';
import { print } from './lib/tree.js';
import initOpenCascade from 'opencascade.js/dist/node.js';
var packPath = resolve(dirname(fileURLToPath(import.meta.url)), "..", "package.json");
var packData = readFileSync(packPath, 'utf-8');
var _a = JSON.parse(packData), name = _a.name, version = _a.version, description = _a.description;
function selectReadFile(inputPath) {
    var inputExt = extname(inputPath);
    if (inputExt == ".iges") {
        //return readIgesFile
    }
    else if (inputExt == ".stp" || inputExt == ".step") {
        //return readStepFile
    }
    else {
        throw "Input file format is not supported!";
    }
}
function selectOutputPath(inputPath, format) {
    if (format == "obj") {
        return "".concat(dirname(inputPath), "/").concat(basename(inputPath, extname(inputPath)), ".obj");
    }
    else if (format == "gltf") {
        return "".concat(dirname(inputPath), "/").concat(basename(inputPath, extname(inputPath)), ".gltf");
    }
    else if (format == "glb") {
        return "".concat(dirname(inputPath), "/").concat(basename(inputPath, extname(inputPath)), ".glb");
    }
    else {
        throw "Output file format is not supported!";
    }
}
function selectWriteFile(outputPath) {
    throw "Output file format is not supported!";
}
function processDocument(oc, docHandle, linDeflection, isRelative, angDeflection, isInParallel, outputPath) {
    print(oc, docHandle.get());
    triangulate(oc, docHandle.get(), linDeflection, isRelative, angDeflection, isInParallel);
    var writeOutputFile = selectWriteFile(outputPath);
    //writeOutputFile(oc, docHandle, outputPath)
}
function run(_a) {
    var format = _a.format, linDeflection = _a.linDeflection, isRelative = _a.isRelative, angDeflection = _a.angDeflection, isInParallel = _a.isInParallel, input = _a.input, output = _a.output;
    return __awaiter(this, void 0, void 0, function () {
        var oc, docHandle, _i, _b, inputPath, readInputFile, outputPath;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, initOpenCascade()];
                case 1:
                    oc = _c.sent();
                    docHandle = null;
                    for (_i = 0, _b = input || []; _i < _b.length; _i++) {
                        inputPath = _b[_i];
                        readInputFile = selectReadFile(inputPath);
                        console.info("Processing input file", inputPath);
                        //docHandle = readInputFile(oc, inputPath, docHandle)
                        // Print, triangulate and write output files
                        if (!output) {
                            outputPath = selectOutputPath(inputPath, format);
                            processDocument(oc, docHandle, parseFloat(linDeflection), isRelative, parseFloat(angDeflection), isInParallel, outputPath);
                            docHandle = null;
                        }
                    }
                    // Print, triangulate and write output file
                    if (output) {
                        processDocument(oc, docHandle, parseFloat(linDeflection), isRelative, parseFloat(angDeflection), isInParallel, output);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
figlet(name, function (error, result) {
    if (error) {
        console.error(error);
    }
    else {
        console.log(result);
    }
    console.log();
    program.name(name);
    program.version(version);
    program.description(description);
    program.option("-d, --debug", "debug flag", false);
    program.option("-l, --linDeflection <number>", "linear deflection value for triangulation algorithm", "0.1");
    program.option("-r, --isRelative", "is relative flag for triangulation algorithm", false);
    program.option("-a, --angDeflection <number>", "angular deflection value for triangulation algorithm", "0.1");
    program.option("-p, --isInParallel", "is in parallel flag for triangulation algorithm", false);
    program.option("-i, --input <path...>", "path to one or more IGES or STEP input files");
    program.option("-o, --output [path]", "path to single OBJ, GTLF, or GLB output file");
    program.option("-f, --format [obj|gltf|glb]", "output file format", "glb");
    program.parse();
    var options = program.opts();
    console.debug = options.debug ? console.debug : function () { };
    run(options);
});
