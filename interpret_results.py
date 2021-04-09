import pandas as pd
import matplotlib.pyplot as plt
plt.style.use('dark_background')

results = pd.read_csv("result.csv", header=0, names=["name", "duration"])

results_table = pd.concat(map(lambda x: x[1].reset_index(drop=True).pivot(columns="name", values="duration"), results.groupby("name")), axis=1)
print(results_table.tail(-6000).agg(["mean", "std", "min", "max", "sum"]).transpose())
print(results_table.agg(["mean", "std", "min", "max", "sum"]).transpose())
results_table.head(40000).plot(figsize=(16,9))

ax = plt.gca()
fig = plt.gcf()

fig.patch.set_facecolor("#0d1117")
ax.set_facecolor("#0d1117")

plt.savefig("result.svg", facecolor="#0d1117", bbox_inches="tight", pad_inches=0, dpi=300)
plt.show()