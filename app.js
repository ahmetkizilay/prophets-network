'use strict';
require('babel-core/register');

var path = require('path');
var fs = require('fs');
var ParseAllFiles = require('./src/parse-all-files');
var csvGenerator = require('./src/csv-generator');
var buildGraphMatrix = require('./src/build-cocitation-graph');

var baseOutputPath = path.join(__dirname, 'output');

var results = ParseAllFiles(path.join(__dirname, 'data'));

var prophetToSuraGenerator = {
  data: results.prophetToSuraLinks,
  transformer: function (obj) {
    return ['Prophet', obj.prophet, 'MENTIONED_IN_SURA', 'Sura', obj.sura, obj.freq];
  },
  callback: function (str) { fs.writeFileSync(path.join(baseOutputPath, 'p_to_s.csv'), str, 'utf8'); }
};

var prophetToAyetGenerator = {
  data: results.prophetToAyetLinks,
  transformer: function (obj) {
    return ['Prophet', obj.prophet, 'MENTIONED_IN_AYET', 'Ayet', obj.ayet, ''];
  },
  callback: function (str) { fs.writeFileSync(path.join(baseOutputPath, 'p_to_a.csv'), str, 'utf8'); }
};

var ayetToSuraGenerator = {
  data: results.ayetToSuraLinks,
  transformer: function (obj) {
    return ['Ayet', obj.ayet, 'BELONGS_TO', 'Sura', obj.sura, ''];
  },
  callback: function (str) { fs.writeFileSync(path.join(baseOutputPath, 'a_to_s.csv'), str, 'utf8'); }
};

var cocitationGraph = buildGraphMatrix(results);
var p2pCocitationGraphGenerator = {
  data: cocitationGraph,
  transformer: function (obj) {
    return ['Prophet', obj.src, 'APPEARS_WITH', 'Prophet', obj.trg, obj.freq];
  },
  callback: function (str) { fs.writeFileSync(path.join(baseOutputPath, 'p_to_p.csv'), str, 'utf8'); }
};

csvGenerator(prophetToSuraGenerator);
csvGenerator(prophetToAyetGenerator);
csvGenerator(ayetToSuraGenerator);
csvGenerator(p2pCocitationGraphGenerator);
