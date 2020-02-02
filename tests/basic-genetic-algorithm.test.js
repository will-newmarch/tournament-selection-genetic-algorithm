'use strict';

const GeneticAlgorithm = require('../src/GeneticAlgorithm.js');

let geneticAlgorithm;
const geneLength = 8;
const genes = [0,1];
const populationCount = 50;
const generationCount = 1000;

beforeEach(() => {

    geneticAlgorithm = new GeneticAlgorithm(geneLength,genes);

    // Very basic fitness function
    geneticAlgorithm.fitness = G => G.reduce((a,v) => a+v,0);

});

test('library converges as expected with basic example', () => {

    geneticAlgorithm.run(populationCount,generationCount);

    for(let individual of geneticAlgorithm.population) {
        
        expect(individual.reduce((a,v) => a+v,0) >= 7).toEqual(true);;

    }

});

test('library converges without demes', () => {

    geneticAlgorithm.demes = false;
    
    geneticAlgorithm.crossoverFn = geneticAlgorithm.singlePointCrossover;

    geneticAlgorithm.run(populationCount,generationCount);

    for(let individual of geneticAlgorithm.population) {
        
        expect(individual.reduce((a,v) => a+v,0) >= 7).toEqual(true);

    }

});

test('library converges with single point crossover', () => {

    geneticAlgorithm.crossoverFn = geneticAlgorithm.singlePointCrossover;

    geneticAlgorithm.run(populationCount,generationCount);

    for(let individual of geneticAlgorithm.population) {
        
        expect(individual.reduce((a,v) => a+v,0) >= 7).toEqual(true);

    }

});

test('library converges with two point crossover', () => {

    geneticAlgorithm.crossoverFn = geneticAlgorithm.twoPointCrossover;

    geneticAlgorithm.run(populationCount,generationCount);

    for(let individual of geneticAlgorithm.population) {
        
        expect(individual.reduce((a,v) => a+v,0) >= 7).toEqual(true);

    }

});

test('library converges with uniform crossover', () => {

    geneticAlgorithm.crossoverFn = geneticAlgorithm.uniformCrossover;

    geneticAlgorithm.run(populationCount,generationCount);

    for(let individual of geneticAlgorithm.population) {
        
        expect(individual.reduce((a,v) => a+v,0) >= 7).toEqual(true);

    }

});

test('library increments generation integers of each genotype', () => {

    geneticAlgorithm.crossoverFn = geneticAlgorithm.uniformCrossover;

    geneticAlgorithm.run(populationCount,generationCount);

    for(let individual of geneticAlgorithm.population) {
        
        expect(isNaN(individual.generation)).toEqual(false);

    }

});

test("library throws error when fitness function is not set", () => {
    
    const geneticAlgorithm = new GeneticAlgorithm();

    expect(geneticAlgorithm.fitness).toThrow(Error);

    expect(geneticAlgorithm.run).toThrow(Error);

});

test('library no-crossover method works as expected', () => {

    const output = geneticAlgorithm.noCrossover(1,0);
       
    expect(output).toEqual(1);

});