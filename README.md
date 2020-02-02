# Tournament Selection Genetic Algorithm
A basic class for running tournament selection based genetic algorithms in JavaScript.

## A simple example...
This will produce a random population of 50 genotypes, each made up of 0's or 1's, evolving for 1000 generations to contain as many 1's as possible (see fitness function).

```
const GeneticAlgorithm = require('GeneticAlgorithm');

// Length of each genotype
const geneLength = 8;

// Genes available for producing genotypes
const genes = [0,1];

// Count of genotypes
const populationCount = 50;

// Count of times (roughly) each genotype is evolved
const generationCount = 1000;

// Class instance
const geneticAlgorithm = new GeneticAlgorithm(geneLength,genes);

// Very basic fitness function
geneticAlgorithm.fitness = G => G.reduce((a,v) => a+v,0);

// Generate and evolve a population
geneticAlgorithm.run(populationCount,generationCount);

// Log the newly evolved population
console.log(geneticAlgorithm.population);
```
