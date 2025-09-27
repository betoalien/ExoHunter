# ExoHunter: Exoplanet Detection and Classification System with Machine Learning 🔭

## Overview

**ExoHunter** is a **Data Science project** that leverages **machine learning** to detect and classify exoplanets from telescope data, focusing on **light curves** from NASA's **Kepler** and **TESS** missions.

By analyzing stellar flux to identify **planetary transits**, this project combines astrophysical passion with **advanced data engineering** and **ML techniques**, making it a standout addition to any Data Science portfolio.

---

## ✨ Why ExoHunter is Unique

* **Astrophysical Storytelling:** Inspired by the hunt for "cosmic mysteries," ExoHunter not only classifies exoplanets (**Confirmed**, **Candidate**, **False**) but also detects **rare anomalies** in light curves, playfully exploring "exotic" signals like those from **Tabby's Star**.
* **End-to-End Pipeline:** From raw data ingestion to interactive dashboards, it showcases full-cycle Data Science: **ETL pipelines**, **feature engineering**, **ML modeling**, and **deployment**.
* **Real-World Relevance:** Demonstrates skills in **time-series analysis**, **imbalance handling**, and **Explainable AI**, directly applicable to industries like space tech, *fintech*, and **IoT analytics**.

---

## 🎯 Project Goals

1.  **Data Processing:** Build a **scalable ETL pipeline** to clean and transform raw telescope data.
2.  **ML Classification:** Train models to classify exoplanet signals with high accuracy (target: $AUC > 0.95$, $recall > 0.9$ for confirmed exoplanets).
3.  **Anomaly Detection:** Use **unsupervised learning** and **Bayesian inference** to flag unusual signals.
4.  **Deployment:** Deliver an **interactive web app** for users to upload light curves and view predictions.

---

## 🛠️ Tech Stack

| Category | Key Tools |
| :--- | :--- |
| **Data Engineering** | **PySpark**/Hadoop (big data), **Pandas** (initial ETL), **PostgreSQL** (structured metadata), **MongoDB** (raw light curves). |
| **Machine Learning** | **Scikit-learn** (Random Forest, XGBoost), **TensorFlow** (CNNs for light curves), **PyMC** (Bayesian inference). |
| **Visualization** | **Matplotlib**/Seaborn (exploratory plots), **Streamlit**/Superset (dashboards). |
| **Deployment** | **FastAPI** (API), **Dokploy** on **AWS Lightsail** (hosting). |
| **Other Tools** | Jupyter (EDA), Git (version control). |

---

## 📂 Datasets

* **Primary Source:** **NASA's Kepler Exoplanet Search Results** (Kaggle) with $\sim9,500$ stellar observations, including labels (**Confirmed**, **Candidate**, **False**) and features like transit depth and period.
* **Future Sources:** **TESS** light curves from MAST, **NASA Exoplanet Archive API** for real-time data.

---

## 🌳 Project Structure

---
```bash
ExoHunter/
├── data/               # Raw and processed datasets
├── notebooks/          # Jupyter notebooks for EDA
├── scripts/            # Python scripts for ETL and ML
├── models/             # Trained ML models
├── visualizations/     # Plots and dashboards
├── requirements.txt    # Dependencies
└── README.md           # Project documentation
```

## 🚀 Current Progress and Next Steps

### Current Progress
* **Day 1:** Set up GitHub repo, installed dependencies, downloaded Kepler dataset, and performed initial **EDA** with basic visualizations (e.g., period distributions).

### Next Steps
1.  Data cleaning and **feature engineering** (e.g., $SNR$, transit duration).
2.  Training a baseline **Random Forest** model.

### Future Roadmap
* Automate data ingestion via **NASA API**.
* Implement **CNNs** for light curve analysis.
* Deploy a **web app** with real-time predictions.
* Generate narrative PDF reports (e.g., "Discovery Report: A Hidden World Detected").

---

## ⭐ Why It Stands Out for Employers

ExoHunter bridges astrophysical curiosity with **enterprise-grade Data Science**:

* **Scalable Pipelines:** Handles **large-scale time-series data**, relevant for *IoT* or financial analytics.
* **Advanced ML:** Tackles **class imbalance** and complex patterns, showcasing skills in model **robustness**.
* **Creative Narrative:** The "**cosmic mystery**" angle makes it memorable, differentiating it from generic *retail* or *finance* projects.
--

## 💻 Installation

To explore **ExoHunter** locally, follow these steps:

1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/betoalien/ExoHunter.git](https://github.com/betoalien/ExoHunter.git)
    ```
2.  **Create a virtual environment:**
    ```bash
    python -m venv exohunter_env
    # Activate environment (Linux/macOS):
    source exohunter_env/bin/activate
    # Activate environment (Windows):
    # exohunter_env\Scripts\activate
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Run EDA notebook:**
    ```bash
    jupyter notebook notebooks/eda.ipynb
    ```

---

## 🤝 Get Involved

Interested in **ExoHunter** or have questions about the project? Feel free to reach out to me!

**Email:** `conect@albertocardenas.com`

Contributions, feedback, or inquiries about Data Science opportunities are welcome!

***

*Built with passion for astrophysics and data-driven discovery by **Alberto Cardenas**.*