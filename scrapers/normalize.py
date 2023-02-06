from pandas import json_normalize
import json
import sys

provider = sys.argv[1]

with open(f'data/{provider}.json', 'r') as f:
    data = json.load(f)

df = json_normalize(data.values())
df.to_csv(f'data/{provider}.csv')
