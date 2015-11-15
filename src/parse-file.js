'use strict';

import fs from 'fs';
import path from 'path';

const ParseFile = function (basePath, file) {

  let fileJSON = JSON.parse(fs.readFileSync(path.join(basePath, file), 'utf8'));
  let results = fileJSON['Result'];

  let prophet = file.replace(/\.json/, '');

  let prophets = {};
  let suras = {};
  let ayets = {};
  let prophetToSuraLinks = {};
  let prophetToAyetLinks = {};
  let ayetToSuraLinks = {};

  results.forEach((result) => {

    let sura = result['SureId'];
    let ayet = `${sura}:${result['AyetNumber']}`;

    var prophetToSura = `${prophet}_${sura}`;
    var prophetToAyet = `${prophet}_${ayet}`;
    var ayetToSura = `${ayet}_${sura}`;

    if (!prophetToSuraLinks[prophetToSura]) {
      prophetToSuraLinks[prophetToSura] = {
        prophet,
        sura,
        freq: 1
      };
    }
    else {
      prophetToSuraLinks[prophetToSura].freq += 1;
    }

    if (!prophetToAyetLinks[prophetToAyet]) {
      prophetToAyetLinks[prophetToAyet] = {
        prophet,
        ayet
      };
    }

    if (!ayetToSuraLinks[ayetToSura]) {
      ayetToSuraLinks[ayetToSura] = {
        ayet,
        sura
      };
    }

    if (!ayets[ayet]) {
      ayets[ayet] = {
        text: result['Text']
      }
    }

    if (!suras[sura]) {
      suras[sura] = true;
    }

    prophets[prophet] = true;

  });


  return {
    ayetToSuraLinks,
    prophetToSuraLinks,
    prophetToAyetLinks,
    prophets,
    ayets,
    suras
  };

}

module.exports = ParseFile;

