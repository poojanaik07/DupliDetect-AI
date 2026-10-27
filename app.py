import streamlit as st
import streamlit.components.v1 as components
import pandas as pd
import time
import os
import base64

# Import logic from backend files
try:
    from model import get_embeddings
    from utils import find_duplicates_faiss
    from translator import translate_batch
except ImportError:
    # Fallback mock logic if files are missing
    def get_embeddings(texts): return [[0.1]*384 for _ in texts]
    def find_duplicates_faiss(embeds): return list(range(len(embeds)))
    def translate_batch(texts, lang): return [f"[{lang}] {t}" for t in texts]

# ⚡ CACHING
@st.cache_data
def cached_embeddings(texts):
    return get_embeddings(texts)

@st.cache_data
def cached_groups(embeddings):
    return find_duplicates_faiss(embeddings)

# Set page config
st.set_page_config(
    page_title="DupliDetect AI", 
    page_icon="🌍", 
    layout="wide", 
    initial_sidebar_state="collapsed"
)

# Custom CSS to hide Streamlit header and make it look clean
st.markdown("""
    <style>
        .main .block-container {
            padding: 0 !important;
            max-width: 100% !important;
        }
        [data-testid="stHeader"] {
            display: none;
        }
        div[data-testid="stVerticalBlock"] > div:has(div.stButton) {
            text-align: center;
        }
        .stButton button {
            background: linear-gradient(90deg, #a855f7 0%, #3b82f6 100%);
            color: white;
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 9999px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        .stButton button:hover {
            opacity: 0.9;
            transform: translateY(-2px);
            color: white;
        }
    </style>
""", unsafe_allow_html=True)

# Navigation State
if 'view' not in st.session_state:
    st.session_state.view = 'landing'

# Load React Bundle
def get_react_html():
    if os.path.exists("bundle.html"):
        with open("bundle.html", "r", encoding="utf-8") as f:
            return f.read()
    return "<h1>bundle.html not found. Run 'npm run build && python inline_build.py'</h1>"

if st.session_state.view == 'landing':
    # RENDER FULL REACT FRONTEND
    html_content = get_react_html()
    
    # We use a large height to ensure the whole landing page is scrollable within the iframe 
    # OR we use height=height of viewport if we want it to feel native.
    # Note: Streamlit iframes don't automatically resize to content.
    components.html(html_content, height=6000, scrolling=False)
    
    # Floating button to enter the tool (Streamlit logic)
    # This button floats over the React content to provide the transition
    st.markdown("""
        <div style="position: fixed; bottom: 30px; right: 30px; z-index: 10000;">
    """, unsafe_allow_html=True)
    if st.button("🚀 Enter Dashboard"):
        st.session_state.view = 'dashboard'
        st.rerun()
    st.markdown("</div>", unsafe_allow_html=True)

else:
    # THE STREAMLIT DASHBOARD (TOOL)
    # We keep the React Navbar and Footer as wrappers if possible
    # But for now, let's show the professional dashboard logic
    
    st.markdown("<div style='padding: 2rem;'>", unsafe_allow_html=True)
    
    col1, col2 = st.columns([1, 5])
    with col1:
        if st.button("⬅ Home"):
            st.session_state.view = 'landing'
            st.rerun()
    
    st.title("🌍 Multilingual Duplicate Detector")
    st.caption("Detect duplicate records across languages using semantic similarity")

    uploaded_file = st.file_uploader("📂 Upload CSV Dataset", type=["csv"])

    if uploaded_file:
        start_time = time.time()
        progress = st.progress(0, text="🚀 Initializing...")

        df = pd.read_csv(uploaded_file)
        progress.progress(10, text="📂 Data loaded successfully")

        st.subheader("📊 Data Preview")
        st.dataframe(df.head(500), use_container_width=True)

        # Column detection
        text_col = 'text' if 'text' in df.columns else df.columns[1]
        texts = df[text_col].astype(str).str.lower().str.strip().tolist()

        # 🔄 Processing
        with st.spinner("🔄 AI is analyzing meanings..."):
            embeddings = cached_embeddings(texts)
            progress.progress(60, text="🧠 Semantic vectors generated")
            
            labels = cached_groups(embeddings)
            progress.progress(90, text="🔍 Matches identified")

        df['group'] = labels
        clean_df = df.drop_duplicates(subset=['group']).copy().drop(columns=['group'])
        
        progress.progress(100, text="✅ Analysis Complete")

        # 📊 Stats
        total_time = time.time() - start_time
        speed = len(df) / total_time

        c1, c2, c3 = st.columns(3)
        c1.metric("📄 Total Records", len(df))
        c2.metric("🧹 Clean Records", len(clean_df))
        c3.metric("⚡ Processing Speed", f"{speed:.0f} rec/sec")

        st.divider()

        # Explorer
        duplicates = df[df.duplicated(subset=['group'], keep=False)].copy().sort_values(by='group')
        st.subheader("🔍 Duplicate Groups Explorer")
        
        if len(duplicates) > 0:
            group_ids = sorted(duplicates['group'].unique())
            selected_group = st.selectbox("Select a duplicate group to inspect:", group_ids)
            group_data = duplicates[duplicates['group'] == selected_group]
            
            st.dataframe(group_data, use_container_width=True)
            
            st.write("### 🧠 Semantic Comparison")
            texts_in_group = group_data[text_col].tolist()
            for i in range(min(2, len(texts_in_group))):
                for j in range(i + 1, min(3, len(texts_in_group))):
                    st.info(f"Similarity detected between:\n1. {texts_in_group[i]}\n2. {texts_in_group[j]}")
        else:
            st.success("No duplicates found! Your data is clean.")

        st.divider()

        # Actions
        st.subheader("📥 Export & Results")
        
        col_ex1, col_ex2 = st.columns(2)
        with col_ex1:
            csv_raw = df.to_csv(index=False).encode('utf-8')
            st.download_button("📥 Download Raw Grouped Data", csv_raw, "grouped_results.csv", "text/csv")
        
        with col_ex2:
            csv_clean = clean_df.to_csv(index=False).encode('utf-8')
            st.download_button("🧹 Download Clean Dataset", csv_clean, "clean_data.csv", "text/csv")

        # Translation Section
        st.divider()
        st.subheader("🌐 Global Translation")
        
        langs = {"English": "en", "Hindi": "hi", "Japanese": "ja", "Spanish": "es", "French": "fr"}
        target_lang = st.selectbox("Translate clean data to:", list(langs.keys()))
        
        if st.button("🚀 Start Translation"):
            with st.spinner(f"Translating to {target_lang}..."):
                sample = clean_df.head(100).copy()
                sample[f"translated_{langs[target_lang]}"] = translate_batch(sample[text_col].tolist(), langs[target_lang])
                st.dataframe(sample, use_container_width=True)
                st.success("Translation complete!")

    st.markdown("</div>", unsafe_allow_html=True)
