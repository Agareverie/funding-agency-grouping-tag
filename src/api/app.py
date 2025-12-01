from fastapi import FastAPI
import pandas as pd

from utils import GRANT_CLUSTERED_DATA_CSV

app = FastAPI()

grant_clustered_data = pd.read_csv(GRANT_CLUSTERED_DATA_CSV)
grant_clustered_data_mutable = grant_clustered_data.copy()

@app.get("/api/x/{x}/y/{y}")
async def get_data_slice_api(x: str, y: str):
    grant_data_slice = grant_clustered_data_mutable[
        ((grant_clustered_data_mutable[x] > 0) | (grant_clustered_data_mutable[y] > 0))
    ]
    slice_list = grant_data_slice[["grant_name", x, y, "cluster"]].rename(columns={x: "x", y: "y"})

    return {"x": x, "y": y, "slice": slice_list.to_dict(orient="records")}
