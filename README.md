# Chatters' Grant-PT

**Grant-PT**, also known as *GPT*, is a clustering project made for the **219051 DATA SCIENCE** subject using the Scopus dataset.

## Group Members

1. Warit Suntrarom #6738233121
2. Phukla Jeerawattana #6738159421
3. Porrapat Lomsomboon #6738137621
4. Yanathep Prasitsomsakul #6738067321

*<sup>"ChatGPT is all you need."  - Some Article</sup>*

## Using Conda & Pip

Inside the project directory, in order to create the virtual environment, use this command (in the Conda Prompt if on Windows).

```bash
conda env create --prefix ./env --file environment.yml
```

The env/ folder is ignored by Git, recreate it using `environment.yml`, This installs all the necessary dependencies as depicted in the file, then use the command below to activate the virtual environment.

```bash
conda activate ./env
```

## Opening up the applications

After you put in the necessary data inside your repo:

- `resources/data/processed/grant_data.csv` (From clusteredGrantData)  **\*Mandatory for the eda.ipynb notebook.**
- `resources/data/processed/grant_clustered_data.csv` (From clusteredGrantData) **\*Mandatory for API, can be generated using the notebook but that requires the previous file.**
- `resources/data/raw/{year}.json` (From ScopusCombined, all years)

You should be able to run the FastAPI file to activate the uvicorn server.

```bash
uvicorn src.api.app:app --reload
```

To use streamlit, open a new terminal simultaneously with the FastAPI.

```bash
streamlit run src/visualization/dashboard.py
```

## Contribution

When contributing to the project, please make sure to alias your `import`s according to this system, with standard library imports first, then dependencies second, then local files third:

```python
import datetime as dt  # However, always prefer pd.Timestamp.
import pickle
from pathlib import Path

import numpy as np
import pandas as pd
import plotly.express as px
import streamlit as st
from sklearn.package import Class
from fastapi import FastAPI

from utils import DATA_DIR
```

If the extension *Markdown Lint* is linting the use of the HTML tags, add this into your `settings.json`:

```json
  "markdownlint.config": {
    "MD033": false
  }
```
