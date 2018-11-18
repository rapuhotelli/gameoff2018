const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const util = require('util');

const clamp = (number, min, max) => Math.max(min, Math.min(number, max));

const generateCode = (rawTileData, width) => {
  const head = `export const tileData = [ 
//  1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17   18   19   20`;

  const data = _.chunk(rawTileData, width)
    .map(row => row.map(v => clamp(v - 1, 0, v)).map(v => ` ${_.padEnd(v, 3)}`))
    .reduce((prev, curr, i) => {
      let str = `${prev}  [${curr}], // ${i + 1}\n`;
      return str;
    }, '');

  const footer = `]

export const tileSet = 'tileset1'`;

  return `${head}
${data}
${footer}
`;
};

function main(args) {
  const inputTileDataFile = require(args[2]);
  const outputTileDataFile = args[3];

  const tileDataCode = generateCode(
    inputTileDataFile.layers[0].data,
    inputTileDataFile.layers[0].width
  );

  fs.writeFileSync(outputTileDataFile, tileDataCode);
  console.log('Tile data written to file:', outputTileDataFile);
}

main(process.argv);
