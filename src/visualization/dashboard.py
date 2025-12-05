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

cluster_labels = {
    -1: "Unclustered",
    0: "Materials Science, Physics and Engineering",
    1: "Psychology",
    2: "Biochemistry",
    3: "Immunology and Microbiology",
    4: "Multidisciplinary",
    5: "Neuroscience",
    6: "Physics",
    7: "Social Sciences",
    8: "Agricultural Science",
    9: "Chemical Engineering",
    10: "Nursing",
    11: "Chemistry",
    12: "Earth Science", 
    13: "Pharmacology",
    14: "Environmental Science",
    15: "Veterinary Science",
    16: "Chemistry, Pharmacology and Biochemistry",
    17: "Energy and Engineering",
    18: "Generalists",
    19: "Computer Science and Math",
}


cluster_colors = {
    "Unclustered": "#A0A0A0",  # Unclustered
    "Materials Science, Physics and Engineering": "#1F77B4",  # Materials/Physics/Engineering
    "Psychology": "#FF7F0E",  # Psychology
    "Biochemistry": "#2CA02C",  # Biochemistry
    "Immunology and Microbiology": "#D62728",  # Immunology/Microbiology
    "Multidisciplinary": "#9467BD",  # Multidisciplinary
    "Neuroscience": "#8C564B",  # Neuroscience
    "Physics": "#17BECF",  # Physics
    "Social Sciences": "#BCBD22",  # Social Sciences
    "Agricultural Science": "#8FD175",  # Agricultural Science
    "Chemical Engineering": "#FF9896",  # Chemical Engineering
    "Nursing": "#AEC7E8",  # Nursing
    "Chemistry": "#1F77B4",  # Chemistry
    "Earth Science": "#9EDAE5",  # Earth Science
    "Pharmacology": "#E377C2",  # Pharmacology
    "Environmental Science": "#2E8B57",  # Environmental Science
    "Veterinary Science": "#C49C94",  # Veterinary Science
    "Chemistry, Pharmacology and Biochemistry": "#7F7F7F",  # Chem/Pharm/Biochem mix
    "Energy and Engineering": "#4E79A7",  # Energy/Engineering
    "Generalists": "#F7B6D2",  # Generalists/Medical mix
    "Computer Science and Math": "#4C72B0",  # Computer Science & Math
}


x = st.sidebar.selectbox("X-Axis", categories)
y = st.sidebar.selectbox("Y-Axis", [category for category in categories if category != x])

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
        color=aggregated_data.cluster.map(cluster_labels),
        labels={"x": x, "y": y, "color": "cluster"},
        color_discrete_map=cluster_colors,
        size=aggregated_data.plot_size,
        size_max=40,
        opacity=0.4,
    )
    st.plotly_chart(scatter_plot)
    st.button("Close Plot", on_click=close_button_on_click)
