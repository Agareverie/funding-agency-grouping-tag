import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import DBSCAN

from utils import GRANT_DATA_CSV, GRANT_CLUSTERED_DATA_CSV

grant_data = pd.read_csv(GRANT_DATA_CSV)

X = grant_data.drop(columns="grant_name")

X = (X + 1).apply(np.log)

scaler = StandardScaler()
X[X.columns] = scaler.fit_transform(X)

dbscan_model = DBSCAN(eps=0.15, min_samples=15, metric="cosine")

grant_clustered_data_dbscan = grant_data.copy()
grant_clustered_data_dbscan["cluster"] = dbscan_model.fit_predict(X)

grant_clustered_data_dbscan.to_csv(GRANT_CLUSTERED_DATA_CSV, index=False)