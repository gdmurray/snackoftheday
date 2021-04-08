from datetime import date, timedelta
import collections

n_snacks = 524
snack_idx_array = [n for n in range(0, n_snacks + 1)]
start_date = date(2021, 1, 1)
end_date = date(2025, 12, 31)
delta = timedelta(days=1)

counter = collections.Counter()
d = collections.defaultdict(list)

while start_date <= end_date:
    date_number = int(start_date.strftime("%d%m%Y"))
    chosen_index = date_number % n_snacks
    counter[chosen_index] += 1
    d[chosen_index].append(start_date.strftime("%d-%m-%Y"))
    start_date += delta

print("Counter")
print(counter)
print(counter.most_common())
print("Dict")
for item, dates in counter.items():
    print(item, dates)
print()
excluded = [n for n in snack_idx_array if n not in counter.keys()]

print("All Keys: ", sorted([n for n in counter.keys()]))
print("Excluded: ", excluded)
print(f"Excluded {len(excluded)} Snacks")
print(f"Used {n_snacks - len(excluded)} Snacks")
