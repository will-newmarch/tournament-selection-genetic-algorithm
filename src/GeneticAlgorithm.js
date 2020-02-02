class GeneticAlgorithm {

    /**
     * GeneticAlgorithm
     * @param {number} geneLength the size Genotypes can be.
     * @param {Array} genes the available values a Genotype can consist of.
     */
    constructor(geneLength = 10,genes = [0,1]) {
        this.geneLength             = geneLength;
        this.genes                  = genes;
        this.crossoverFn            = this.singlePointCrossover;
        this.mutationProbability    = 0.01;
        this.demes                  = true;
    }

    /**
     * Generate a population of Genotypes of length 'size'
     * @param {number} size 
     */
    generatePopulation(size) {
        const population = [];
        for(let i = 0; i < size; i++) {
            const genotype = [];
            for(let i = 0; i < this.geneLength; i++) {
                const randomGene = this.genes[Math.floor(Math.random()*this.genes.length)];
                genotype.push(randomGene);
            }
            genotype.generation = 0;
            population.push(genotype);
        }
        this.population = population;
    }

    setPopulation(data) {
        this.population = data;
        for(let i = 0; i < this.population.length; i++) {
            this.population[i].generation = 0;
        }
    }

    /**
     * Select two random indices of the population
     */
    selectRandomGenotypes() {
        let index1,index2;
        if(this.demes) {
            index1 = Math.floor(Math.random()*this.population.length);
            index2 = index1 + ( (Math.random() < 0.5 && index1 > 0) || index1 == this.population.length-1 ? -1 : 1);
        } else {
            while(index1 === index2) {
                index1 = Math.floor(Math.random()*this.population.length);
                index2 = Math.floor(Math.random()*this.population.length);
            }
        }
        return [index1,index2];
    }

    /**
     * Compare fitness of genotypes and return winner and loser indicies.
     * If fitnesses are equal, then still return one as 
     * winner and one as loser to allow for mutation.
     * @param {Genotype} G1 
     * @param {Genotype} G2 
     */
    tournament(G1,G2) {
        const f1 = this.fitness(G1);
        const f2 = this.fitness(G2);
        if(f1 > f2) {
            return [0,1];
        } else {
            return [1,0];
        }
    }

    /**
     * Mutate the supplied Genotype with the supplied genes
     * @param {Genotype} G 
     * @param {Array} genes 
     * @param {number} probability 
     */
    mutate(G,probability = 0.01,genes = [0,1]) {
        for(let i = 0; i < G.length; i++) {
            if(Math.random() < probability) {
                G[Math.floor(Math.random()*G.length)] = genes[Math.floor(Math.random()*genes.length)];
            }
        }
        return G;
    }

    /**
     * Return the fitness of the supplied Genotype
     * @param {Genotype} G 
     */
    fitness(G) {
        throw new Exception('Fitness function must be overidden!');
    }

    /**
     * Split each Genotype by a random index and concatenate.
     * @param {Genotype} winner 
     * @param {Genotype} loser 
     */
    singlePointCrossover(winner,loser) {
        const crossoverIndex = Math.floor(Math.random()*winner.length);
        return [].concat(winner.slice().splice(0,crossoverIndex),loser.slice().splice(crossoverIndex));
    }
      
    /**
     * Split each Genotype by a two random indices and concatenate.
     * @param {Genotype} winner 
     * @param {Genotype} loser 
     */
    twoPointCrossover(winner,loser) {
        const sections = [
            Math.floor(Math.random()*winner.length),
            Math.floor(Math.random()*winner.length)
        ].sort((a,b) => a-b);
        return [].concat(
            winner.slice().splice(0,sections[0]), 
            loser.slice().splice(sections[0],(sections[1]-sections[0])), 
            winner.slice().splice(sections[1])
        );
    }
       
    /**
     * Create a new Genotype by randomly selecting genes from each of the winner and loser.
     * @param {Genotype} winner 
     * @param {Genotype} loser 
     */
    uniformCrossover(winner,loser) {
        const offspring = [];
        const probability = 0.5
        for(let i = 0; i < winner.length; i++) {
            if(Math.random() < probability) {
                offspring.push(winner[i]);
            } else {
                offspring.push(loser[i]);
            }
        }
        return offspring;
    }

    /**
     * Just keep the winner.
     * @param {Genotype} winner 
     * @param {Genotype} loser 
     */
    noCrossover(winner,loser) {
        return winner;
    }

    /**
     * Run the algorithm
     * @param {number} populationCount 
     * @param {number} generationCount 
     */
    run(populationCount = 100, generationCount = 100) {

        this.generatePopulation(populationCount);

        for(let i = 0; i < generationCount * populationCount; i++) {

            // select tornament contestants
            const contestantIndicies = this.selectRandomGenotypes();
            
            // decide winner and loser
            const outcome = this.tournament(this.population[contestantIndicies[0]],this.population[contestantIndicies[1]]);
            
            // crossover and apply new genotype to loser
            this.population[contestantIndicies[outcome[1]]] = this.crossoverFn(this.population[contestantIndicies[0]],this.population[contestantIndicies[1]]);

            // mutate loser slightly
            this.population[contestantIndicies[outcome[1]]] = this.mutate(this.population[contestantIndicies[outcome[1]]],this.mutationProbability);

            // Increase generation (based on winner's generation)
            this.population[contestantIndicies[outcome[1]]].generation = this.population[contestantIndicies[0]].generation+1;
            
            // winner's fitness
            const winnersFitness = this.fitness(this.population[contestantIndicies[outcome[0]]]);

        }

    }

};

module.exports = GeneticAlgorithm;


