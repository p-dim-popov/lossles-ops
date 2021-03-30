import pandas as pd
import matplotlib.pyplot as plt

results = pd.read_csv("result.csv", header=0, names=["name", "duration"])

results_table = pd.concat(map(lambda x: x[1].reset_index(drop=True).pivot(columns="name", values="duration"), results.groupby("name")), axis=1)
print(results_table.tail(-6000).agg(["mean", "std", "min", "max", "sum"]).transpose())
print(results_table.agg(["mean", "std", "min", "max", "sum"]).transpose())
results_table.head(40000).plot(figsize=(16,9))
plt.savefig("result.svg", bbox_inches="tight", pad_inches=0, dpi=300)
plt.show()