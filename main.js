
/*
  Fate una funzione per rispondere a ciiascuna domanda
    - fetchare della risorsa
    - manipolare il dato per arrivare alla risposta
    - inserire la risposta dentro al footer della carta
  
*/


window.addEventListener('DOMContentLoaded', () => {
    main();
  });
  
  async function main() {
    solveQuestion1()
    solveQuestion2()
    solveQuestion3()
    solveQuestion4()
    solveQuestion5()
    solveQuestion6()
  }
  
  async function solveQuestion1() {
    const starships = await fetchAll('starships');
    const speeds = starships
      .map(({ MGLT, name }) => ({ speed: parseInt(MGLT), name }))
      .filter(s => !isNaN(s.speed))
      .sort((a, b) => b.speed - a.speed);
    // console.log({ speeds });
  
    injectAnswer(speeds[0], 1);
  }
  
  // async function solveQuestion2() {
  //   let starships = await fetchAll('starships');
  //   starships = starships
  //     .map(s => ({name: s.name, maxNumOnBoard: parseInt(s.passengers) + parseInt(s.crew)}))
  //     .filter(s => !isNaN(s.maxNumOnBoard))
  //
  //   console.log({ starships });
  //
  //   const max = Math.max(...starships.map(s => s.maxNumOnBoard));
  //   console.log({max})
  //   const biggestShip = starships.find(s => s.maxNumOnBoard === max);
  //   console.log({ biggestShip });
  // }
  
  async function solveQuestion2() {
    let starships = await fetchAll('starships');
    starships = starships.map(s => ({
      name: s.name,
      totCapacity: parseInt(s.crew.replace(',', '')) + parseInt(s.passengers.replace(',', ''))
    }))
    starships = starships.filter(s => !isNaN(s.totCapacity))
    // console.log({starships})
  
    let maxStarship = starships[0];
    for (const starship of starships) {
      if (starship.totCapacity > maxStarship.totCapacity) {
        maxStarship = starship;
      }
    }
    console.log({ maxStarship })
  
    injectAnswer(`${maxStarship.name}'s capacity: ${maxStarship.totCapacity}`, 2);
  }
  
  async function solveQuestion3() {
    let resource = 'people';
    let people = await fetchAll(resource);
    let mostFilmsCharacter = await findMostFilmsCharacter(people);
    updateCard3(mostFilmsCharacter);
  
  }
  async function findMostFilmsCharacter(people) {
    let mostFilmsCharacter = null;
    let maxFilmsCount =  0;
  
    for (let person of people) {
      const personInfo = await fetch(`https://swapi.dev/api/people/${person.id}/`).then(res => res.json());
      const filmsCount = personInfo.films.length;
      if (filmsCount > maxFilmsCount) {
        mostFilmsCharacter = personInfo;
        maxFilmsCount = filmsCount;
      }
    }
  
    return mostFilmsCharacter;
  }
  
  
  
   async function solveQuestion4() {
    let people = await fetchAll('people');
    let oldestCharacter = null;
    let maxAge = -1;
  // La scelta di inizializzare maxAge a -1 è una convenzione comune quando si tratta di trovare un massimo in un insieme di valori. In particolare, quando si cerca di determinare un massimo all'interno di un insieme di valori positivi, inizializzare maxAge a -1 assicura che qualsiasi valore positivo trovato sarà sempre maggiore del valore iniziale.
    people.forEach(person => {
      const birthYear = parseInt(person.birth_year);
      if (!isNaN(birthYear)) {
        if (birthYear > maxAge) {
          maxAge = birthYear;
          oldestCharacter = person;
        }
      }
    });
  
  
    updateCard4(oldestCharacter);
  }
  
   async function solveQuestion5() {
    const speciesList = await fetchAll('species');
    
    const intergalacticSpecies = speciesList.find(species => {
      return species.name === 'Cittadino Intergalattico';
    });
  
    let totalHeight = 0;
    let intergalacticCount = 0;
  
    intergalacticSpecies.people.forEach(async personURL => {
      const personData = await fetch(personURL).then(res => res.json());
      const height = parseInt(personData.height);
      if (!isNaN(height)) {
        totalHeight = totalHeight + height;
        intergalacticCount++;
      }
    });
  
    const averageHeight = intergalacticCount > 0 ? totalHeight / intergalacticCount : 0;
  
    updateCard5(averageHeight);
  }
  async function solveQuestion6() {
    const planets = await fetchAll('planets');
  
    let mostPopulatedPlanet = null;
    let maxPopulationDensity = -1;
  
    planets.forEach(planet => {
      const populationDensity = planet.population / planet.surface_area;
      if (populationDensity > maxPopulationDensity) {
        maxPopulationDensity = populationDensity;
        mostPopulatedPlanet = planet;
      }
    });
  
    updateCard6(mostPopulatedPlanet);
  }
  async function fetchAll(resource) {
    const res = await fetch(`https://swapi.dev/api/${resource}/`);
    const json = await res.json();
    const count = json.count;
  
    const promises = [];
    for (let i = 1; i <= count; i++) {
      promises.push(fetch(`https://swapi.dev/api/${resource}/${i}/`));
    }
    const response = (await Promise.all(
      promises
        .map(p => p.then(r => r.json())))
    ).filter(el => el.name);
  
    return response;
  }
  
  function injectAnswer(answer, questionNumber) {
  }
  