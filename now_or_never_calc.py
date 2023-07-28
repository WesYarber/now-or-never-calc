import sys

class TradeOptimizer:
    def __init__(self, starting_resources_available, trade_methods):
        self.resources_available = starting_resources_available
        self.trade_methods = trade_methods
        self.max_money = 0
        self.best_trades = ""
        self.remaining_singles = {}

    def check_total_value(self, resources, trade_actions):
        total_value = resources['money'] + sum([value * 2 if key in ['crystal', 'demon bottle', 'tool'] else value for key, value in resources.items() if key != 'money'])
        if total_value > self.max_money:
            self.max_money = total_value
            self.best_trades = "\n".join(trade_actions)
            self.remaining_singles = {key: value for key, value in resources.items() if value > 0 and key != 'money'}

    def recursive_compare(self, resources_available, trade_actions=None):
        if trade_actions is None:
            trade_actions = []
        
        for method_name, method in self.trade_methods.items():
            if all(value >= -method[key] for key, value in resources_available.items() if key != 'money'):
                updated_resources = resources_available.copy()
                for key, value in method.items():
                    updated_resources[key] += value
                trade_actions.append(method_name)

                self.check_total_value(updated_resources, trade_actions)
                
                self.recursive_compare(updated_resources, trade_actions)
                trade_actions.pop()
            else:
                self.check_total_value(resources_available, trade_actions)

    def calculate_max_money(self):
        self.recursive_compare(self.resources_available)
        for key, value in self.remaining_singles.items():
            addition_temp = value * 2 if key in ['crystal', 'demon bottle', 'tool'] else value
            if key == "crystal":
                extra_space = '     '
            elif key == "demon bottle":
                extra_space = ''
            elif key == "tool":
                extra_space = '        '
            elif key == "shell":
                extra_space = '       '
            else:
                print("invalid key:", key)
            self.best_trades += f'\n{value} individual {key}{ "s" if value > 1 else " " }{extra_space}           +{addition_temp}'
        print("\nMaximum money yield:", self.max_money)
        print(f"\nTrades:\n{self.best_trades}")
        print(f"Total:                               ={self.max_money}")

# Add additional trades obtained through quest cards below if applicable
# Note: Ensure the resources you trade in are negative values and money received is a positive value
#TODO: implement a funciton to populate these additional trades if necessary
trade_methods = {    
        # 'example': {
        #     'crystal': -1,
        #     'demon bottle': -2,
        #     'tool': -3,
        #     'shell': -4,
        #     'money': 5
        # }, 
    '3 shell                              +5': {
        'crystal': 0,
        'demon bottle': 0,
        'tool': 0,
        'shell': -3,
        'money': 5
    },
    '2 tools + 1 shell                    +7': {
        'crystal': 0,
        'demon bottle': 0,
        'tool': -2,
        'shell': -1,
        'money': 7
    },
    '2 demon bottles + 1 tool             +9': {
        'crystal': 0,
        'demon bottle': -2,
        'tool': -1,
        'shell': 0,
        'money': 9
    },
    '3 crystals                           +11': {
        'crystal': -3,
        'demon bottle': 0,
        'tool': 0,
        'shell': 0,
        'money': 11
    },
    '1 demon bottle + 1 tool + 1 shell    +9': {
        'crystal': 0,
        'demon bottle': -1,
        'tool': -1,
        'shell': -1,
        'money': 9
    },
    '1 of each                            +12': {
        'crystal': -1,
        'demon bottle': -1,
        'tool': -1,
        'shell': -1,
        'money': 12
    },
    '2 crystals + 2 demon bottles         +14': {
        'crystal': -2,
        'demon bottle': -2,
        'tool': 0,
        'shell': 0,
        'money': 14
    },
}

def get_user_input():
    starting_resources_available = {}
    print("Enter the starting resources available:")
    starting_resources_available['crystal'] = int(input("Crystals: "))
    starting_resources_available['demon bottle'] = int(input("Demon Bottles: "))
    starting_resources_available['tool'] = int(input("Tools: "))
    starting_resources_available['shell'] = int(input("Shells: "))
    starting_resources_available['money'] = 0
    return starting_resources_available

if __name__ == "__main__":
    if len(sys.argv) == 5:
        starting_resources_available = {
            'crystal': int(sys.argv[1]),
            'demon bottle': int(sys.argv[2]),
            'tool': int(sys.argv[3]),
            'shell': int(sys.argv[4]),
            'money': 0
        }
    else:
        starting_resources_available = get_user_input()
    
    optimizer = TradeOptimizer(starting_resources_available, trade_methods)
    optimizer.calculate_max_money()