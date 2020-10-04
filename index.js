#!/usr/bin/env node
const fs = require('fs');
const readline = require('readline');
const path = require("path");

var argv=require("yargs")
		.usage("Usage: tez-css <options> [value]")
		.alias("v","version")
		.describe("v","show version info")
		.boolean("v")
		.help("h")
		.alias("h","help")
		.describe("h","show help info")
        .argv;
        
var version = require("./package.json").version;
if(argv.v){
    console.log("tez-css "+version);
    return;
}

async function parseBeginEnd(file) {
    const fileStream = fs.createReadStream(file);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let includedContent = {};

    let regexPatternBegin = /\/\* begincomponent: ([a-zA-Z0-9_-]+)/ig;
    let regexPatternEnd = /\/\* endcomponent: ([a-zA-Z0-9_-]+)/ig;
    let line_no = 0;
    let characters = 0;
    for await (const line of rl) {
        line_no++;
        var regexMatch = null;
        regexPatternBegin = /\/\* begincomponent: ([a-zA-Z0-9_-]+)/ig;
        regexPatternEnd = /\/\* endcomponent: ([a-zA-Z0-9_-]+)/ig;
        if(line.startsWith("/* BEGINCOMPONENT:")) {
            var compStatus = "begin";
            regexMatch = regexPatternBegin.exec(line);
        }
        if(line.startsWith("/* ENDCOMPONENT:")) {
            var compStatus = "end";
            regexMatch = regexPatternEnd.exec(line);
            characters = characters + Buffer.byteLength(line, 'utf8') + 1;
            next_characters = characters;
        }        
        else {
            next_characters = characters + Buffer.byteLength(line, 'utf8') + 1;
        }
        if(regexMatch) {
            compTitle = regexMatch[1];
            compValue = line_no;
            compValue = characters;
            if(compTitle in includedContent) {
                includedContent[compTitle][compStatus] = compValue;
            }
            else {
                includedContent[compTitle] = {}
                includedContent[compTitle][compStatus] = compValue;
            }
        }
        characters = next_characters;
    }
    return includedContent;
}

async function generateResult(parsedContent, file, tezConfigFile) {
    let source = path.join(process.cwd(), file['file']);
    let sections = file['sections'];
    for (const section of sections) {
        if(section in parsedContent) {
            fs.open(source, 'r+', function (err, fd) {
                begin = parsedContent[section]['begin'];
                end = parsedContent[section]['end'] + 1;
                var bytesToRead = (end - begin);
                let buffer = new Buffer.alloc(bytesToRead);
                if (err) { return console.error(err);}
                fs.read(fd, buffer, 0, bytesToRead, begin, function (err, bytes) {
                    if (err) { console.log(err);}
                    if (bytes > 0) {
                        content = buffer.slice(0, bytes).toString();
                        fs.open(tezConfigFile, 'a+', function (err, fdw) {
                            if (err) {throw "error!";}
                            fs.write(fdw, buffer, 0, bytes, null, function (err) {
                                if (err) { throw "error!";}
                                fs.close(fdw, function () { console.log("Block Copied...");});
                            });
                        });
                    }
                });
            });
        }}}

async function main() {
    const tezConfig = require(path.join(process.cwd(), 'tez-css.config'));

    let tezConfigFile = path.join(process.cwd(), tezConfig['output']);
    if (fs.existsSync(tezConfigFile)){
        fs.unlinkSync(tezConfigFile);
    }
    let includedFiles = tezConfig['include'];
    for (const file of includedFiles) {
        console.log(`Parsing file ${file['file']}...`);
        let parsedContent = await parseBeginEnd(file['file']);
        console.log(`Fetching blocks from ${file['file']}...`);
        generateResult(parsedContent, file, tezConfigFile);
    }
}

main()
