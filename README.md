# F*gTag

**Funding Agency Grouping Tag**, also known as *F\*gTag*, is a clustering project made for the **219051 DATA SCIENCE** subject using the Scopus dataset.

## Chatters (Group Members)

1. FirstName LastName #67//////21
2. FirstName LastName #67//////21
3. FirstName LastName #67//////21
4. FirstName LastName #67//////21

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
