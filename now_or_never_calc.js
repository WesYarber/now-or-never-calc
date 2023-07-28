class TradeOptimizer {
  constructor(startingResourcesAvailable, tradeMethods) {
      this.resourcesAvailable = startingResourcesAvailable;
      this.tradeMethods = tradeMethods;
      this.maxMoney = 0;
      this.bestTrades = "";
      this.remainingSingles = {};
  }

  checkTotalValue(resources, tradeActions) {
      let totalValue = resources['money'] + Object.entries(resources)
          .filter(([key]) => key !== 'money')
          .reduce((acc, [key, value]) => acc + (['crystal', 'demon bottle', 'tool'].includes(key) ? value * 2 : value), 0);

      if (totalValue > this.maxMoney) {
          this.maxMoney = totalValue;
          this.bestTrades = tradeActions.join('\n');
          this.remainingSingles = Object.fromEntries(Object.entries(resources).filter(([key, value]) => value > 0 && key !== 'money'));
      }
  }

  recursiveCompare(resourcesAvailable, tradeActions = []) {
      for (let [method_name, method] of Object.entries(this.tradeMethods)) {
          if (Object.entries(resourcesAvailable).every(([key, value]) => key === 'money' || value >= -method[key])) {
              let updatedResources = { ...resourcesAvailable };
              for (let [key, value] of Object.entries(method)) {
                  updatedResources[key] += value;
              }

              tradeActions.push(method_name);

              this.checkTotalValue(updatedResources, tradeActions);

              this.recursiveCompare(updatedResources, tradeActions);
              tradeActions.pop();
          } else {
              this.checkTotalValue(resourcesAvailable, tradeActions);
          }
      }
  }

  calculateMaxMoney() {
      this.recursiveCompare(this.resourcesAvailable);
      let resultText = `<p>Maximum money yield: ${this.maxMoney}</p>`;
      resultText += '<p>Trades:</p>';
      let trades = this.bestTrades.split('\n');
      for (let i = 0; i < trades.length; i++) {
          resultText += `<p>${trades[i]}</p>`;
      }
      // resultText += '<p>Sell Remaining Singles:</p>';
      for (let [key, value] of Object.entries(this.remainingSingles)) {
          if (value > 0 && key !== 'money') {
              let additionalAmount = key === 'shell' ? value : 2 * value;
              resultText += `<p>${value} individual ${key}${value > 1 ? 's' : ''}                                +${additionalAmount}</p>`;
          }
      }
      document.getElementById("result").innerHTML = resultText;
  }
}

let tradeMethods = {
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

document.getElementById("resourceForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Get the values from the form fields
  var crystal = parseInt(document.getElementById("crystal").value);
  var demonBottle = parseInt(document.getElementById("demonBottle").value);
  var tool = parseInt(document.getElementById("tool").value);
  var shell = parseInt(document.getElementById("shell").value);

  // Build the resourcesAvailable object
  var resourcesAvailable = {
      'crystal': crystal,
      'demon bottle': demonBottle,
      'tool': tool,
      'shell': shell,
      'money': 0
  };

  var optimizer = new TradeOptimizer(resourcesAvailable, tradeMethods);
  optimizer.calculateMaxMoney();
});