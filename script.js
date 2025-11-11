const apiKey = "486edbc7f823b4ff9e246d4e475baa8e"; 
const url = `https://api.countrylayer.com/v2/all?access_key=${apiKey}`;

async function fetchCountries() {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erreur lors de la récupération des données");

    const countries = await response.json();

    const container = document.getElementById("countries");
    countries.forEach(country => {
      const div = document.createElement("div");
      div.classList.add("country");

      div.innerHTML = `
        <h2>${country.name}</h2>
        <p><strong>Capitale :</strong> ${country.capital}</p>
        <p><strong>Population :</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Superficie :</strong> ${country.area ? country.area.toLocaleString() + ' km²' : 'N/A'}</p>
        <p><strong>Langues :</strong> ${country.languages.map(lang => lang.name).join(', ')}</p>
        <p><strong>Monnaie :</strong> ${country.currencies.map(cur => cur.name + ' (' + cur.code + ')').join(', ')}</p>
      `;

      container.appendChild(div);
    });
  } catch (error) {
    console.error(error);
    document.getElementById("countries").innerText = "Impossible de charger les données.";
  }
}

fetchCountries();
