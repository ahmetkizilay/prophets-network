'use strict';

import math from 'mathjs';

function assignIndices(obj) {
  let counter = 0;

  Object.keys(obj).forEach(function (k) {
    obj[k] = counter;
    counter += 1;
  });
}

// Converts obj['x'] = 1 to array
// res[1] = 'x';
function convertToArray(obj) {
  let res = [];

  Object.keys(obj).forEach(function (k) {
    res[obj[k]] = k;

  });

  return res;
}

function generateCocitationGraph (prophets, cocitation) {
  let i = 0;
  let j = 0;
  let len = cocitation.size()[0];
  let links = [];

  for (i = 0; i < len; i += 1) {
    for (j = i + 1; j < len; j += 1) {
      var freq = cocitation.get([i, j]);

      if (freq > 0) {
        links.push({
          src: prophets[i],
          trg: prophets[j],
          freq: freq
        });
      }
    }
  }

  return links;
}

function generateCocitationMatrix (input) {
  let prophets = input.prophets;
  let suras = input.suras;
  let links = input.prophetToSuraLinks;

  let prophetCount = Object.keys(prophets).length;
  let suraCount = Object.keys(suras).length;

  // Assign numbers to prophets and suras
  assignIndices(prophets);
  assignIndices(suras);

  // building the adjacency matrix
  let adjacency = math.zeros(prophetCount, suraCount);

  Object.keys(links).forEach(function (k) {
    let link = links[k];

    let prophetIndex = prophets[link.prophet];
    let suraIndex = suras[link.sura];

    adjacency.set([prophetIndex, suraIndex], 1);
  });

  let cocitation = math.multiply(adjacency, math.transpose(adjacency));


  return {
    cocitation,
    prophets
  };
}

function buildCocitationGraph(input) {
  let { cocitation, prophets } = generateCocitationMatrix(input);

  prophets = convertToArray(prophets);
  return generateCocitationGraph(prophets, cocitation);
}

module.exports = buildCocitationGraph;
