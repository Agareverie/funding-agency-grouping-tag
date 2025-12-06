from pathlib import Path
from typing import Literal

RESOURCES_DIR = Path(__file__).parent.parent / "resources"

PLOTS_DIR = RESOURCES_DIR / "plots"
assert PLOTS_DIR.is_dir()

DATA_DIR = RESOURCES_DIR / "data"
assert DATA_DIR.is_dir()

GRANT_DATA_CSV = DATA_DIR / "processed" / "grant_data.csv"
GRANT_CLUSTERED_DATA_CSV = DATA_DIR / "processed" / "grant_clustered_data.csv"

def scopus_of_year(year: Literal[2018, 2019, 2020, 2021, 2022, 2023]) -> Path:
    return DATA_DIR / "raw" / f"{year}.json"
