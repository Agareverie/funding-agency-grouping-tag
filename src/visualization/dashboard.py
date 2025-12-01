import streamlit as st
import requests
import numpy as np
import pandas as pd
import plotly.express as px

st.sidebar.header("Parameters")

# Will switch to a proper enum/union system later
categories = [
    "AGRI",
    "ARTS",
    "BIOC",
    "CENG",
    "CHEM",
    "COMP",
    "DENT",
    "EART",
    "ENER",
    "ENGI",
    "ENVI",
    "IMMU",
    "MATE",
    "MATH",
    "MEDI",
    "MULT",
    "NEUR",
    "NURS",
    "PHAR",
    "PHYS",
    "PSYC",
    "SOCI",
    "VETE",
]

cluster_colors = {
    "-1": "#A0A0A0",  # Unclustered
    "0": "#1F77B4",  # Materials/Physics/Engineering
    "1": "#FF7F0E",  # Psychology
    "2": "#2CA02C",  # Biochemistry
    "3": "#D62728",  # Immunology/Microbiology
    "4": "#9467BD",  # Multidisciplinary
    "5": "#8C564B",  # Neuroscience
    "6": "#17BECF",  # Physics
    "7": "#BCBD22",  # Social Sciences
    "8": "#8FD175",  # Agricultural Science
    "9": "#FF9896",  # Chemical Engineering
    "10": "#AEC7E8",  # Nursing
    "11": "#1F77B4",  # Chemistry
    "12": "#9EDAE5",  # Earth Science
    "13": "#E377C2",  # Pharmacology
    "14": "#2E8B57",  # Environmental Science
    "15": "#C49C94",  # Veterinary Science
    "16": "#7F7F7F",  # Chem/Pharm/Biochem mix
    "17": "#4E79A7",  # Energy/Engineering
    "18": "#F7B6D2",  # Generalists/Medical mix
    "19": "#4C72B0",  # Computer Science & Math
}


x = st.sidebar.selectbox("X-Axis", categories)
y = st.sidebar.selectbox("Y-Axis", categories)

if "slice_selection" not in st.session_state:
    st.session_state.slice_selection = None


def click_here_button_on_click():
    response = requests.get(f"http://127.0.0.1:8000/api/x/{x}/y/{y}")
    st.session_state.slice_selection = response.json()


def close_button_on_click():
    st.session_state.slice_selection = None


st.sidebar.button("Click Here", on_click=click_here_button_on_click)
if st.session_state.slice_selection is not None:
    st.header("Clustering Results")
    response_slice = st.session_state.slice_selection["slice"]

    visualized_grant_data = pd.DataFrame(response_slice).drop(columns="grant_name")

    # Take log
    visualized_grant_data[["x", "y"]] = visualized_grant_data[["x", "y"]] + 1
    visualized_grant_data[["x", "y"]] = visualized_grant_data[["x", "y"]].apply(np.log)

    aggregated_data = (
        visualized_grant_data.groupby(["x", "y", "cluster"]).size().reset_index(name="plot_size")
    )
    scatter_plot = px.scatter(
        aggregated_data,
        x=aggregated_data.x,
        y=aggregated_data.y,
        color=aggregated_data.cluster.astype(str),
        labels={"x": x, "y": y},
        color_discrete_map=cluster_colors,
        size=aggregated_data.plot_size,
        size_max=40,
        opacity=0.4,
    )
    st.plotly_chart(scatter_plot)
    st.button("Close Plot", on_click=close_button_on_click)
