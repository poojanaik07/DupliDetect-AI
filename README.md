# DupliDetect AI 🌐

**Multilingual Semantic Duplicate Detection System**

DupliDetect AI is a project designed to identify duplicate or near-duplicate records across languages using semantic similarity. Instead of relying only on exact text matches, the system can compare the meaning of text and help surface records that may express the same idea in different words or languages.

> **Project status:** This README documents the project concept, intended workflow, and UI screenshots. Update the setup commands and feature list to match the exact implementation in your current repository before publishing.

## ✨ Overview

Duplicate records can appear in customer databases, survey responses, content repositories, and other datasets. They may be written differently or use different languages, making simple exact-match checks insufficient.

DupliDetect AI aims to make this process easier by providing a workflow to upload a CSV dataset, preprocess text, generate multilingual embeddings, calculate similarity, identify duplicate candidates, review confidence scores, and export cleaned data.

## 🖥️ Screenshots

### 1. Landing page
The landing page introduces DupliDetect AI and highlights multilingual duplicate detection.



### 2. Login page
A sign-in interface for accessing the deduplication workspace. The screen illustrates email/password sign-in and Google/GitHub sign-in options in the UI.

<img width="800" height="200" alt="image" src="https://github.com/user-attachments/assets/c9fd78cd-6b09-49fe-9ae2-3aa4836e4f5e" />


### 3. Upload dataset
The upload screen is designed for CSV input and shows the dataset upload area and the 50 MB limit displayed in the UI.

<img width="800" height="200" alt="image" src="https://github.com/user-attachments/assets/f5b78d74-12e3-445b-a338-10be7ceb76b2" />


### 4. Upload successful
After a dataset is loaded, the interface displays a confirmation state and a call to continue to analysis.

<img width="800" height="200" alt="image" src="https://github.com/user-attachments/assets/daf80177-5e38-4034-9584-3bc7df618391" />


### 5. Results dashboard concept
The dashboard UI presents record counts, duplicate candidates, language labels, similarity percentages, review statuses, and actions for merging or exporting data.

<img width="800" height="200" alt="image" src="https://github.com/user-attachments/assets/666940be-2c42-4fb9-97ec-e2df99f79bd4" />


## 🚀 Key Features

- **Multilingual duplicate detection** — designed to compare text across supported languages.
- **CSV dataset workflow** — upload a dataset and prepare it for analysis.
- **Text preprocessing** — prepare text consistently before comparison.
- **Semantic embeddings** — represent text as vectors so records with similar meanings can be compared.
- **Similarity scoring** — estimate how closely records match.
- **Duplicate review** — group likely duplicates and review confidence scores before taking action.
- **Results visualization** — display summary metrics and candidate matches in a dashboard.
- **Export workflow** — support exporting cleaned results to CSV or JSON, if implemented in the current version.

## 🧰 Technology Stack

The project implementation has used or planned the following technologies:

| Technology | Purpose |
|---|---|
| Python | Core processing and application logic |
| Streamlit | Interactive application interface |
| Sentence Transformers | Generate multilingual text embeddings |
| `paraphrase-multilingual-MiniLM-L12-v2` | Multilingual sentence embedding model |
| FAISS (`IndexFlatIP`) | Efficient vector similarity search |
| Cosine similarity | Compare semantic representations |
| Pandas | Read and process tabular datasets |

**Note:** Keep only the tools that are actually used by the code in your repository. If the current UI is implemented with React rather than Streamlit, update this table and the run instructions accordingly.

## 🔄 How It Works

1. **Upload a dataset**  
   Upload a CSV file containing the records you want to inspect.

2. **Select the text field**  
   Identify the column containing the text to compare (for example, a name, description, or user-submitted response).

3. **Preprocess text**  
   Clean and normalize text as needed, while preserving the information required for comparison.

4. **Generate embeddings**  
   Convert each text entry into a numerical vector using a multilingual sentence-transformer model.

5. **Calculate similarity**  
   Compare vectors using cosine similarity or an equivalent normalized inner-product search.

6. **Identify duplicate candidates**  
   Apply a configured similarity threshold to flag likely duplicates. The project has used **0.70 as an experimental threshold**; tune it against representative data rather than treating it as universally correct.

7. **Review results**  
   Inspect matching records and their similarity/confidence scores. Review borderline matches before merging or deleting anything.

8. **Export cleaned data**  
   Export the reviewed results if the export feature is implemented in your current version.

## 🧠 How Semantic Matching Helps

Exact matching may miss records such as:

- `The application is easy to use`
- `This app is simple to operate`

The wording differs, but the meaning is similar. Multilingual embeddings can also help compare semantically similar text written in different supported languages. Results depend on the model, data quality, language, and selected threshold, so human review is recommended before removing records.

## 📁 Suggested Repository Structure

```text
DupliDetect-AI/
├── assets/
│   ├── 01-homepage.png
│   ├── 02-login-page.png
│   ├── 03-upload-dataset.png
│   ├── 04-upload-success.png
│   └── 05-results-dashboard.png
├── app.py
├── requirements.txt
└── README.md
```

Your existing project may use a different structure. Keep your current files and place the screenshots in an `assets/` folder at the repository root, or update the image paths in this README to match your folders.

## ⚙️ Setup and Run

The following commands are for a Python/Streamlit implementation. Run them from the project root and adjust the filenames if your app uses a different entry point.

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_REPOSITORY_FOLDER>
```

### 2. Create a virtual environment

**Windows**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS / Linux**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

If your repository has a `requirements.txt` file:

```bash
pip install -r requirements.txt
```

If you have not created one yet, add the dependencies used by your code. For a Streamlit-based implementation, these may include:

```text
streamlit
pandas
sentence-transformers
faiss-cpu
```

Install only the packages your code actually imports. FAISS installation options can vary by Python version and operating system.

### 4. Start the application

```bash
streamlit run app.py
```

Open the local URL printed in your terminal. If your application is built with a different framework, replace this command with the appropriate development command.

## 🧪 Example Use Cases

- Finding repeated customer or contact records
- Detecting similar survey responses
- Identifying duplicate product or content descriptions
- Reviewing multilingual text datasets
- Preparing datasets for downstream analytics or machine-learning workflows

## 🔐 Data and Safety Notes

- Do not upload confidential or personally identifiable data to a public demo.
- Review duplicate candidates before deleting or merging records.
- Similarity scores are estimates, not guarantees that two records are duplicates.
- Authentication buttons shown in the UI do not prove that OAuth or production authentication is configured; document only the authentication methods that are implemented.

## 🛣️ Future Improvements

- Add robust validation for uploaded files and required columns.
- Display matched record pairs with clear explanations and confidence scores.
- Allow users to tune the similarity threshold.
- Add downloadable reports and duplicate-cluster summaries.
- Add automated tests for preprocessing, similarity calculations, and export logic.
- Implement secure authentication, persistent storage, and deployment monitoring if required.
- Evaluate precision and recall on a labelled multilingual test dataset.

## 👩‍💻 Author

**Pooja Naik**

MCA Candidate | Software Development | Python | Machine Learning | SQL

---

If you find this project useful, consider starring the repository ⭐
