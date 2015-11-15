'use strict';

import stringify from 'csv-stringify';

var defaultHeader = [
  'NODE TYPE',
  'NODE NAME',
  'EDGE TYPE',
  'NODE TYPE',
  'NODE NAME',
  'Weight'
];

function GenerateCSV (params) {
  var output = [];

  var stringifier = stringify({delimiter: ','});
  stringifier.on('readable', function() {
    let row;
    while((row = stringifier.read())) {
      output.push(row);
    }
  });
  stringifier.on('finish', () => {
    params.callback(output.join(''));
  });

  stringifier.write(params.header || defaultHeader);

  Object.keys(params.data).map((k) => { return params.data[k]; }).map(params.transformer).forEach(function (item) {
    stringifier.write(item)
  });

  stringifier.end();
}

module.exports = GenerateCSV;
