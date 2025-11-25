from pathlib import Path
from typing import Literal

RESOURCES_DIR = Path("resources")

PLOTS_DIR = RESOURCES_DIR / "plots"
assert PLOTS_DIR.is_dir()

DATA_DIR = RESOURCES_DIR / "data"
assert DATA_DIR.is_dir()

MODELS_DIR = RESOURCES_DIR / "models"
assert MODELS_DIR.is_dir()

TF_IDF_MODEL = MODELS_DIR / "tf_idf.pkl"
K_MEANS_MODEL = MODELS_DIR / "k_means.pkl"

def scopus_of_year(year: Literal[2018, 2019, 2020, 2021, 2022, 2023]) -> Path:
    return DATA_DIR / f"{year}.json"