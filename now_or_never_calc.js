// Web page and javascrupt code adapted from the python code mostly with ChatGPT

function recursiveCompare(resourcesAvailable, sellingMethods, tradeActions = []) {
  if (tradeActions.length > 0) {
    tradeActions = [...tradeActions]; // Create a copy of the trade actions array
  }

  for (const [methodName, method] of Object.entries(sellingMethods)) {
    if (Object.entries(resourcesAvailable).every(([key, value]) => key === 'money' || value >= -method[key])) {
      const updatedResources = { ...resourcesAvailable };
      for (const [key, value] of Object.entries(method)) {
        updatedResources[key] += value;
      }

      tradeActions.push(methodName);

      if (updatedResources['money'] > maxMoney) {
        maxMoney = updatedResources['money'];
        bestTrades = tradeActions.join('\n');
      }

      recursiveCompare(updatedResources, sellingMethods, tradeActions);

      tradeActions.pop();
    } else {
      const tempRemaining = { ...resourcesAvailable };
      for (const [key, value] of Object.entries(resourcesAvailable)) {
        if (key === 'money') {
          continue;
        }
        if (key === 'shell') {
          resourcesAvailable['money'] += value * 1;
        } else if (['crystal', 'demon bottle', 'tool'].includes(key)) {
          resourcesAvailable['money'] += value * 2;
        } else {
          console.error("Invalid resource key.");
          return;
        }
        resourcesAvailable[key] = 0;
      }

      if (resourcesAvailable['money'] > maxMoney) {
        maxMoney = resourcesAvailable['money'];
        bestTrades = tradeActions.join('\n');
        remainingSingles = tempRemaining;
      }
    }
  }
}

// Initialize global variables
let maxMoney = 0;
let bestTrades = '';
let remainingSingles = {};

// Add selling methods
const sellingMethods = {
        '3 shell                                               +5': {
            'crystal': 0,
            'demon bottle': 0,
            'tool': 0,
            'shell': -3,
            'money': 5
        },
        '2 tools + 1 shell                                +7': {
            'crystal': 0,
            'demon bottle': 0,
            'tool': -2,
            'shell': -1,
            'money': 7
        },
        '2 demon bottles + 1 tool                   +9': {
            'crystal': 0,
            'demon bottle': -2,
            'tool': -1,
            'shell': 0,
            'money': 9
        },
        '3 crystals                                          +11': {
            'crystal': -3,
            'demon bottle': 0,
            'tool': 0,
            'shell': 0,
            'money': 11
        },
        '1 demon bottle + 1 tool + 1 shell      +9': {
            'crystal': 0,
            'demon bottle': -1,
            'tool': -1,
            'shell': -1,
            'money': 9
        },
        '1 of each                              +12': {
            'crystal': -1,
            'demon bottle': -1,
            'tool': -1,
            'shell': -1,
            'money': 12
        },
        '2 crystals + 2 demon bottles            +14': {
            'crystal': -2,
            'demon bottle': -2,
            'tool': 0,
            'shell': 0,
            'money': 14
        },
};

// Function to handle form submission
function calculateMaxMoney(event) {
  event.preventDefault();
  maxMoney = 0;
  bestTrades = '';
  remainingSingles = {};

  const startingResourcesAvailable = {
    'crystal': parseInt(document.getElementById('crystal').value, 10),
    'demon bottle': parseInt(document.getElementById('demonBottle').value, 10),
    'tool': parseInt(document.getElementById('tool').value, 10),
    'shell': parseInt(document.getElementById('shell').value, 10),
    'money': 0
  };

  recursiveCompare(startingResourcesAvailable, sellingMethods);

  // Display the results on the page
  const resultDiv = document.getElementById('result');
let resultText = `
  <h2>Results:</h2>
  <p>Maximum money yield: ${maxMoney}</p>
  <p>Trades:<br>${bestTrades}
`;

for (const [key, value] of Object.entries(remainingSingles)) {
  if (value > 0 && key !== 'money') {
    let additional_amount = 0;
    if (key == 'shell') {
        additional_amount += value
    }
    else {
        additional_amount += 2*value
    }
    resultText += `${value} individual ${key}${value > 1 ? 's' : ''}                                 +${additional_amount}`;
  }
}
resultText += '</p>'

resultDiv.innerHTML = resultText;
}

document.getElementById('resourceForm').addEventListener('submit', calculateMaxMoney);