'use strict';

import fs from 'fs';
import path from 'path';
import parseFile from './parse-file'

function allowJSONFile(file) {
  return /\.json$/.test(file);
}

function ParseAllFiles (directory) {

  let files = fs.readdirSync(directory);

  let prophetToSuraLinks = {};
  let prophetToAyetLinks = {};
  let ayetToSuraLinks = {};

  let prophets = {};
  let suras = {};
  let ayets = {};

  let aggregateData = function (file) {
    let results = parseFile(directory, file);

    Object.assign(prophetToSuraLinks, results.prophetToSuraLinks);
    Object.assign(prophetToAyetLinks, results.prophetToAyetLinks);
    Object.assign(ayetToSuraLinks, results.ayetToSuraLinks);
    Object.assign(prophets, results.prophets);
    Object.assign(suras, results.suras);
    Object.assign(ayets, results.ayets);
  };

  files.filter(allowJSONFile).forEach(aggregateData);

  return {
    prophetToSuraLinks,
    prophetToAyetLinks,
    ayetToSuraLinks,
    prophets,
    suras,
    ayets
  };

}

module.exports = ParseAllFiles;
