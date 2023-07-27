import sys

global max_money
global trade_actions
global remaining_singles 
max_money = 0

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
        '3 shell': {
            'crystal': 0,
            'demon bottle': 0,
            'tool': 0,
            'shell': -3,
            'money': 5
        },
        '2 tools + 1 shell': {
            'crystal': 0,
            'demon bottle': 0,
            'tool': -2,
            'shell': -1,
            'money': 7
        },
        '2 demon bottles + 1 tool': {
            'crystal': 0,
            'demon bottle': -2,
            'tool': -1,
            'shell': 0,
            'money': 9
        },
        '3 crystals': {
            'crystal': -3,
            'demon bottle': 0,
            'tool': 0,
            'shell': 0,
            'money': 11
        },
        '1 demon bottle + 1 tool + 1 shell': {
            'crystal': 0,
            'demon bottle': -1,
            'tool': -1,
            'shell': -1,
            'money': 9
        },
        '1 of each': {
            'crystal': -1,
            'demon bottle': -1,
            'tool': -1,
            'shell': -1,
            'money': 12
        },
        '2 crystals + 2 demon bottles': {
            'crystal': -2,
            'demon bottle': -2,
            'tool': 0,
            'shell': 0,
            'money': 14
        },
    }

def recursive_compare(resources_available, trade_methods, trade_actions=None):
    global max_money
    global best_trades
    global remaining_singles

    if trade_actions is None:
        trade_actions = []

    for method_name, method in trade_methods.items():
        if all(value >= -method[key] for key, value in resources_available.items() if key != 'money'):
            # Create a copy of resources_available before making trade actions
            updated_resources = resources_available.copy()
            for key, value in method.items():
                updated_resources[key] += value
            
            trade_actions.append(method_name)

            if updated_resources['money'] > max_money:
                max_money = updated_resources['money']
                best_trades = "\n".join(trade_actions)
                
            # Recursive call with the updated resources and trade actions
            recursive_compare(updated_resources, trade_methods, trade_actions)

            # Undo the trade action after exploring a branch
            trade_actions.pop()
        else:
            temp_remaining = resources_available.copy()
            for key, value in resources_available.items():
                if key == 'money':
                    continue
                if key == 'shell':
                    resources_available['money'] += value * 1
                elif key in ['crystal', 'demon bottle', 'tool']:
                    resources_available['money'] += value * 2
                else:
                    print("invalid resource key.")
                    exit()
                resources_available[key] = 0
            
            if resources_available['money'] > max_money:
                max_money = resources_available['money']
                best_trades = "\n".join(trade_actions)
                remaining_singles = temp_remaining
                
def calculate_max_money(starting_resources_available):
    global best_trades
    global max_money
    recursive_compare(starting_resources_available, trade_methods)
    for key, value in remaining_singles.items():
        if (value > 0) & (key != 'money'):
            best_trades += f'\n{value} individual {key}s'
        
    print("Maximum money yield:", max_money)
    print(f"Trades:\n{best_trades}")

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
    
    calculate_max_money(starting_resources_available)