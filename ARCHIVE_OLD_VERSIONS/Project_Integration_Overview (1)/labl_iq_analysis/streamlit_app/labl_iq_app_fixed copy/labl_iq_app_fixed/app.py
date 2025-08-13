import streamlit as st
import pandas as pd
import numpy as np
from pathlib import Path
import json
import os
import logging
from calc_engine import AmazonRateCalculator
import base64
import matplotlib.pyplot as plt

# Set page config
st.set_page_config(
    page_title="Labl IQ Rate Analyzer",
    page_icon=None,
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for black and white theme with modern styling
st.markdown("""
    <style>
    body {
        color: white;
        background-color: black;
    }
    .stApp {
        background-color: black;
    }
    .main {
        background-color: black;
        color: white;
    }
    
    /* Make the entire sidebar white - comprehensive styling */
    .sidebar {
        background-color: white !important;
        color: black !important;
    }
    .sidebar .sidebar-content {
        background-color: white !important;
        color: black !important;
    }
    section[data-testid="stSidebar"] {
        background-color: white !important;
        color: black !important;
    }
    section[data-testid="stSidebar"] > div {
        background-color: white !important;
        color: black !important;
    }
    section[data-testid="stSidebar"] .stMarkdown {
        color: black !important;
    }
    .sidebar-content {
        background-color: white !important;
    }
    
    /* Main area headers */
    .main h1, .main h2, .main h3, .main h4, .main h5, .main h6 {
        color: white !important;
    }
    
    /* Main area text - ensure all text is white */
    .main p, .main div, .main span, .main label {
        color: white !important;
    }
    
    /* Main area form elements */
    .main .stTextInput > div > div > input {
        color: white !important;
        background-color: #333 !important;
    }
    
    .main .stSelectbox > div > div > select {
        color: white !important;
        background-color: #333 !important;
    }
    
    .main .stNumberInput > div > div > input {
        color: white !important;
        background-color: #333 !important;
    }
    
    /* Main area buttons */
    .main .stButton > button {
        color: white !important;
        background-color: #333 !important;
        border: 1px solid #555 !important;
    }
    
    /* Main area dataframes */
    .main .stDataFrame {
        color: white !important;
    }
    
    /* Main area metrics */
    .main .stMetric {
        color: white !important;
    }
    
    /* Main area info boxes */
    .main .stAlert {
        color: white !important;
        background-color: #333 !important;
        border: 1px solid #555 !important;
    }
    
    /* Main area success/error messages */
    .main .stSuccess, .main .stError, .main .stWarning, .main .stInfo {
        color: white !important;
    }
    
    /* Buttons in main area */
    .stButton>button {
        color: white;
        background-color: black;
    }
    .stTextInput>div>div>input {
        color: white;
        background-color: black;
    }

    /* Navigation and logo styling */
    .sidebar-header {
        display: none !important;
    }
    
    /* Logo styling - increase size */
    .sidebar-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        box-shadow: none !important;
        background-color: white !important;
        padding: 15px 0 !important;
        margin-bottom: 20px !important;
    }
    .sidebar-logo img {
        max-width: 180px !important; /* Increased size from 150px to 180px */
        height: auto;
        margin-right: -15px; /* Reduced margin to bring IQ closer to logo */
        display: inline-block;
    }
    .sidebar-logo span {
        font-size: 40px !important;
        font-weight: bold;
        margin-left: 0px; /* Reduced margin to bring IQ closer to logo */
        color: black;
        line-height: 1;
        display: inline-block;
    }
    
    /* Navigation buttons - ensure they are black with white text */
    .sidebar [data-testid="baseButton-secondary"],
    .sidebar button,
    .sidebar .stButton > button {
        background-color: black !important;
        color: white !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        border-radius: 4px !important;
        margin-bottom: 6px !important;
        padding: 8px 4px !important;
        min-height: 0 !important;
        line-height: 1.2 !important;
        width: 100% !important;
        transition: all 0.2s ease !important;
    }
    
    /* Button hover effects */
    .sidebar button:hover,
    .sidebar [data-testid="baseButton-secondary"]:hover,
    .sidebar .stButton > button:hover {
        background-color: #333 !important;
        transform: translateY(-1px) !important;
    }
    
    .sidebar button:active,
    .sidebar [data-testid="baseButton-secondary"]:active,
    .sidebar .stButton > button:active {
        background-color: #555 !important;
    }
    
    /* Very specific text color rule */
    .sidebar button p,
    .sidebar button span,
    .sidebar [data-testid="baseButton-secondary"] p,
    .sidebar [data-testid="baseButton-secondary"] span,
    .sidebar .stButton > button p,
    .sidebar .stButton > button span {
        color: white !important;
    }
    
    /* Additional text overrides for different elements */
    .sidebar button p,
    .sidebar button span,
    .sidebar button div,
    .sidebar [data-testid="baseButton-secondary"] p,
    .sidebar [data-testid="baseButton-secondary"] span,
    .sidebar [data-testid="baseButton-secondary"] div {
        color: white !important;
    }
    
    /* Info boxes in settings panel */
    .sidebar .stAlert {
        background-color: #f8f9fa !important;
        border: 1px solid #ddd !important;
        border-radius: 4px !important;
    }
    
    .sidebar .stAlert p {
        color: black !important;
    }
    
    /* Override for form buttons inside settings panels */
    .sidebar .settings-panel .stButton > button,
    .sidebar .settings-panel .stButton > button span,
    .sidebar .settings-panel .stButton > button p,
    .sidebar .settings-panel [data-testid="baseButton-secondary"],
    .sidebar .settings-panel form .stButton > button {
        background-color: black !important;
        color: white !important;
    }
    
    /* Headers in sidebar */
    .sidebar h1, 
    .sidebar h2, 
    .sidebar h3, 
    .sidebar h4 {
        color: black !important;
        background-color: white !important;
        padding: 10px 0 5px 0 !important;
        margin: 0 !important;
        font-weight: bold !important;
        border: none !important;
    }
    
    /* Clean up any remaining form styling issues */
    .sidebar form button {
        background-color: black !important;
        color: white !important;
    }
    
    .sidebar form button p,
    .sidebar form button span {
        color: white !important;
    }
    
    /* Improved nav menu */
    .nav-container {
        margin-top: 20px;
        width: 100%;
    }
    .nav-item {
        display: block;
        padding: 12px 15px;
        margin: 8px 0;
        border-radius: 5px;
        background-color: black;
        cursor: pointer;
        color: white;
        font-weight: 500;
        font-size: 16px;
        text-align: left;
        text-decoration: none;
        transition: background-color 0.2s;
        border: none;
        width: 100%;
    }
    .nav-item:hover, .nav-item.active {
        background-color: #333;
    }
    
    /* Sidebar navigation buttons */
    .sidebar button {
        background-color: black !important;
        color: white !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        border-radius: 4px !important;
        margin-bottom: 8px !important;
        transition: all 0.2s ease !important;
    }
    .sidebar button:hover {
        background-color: #333 !important;
        transform: translateY(-1px) !important;
    }
    .sidebar button:active {
        background-color: #555 !important;
    }
    
    /* Active navigation styling */
    .sidebar [data-testid="stHorizontalBlock"] [data-testid="baseButton-secondary"]:first-of-type {
        background-color: #333 !important;
        border-left: 3px solid white !important;
    }
    
    /* Sidebar inputs and controls */
    .sidebar .stSelectbox label,
    .sidebar .stNumberInput label,
    .sidebar .stTextInput label,
    .sidebar .stSlider label {
        color: black !important;
    }
    
    /* Sidebar toggle button */
    .sidebar .stCheckbox label span p {
        color: black !important;
    }
    
    /* Sidebar button styling */
    .sidebar .stButton > button {
        background-color: black !important;
        color: white !important;
        border: 1px solid #333 !important;
        font-weight: 500 !important;
        margin-bottom: 6px !important;
        padding: 0.5rem 1rem !important;
    }
    
    /* Sidebar success messages */
    .sidebar .element-container .stAlert.st-ae {
        background-color: #dff0d8 !important;
        color: #3c763d !important;
    }
    
    /* Main area selectbox and input styling */
    div[data-baseweb="select"] {
        background-color: rgba(40, 40, 40, 0.8) !important;
        border-color: rgba(255, 255, 255, 0.2) !important;
    }
    div[data-baseweb="select"] span, 
    div[data-baseweb="select"] div {
        color: white !important;
    }
    div[data-baseweb="popover"] {
        background-color: rgba(40, 40, 40, 0.9) !important;
        border-color: rgba(255, 255, 255, 0.3) !important;
    }
    div[data-baseweb="popover"] ul, 
    div[data-baseweb="popover"] li {
        background-color: transparent !important;
        color: white !important;
    }
    div[data-baseweb="popover"] li:hover {
        background-color: rgba(80, 80, 80, 0.9) !important;
    }
    
    /* Sidebar selectbox styling */
    .sidebar div[data-baseweb="select"] {
        background-color: white !important;
        border-color: rgba(0, 0, 0, 0.2) !important;
    }
    .sidebar div[data-baseweb="select"] span, 
    .sidebar div[data-baseweb="select"] div {
        color: black !important;
    }
    .sidebar div[data-baseweb="popover"] {
        background-color: white !important;
        border-color: rgba(0, 0, 0, 0.2) !important;
    }
    .sidebar div[data-baseweb="popover"] ul, 
    .sidebar div[data-baseweb="popover"] li {
        background-color: white !important;
        color: black !important;
    }
    .sidebar div[data-baseweb="popover"] li:hover {
        background-color: rgba(230, 230, 230, 0.9) !important;
    }
    
    /* Settings panel styling */
    .settings-panel {
        background-color: rgba(40, 40, 40, 0.8);
        border-radius: 8px;
        margin-bottom: 20px;
        padding: 15px;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .settings-header {
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        padding-bottom: 10px;
        margin-bottom: 15px;
        font-weight: bold;
        font-size: 18px;
    }
    
    /* Sidebar settings panel */
    .sidebar .settings-panel {
        background-color: white;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 15px;
    }
    .sidebar .settings-header {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        color: black !important;
        font-weight: bold;
        padding-bottom: 8px;
        margin-bottom: 10px;
    }
    
    /* Toggle button styling */
    .sidebar .stCheckbox label span p {
        color: black !important;
    }
    
    /* Comprehensive checkbox text styling */
    .sidebar .stCheckbox label,
    .sidebar .stCheckbox label span,
    .sidebar .stCheckbox label div,
    .sidebar .stCheckbox label p,
    .sidebar .stCheckbox > label > div,
    .sidebar [data-testid="stCheckbox"] label,
    .sidebar [data-testid="stCheckbox"] label span,
    .sidebar [data-testid="stCheckbox"] label div {
        color: black !important;
        font-weight: normal !important;
    }

    /* IMPORTANT: Toggle switch must be BLACK when off and GREEN when on */
    .sidebar .stToggle div[role="switch"] {
        height: 24px !important;
        width: 48px !important;
        background-color: #000000 !important; /* BLACK when off */
        border: 1px solid #555 !important;
        box-shadow: none !important;
        opacity: 1 !important;
    }
    
    /* Toggle when on (checked/active) */
    .sidebar .stToggle div[role="switch"][aria-checked="true"] {
        background-color: #4CAF50 !important; /* GREEN when on */
        border-color: #2E7D32 !important;
        opacity: 1 !important;
    }
    
    /* Toggle indicator (the sliding part) */
    .sidebar .stToggle div[role="switch"] span {
        height: 20px !important;
        width: 20px !important;
        margin: 1px !important;
        background-color: white !important;
        border: 1px solid #666 !important;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
    }

    /* IMPORTANT: Info text must be BLACK and READABLE */
    .sidebar .stInfo {
        background-color: #e1e9f5 !important; 
        border: 1px solid #c5d5eb !important;
        padding: 10px !important;
        margin: 10px 0 !important;
    }
    
    .sidebar .stInfo p {
        color: #000000 !important; /* BLACK text */
        font-weight: 500 !important;
        line-height: 1.4 !important;
        opacity: 1 !important;
    }

    /* Remove added gray backgrounds behind labels */
    .sidebar [data-testid="stNumberInput"] label,
    .sidebar [data-testid="stTextInput"] label,
    .sidebar [data-testid="stSelectbox"] label {
        background-color: transparent !important;
        padding: 2px 0 !important;
        border-radius: 0 !important;
    }

    /* Hide any "Lock" text that appears above toggles */
    .sidebar [data-testid="column"] > div > div:first-child > div[data-testid="stMarkdownContainer"] {
        display: none !important;
    }

    /* Active section styling */
    .sidebar button.nav-active {
        background-color: #333 !important;
        border-left: 3px solid #fff !important;
    }
    
    /* Form elements */
    .stNumberInput input, 
    .stTextInput input {
        color: white !important;
        background-color: rgba(30, 30, 30, 0.8) !important;
        border-color: rgba(255, 255, 255, 0.2) !important;
    }
    
    /* Sidebar form elements */
    .sidebar .stNumberInput input, 
    .sidebar .stTextInput input {
        color: black !important;
        background-color: white !important;
        border-color: rgba(0, 0, 0, 0.2) !important;
    }
    
    /* Hide streamlit branding */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}

    /* Custom Style to remove the gray panel at Basic Settings */
    .remove-panel-styling {
        background-color: transparent !important;
        padding: 0 !important;
        margin: 0 !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
    }
    
    /* Style for headers within clean panels */
    .remove-panel-styling .settings-header {
        background-color: transparent !important;
        color: black !important;
        border-bottom: none !important;
        font-weight: bold;
        padding: 10px 0 !important;
        margin: 0 !important;
    }

    /* Quote Criteria styling */
    .sidebar h1, 
    .sidebar h2, 
    .sidebar h3, 
    .sidebar h4 {
        color: black !important;
        background-color: white !important;
        padding: 10px 0 5px 0 !important;
        margin: 0 !important;
        font-weight: bold !important;
        border: none !important;
    }
    
    /* Override the font/color of buttons in settings panel */
    .sidebar .remove-panel-styling ~ button, 
    .sidebar .remove-panel-styling ~ div button {
        background-color: black !important;
    }
    
    .sidebar .remove-panel-styling ~ button *, 
    .sidebar .remove-panel-styling ~ div button * {
        color: white !important;
    }

    /* Override gray panel styling for main content area */
    [data-testid="stVerticalBlock"] > div > div[style*="background-color: rgb"] {
        background-color: white !important;
        border: none !important;
        box-shadow: none !important;
    }
    
    /* Override any gray settings panel */
    .element-container div[data-testid="stVerticalBlock"] > div {
        background-color: transparent !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
    }

    /* More specific override for the gray panel in main content */
    section[data-testid="stSidebar"] ~ div [data-testid="stVerticalBlock"] div {
        background-color: transparent !important;
        border: none !important;
        box-shadow: none !important;
    }
    
    /* Target Basic Settings section specifically */
    [data-testid="stSidebar"] ~ div h1 + div,
    [data-testid="stSidebar"] ~ div h1 + div > div > div {
        background-color: transparent !important;  
        border: none !important;
        box-shadow: none !important;
    }

    /* Direct selection of navigation buttons and text color */
    .sidebar [data-testid="stHorizontalBlock"] [data-testid="baseButton-secondary"],
    .sidebar [data-testid="stVerticalBlock"] [data-testid="baseButton-secondary"] {
        background-color: black !important;
        color: white !important;
    }
    
    /* Completely override any nested elements inside navigation buttons */
    .sidebar [data-testid="stHorizontalBlock"] [data-testid="baseButton-secondary"] *,
    .sidebar [data-testid="stVerticalBlock"] [data-testid="baseButton-secondary"] * {
        color: white !important;
        font-weight: 500 !important;
    }
    
    /* Specific selection to override any text styles */
    .sidebar [data-testid="baseButton-secondary"] div[data-testid="StyledLinkIconContainer"] div,
    .sidebar [data-testid="baseButton-secondary"] div[data-testid="StyledLinkIconContainer"] p,
    .sidebar [data-testid="baseButton-secondary"] div[data-testid="StyledLinkIconContainer"] span,
    .sidebar [data-testid="baseButton-secondary"] p {
        color: white !important;
    }
    
    /* !important override for navigation button text */
    .sidebar button {
        color: white !important;
    }
    
    .sidebar button p, 
    .sidebar button span, 
    .sidebar button div {
        color: white !important;
        font-weight: 500 !important;
    }

    /* Extremely specific selectors for button text */
    .sidebar [data-testid="baseButton-secondary"] div p {
        color: white !important;
    }
    
    /* Direct color override for all sidebar button text */
    section[data-testid="stSidebar"] button p,
    section[data-testid="stSidebar"] [data-testid="baseButton-secondary"] p {
        color: white !important;
    }
    
    /* Use attribute selector for more specificity */
    .sidebar button[kind="secondary"] p {
        color: white !important;
    }
    
    /* Target all possible text elements within buttons */
    .sidebar button div:first-child p,
    .sidebar button div:first-child span,
    .sidebar button div span,
    .sidebar button div div,
    .sidebar button p {
        color: white !important;
    }

    /* Pseudo-element approach to force white text on buttons */
    .sidebar button p {
        position: relative;
        z-index: 1;
    }
    
    .sidebar button p::before {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        color: white !important;
        z-index: 2;
    }
    
    /* Directly target nav buttons with attribute selectors */
    .sidebar [data-testid="baseButton-secondary"][aria-label*="Basic Settings"] p,
    .sidebar [data-testid="baseButton-secondary"][aria-label*="Rate Settings"] p,
    .sidebar [data-testid="baseButton-secondary"][aria-label*="Surcharge Settings"] p,
    .sidebar [data-testid="baseButton-secondary"][aria-label*="Advanced Settings"] p,
    .sidebar [data-testid="baseButton-secondary"][aria-label*="Debug Options"] p {
        color: white !important;
        opacity: 1 !important;
        visibility: visible !important;
    }

    /* Specific CSS to ensure white text on nav buttons */
    section[data-testid="stSidebar"] [data-testid="baseButton-secondary"]{
        background-color: black !important;
    }
    
    section[data-testid="stSidebar"] [data-testid="baseButton-secondary"] p,
    section[data-testid="stSidebar"] [data-testid="baseButton-secondary"] span,
    section[data-testid="stSidebar"] [data-testid="baseButton-secondary"] div {
        color: white !important;
        -webkit-text-fill-color: white !important;
        font-weight: 500 !important;
    }
    
    /* Override Streamlit's default styles for buttons */
    .sidebar .nav-container button p {
        color: white !important;
        -webkit-text-fill-color: white !important;
    }

    /* Extremely specific rule for button text */
    section[data-testid="stSidebar"] div[data-testid="stVerticalBlock"] button[kind="secondary"] p {
        color: white !important;
    }

    /* Make toggle switches and checkboxes more visible */
    .sidebar .stCheckbox > div > div[role="checkbox"] {
        background-color: #e0e0e0 !important;
        border: 1px solid #aaa !important;
    }
    
    .sidebar .stCheckbox > div > div[role="checkbox"][aria-checked="true"] {
        background-color: #4CAF50 !important;
    }
    
    /* Ensure toggle labels are black */
    .sidebar .stCheckbox label span p {
        color: black !important;
        font-weight: 500 !important;
    }
    
    /* Improve visibility of toggle switches */
    .sidebar .stToggle div[role="switch"] {
        height: 24px !important;
        width: 48px !important;
        background-color: #222222 !important; /* Dark black for off state */
        border: 1px solid #999 !important;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2) !important;
    }
    
    .sidebar .stToggle div[role="switch"][aria-checked="true"] {
        background-color: #4CAF50 !important; /* Bright green for on state */
        border-color: #2E7D32 !important;
    }
    
    /* Toggle switch indicator/knob - bigger and more visible */
    .sidebar .stToggle div[role="switch"] span {
        height: 20px !important;
        width: 20px !important;
        margin: 1px !important;
        background-color: white !important;
        border: 1px solid #555 !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4) !important;
    }

    /* Override info text for better readability */
    .sidebar .stAlert {
        background-color: #f0f7ff !important;
        border: 1px solid #b3d7ff !important;
        color: #0c5460 !important;
        border-radius: 4px !important;
    }
    
    .sidebar .stAlert p {
        color: #0c5460 !important;
        font-weight: 500 !important;
    }
    
    /* Target specifically the "Settings are automatically saved" info box */
    .sidebar .stInfo {
        background-color: #e6f3ff !important;
        border: 1px solid #b3d7ff !important;
    }
    
    .sidebar .stInfo p {
        color: black !important;
        font-weight: 600 !important;
    }

    /* Ensure lock toggles are more visible */
    .sidebar .stToggle label[aria-label="🔒"] {
        color: black !important;
        font-weight: 600 !important;
        font-size: 18px !important;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3) !important;
    }

    /* Custom button for lock/unlock functionality instead of toggle */
    .lock-button {
        padding: 5px 10px !important;
        background-color: #333 !important;
        color: white !important;
        border-radius: 5px !important;
        border: none !important;
        cursor: pointer !important;
        display: inline-block !important;
        text-align: center !important;
        font-size: 16px !important;
        transition: background-color 0.3s !important;
    }
    
    .lock-button.locked {
        background-color: #4CAF50 !important;
    }
    
    .lock-button:hover {
        opacity: 0.9 !important;
    }

    /* Override Streamlit button styling for lock buttons */
    button[kind="secondary"][data-testid="baseButton-secondary"][key^="lock_"] {
        background-color: #333333 !important;
        color: white !important;
        min-width: 40px !important;
        height: 36px !important;
        padding: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 18px !important;
        border-radius: 4px !important;
        margin-top: 5px !important;
    }
    
    /* Make locked state visibly different */
    button[kind="secondary"][data-testid="baseButton-secondary"][key="lock_markup"][aria-disabled="true"],
    button[kind="secondary"][data-testid="baseButton-secondary"][key="lock_fuel"][aria-disabled="true"],
    button[kind="secondary"][data-testid="baseButton-secondary"][key="lock_dim"][aria-disabled="true"],
    button[kind="secondary"][data-testid="baseButton-secondary"][key="lock_das"][aria-disabled="true"],
    button[kind="secondary"][data-testid="baseButton-secondary"][key="lock_edas"][aria-disabled="true"],
    button[kind="secondary"][data-testid="baseButton-secondary"][key="lock_remote"][aria-disabled="true"] {
        background-color: #4CAF50 !important;
        color: white !important;
    }

    /* Make toggle switches BLACK when off for visibility */
    div[role="switch"][aria-checked="false"] {
        background-color: #333333 !important;
    }

    div[role="switch"][aria-checked="true"] {
        background-color: #4CAF50 !important;
    }

    /* Override the knob/slider part of the switch */
    div[role="switch"] span {
        background-color: white !important;
    }

    /* More specific toggle switch styling */
    .stToggle div[role="switch"] {
        background-color: #333333 !important; /* BLACK for OFF state */
        border: 1px solid #777 !important;
        box-shadow: none !important;
        opacity: 1 !important;
        visibility: visible !important;
    }
    
    .stToggle div[role="switch"][aria-checked="true"] {
        background-color: #4CAF50 !important; /* GREEN for ON state */
        border-color: #2E7D32 !important;
        opacity: 1 !important;
        visibility: visible !important;
    }
    
    /* Style the toggle knob */
    .stToggle div[role="switch"] span {
        background-color: white !important;
        border: 1px solid #777 !important;
        opacity: 1 !important;
        visibility: visible !important;
    }
    
    /* Target specific toggle by key */
    [data-testid="stToggleButton"][aria-label="🔒"] div[role="switch"] {
        background-color: #333333 !important;
    }
    
    [data-testid="stToggleButton"][aria-label="🔒"] div[role="switch"][aria-checked="true"] {
        background-color: #4CAF50 !important;
    }

    /* CRITICAL: Force toggle visibility with !important and targeted selectors */
    [data-testid="stToggle"] div[role="switch"] {
        background-color: #000000 !important;
        border: 1px solid #777 !important;
        visibility: visible !important;
        opacity: 1 !important;
    }
    
    [data-testid="stToggle"] div[role="switch"][aria-checked="true"] {
        background-color: #4CAF50 !important;
        visibility: visible !important;
        opacity: 1 !important;
    }
    
    /* Force the toggle knob to be visible */
    [data-testid="stToggle"] div[role="switch"] span {
        background-color: white !important;
        visibility: visible !important;
        opacity: 1 !important;
    }
    
    /* Target emoji label */
    [data-testid="stToggle"] label span {
        color: black !important;
        font-size: 16px !important;
        font-weight: bold !important;
    }

    /* Very specific text color rule */
    .sidebar button p,
    .sidebar button span,
    .sidebar [data-testid="baseButton-secondary"] p,
    .sidebar [data-testid="baseButton-secondary"] span,
    .sidebar .stButton > button p,
    .sidebar .stButton > button span {
        color: white !important;
    }
    
    /* Additional text overrides for different elements */
    .sidebar button p,
    .sidebar button span,
    .sidebar button div,
    .sidebar [data-testid="baseButton-secondary"] p,
    .sidebar [data-testid="baseButton-secondary"] span,
    .sidebar [data-testid="baseButton-secondary"] div {
        color: white !important;
    }
    
    /* Sidebar form elements - ensure black text on white background */
    .sidebar .stTextInput > div > div > input,
    .sidebar .stNumberInput > div > div > input,
    .sidebar .stSelectbox > div > div > div,
    .sidebar .stSelectbox > div > div > select,
    .sidebar .stSelectbox label,
    .sidebar .stNumberInput label,
    .sidebar .stCheckbox label,
    .sidebar .stRadio label,
    .sidebar .stMarkdown,
    .sidebar label {
        color: black !important;
        background-color: white !important;
    }
    .sidebar .stSelectbox > div > div > div {
        color: black !important;
    }
    .sidebar .stSelectbox > div > div > select {
        color: black !important;
    }
    .sidebar .stNumberInput > div > div > input {
        color: black !important;
    }
    .sidebar .stCheckbox > div > div > label {
        color: black !important;
    }
    .sidebar .stRadio > div > div > label {
        color: black !important;
    }
    
    /* Sidebar labels and text */
    .sidebar label, .sidebar .stMarkdown {
        color: black !important;
    }
    
    /* Sidebar info boxes */
    .sidebar .stAlert {
        background-color: #f8f9fa !important;
        border: 1px solid #ddd !important;
        border-radius: 4px !important;
    }
    
    .sidebar .stAlert p {
        color: black !important;
    }
    </style>
    """, unsafe_allow_html=True)

# Display title in main area
st.title("Labl IQ Rate Analyzer")

# Initialize session state
if 'processed_data' not in st.session_state:
    st.session_state.processed_data = None
if 'mapping' not in st.session_state:
    st.session_state.mapping = {}
if 'criteria' not in st.session_state:
    st.session_state.criteria = {
        'origin_zip': '46307',
        'markup_percentage': 10.0,
        'fuel_surcharge_percentage': 16.0,
        'das_surcharge': 1.98,
        'edas_surcharge': 3.92,
        'remote_surcharge': 14.15,
        'dim_divisor': 139,
        'standard_markup': 0.0,
        'expedited_markup': 10.0,
        'priority_markup': 15.0,
        'next_day_markup': 25.0,
        'locked_settings': {}
    }
if 'calculator' not in st.session_state:
    st.session_state.calculator = None
if 'active_section' not in st.session_state:
    st.session_state.active_section = "Basic Settings"
if 'app_step' not in st.session_state:
    st.session_state['app_step'] = 'upload'

# Required fields for the quote calculation
REQUIRED_FIELDS = [
    'destination_zip',
    'weight',
    'length',
    'width',
    'height',
    'carrier_rate'  # Added carrier rate field
]

# Optional fields that can be mapped
OPTIONAL_FIELDS = [
    'shipment_id',
    'service_level',
    'package_type'
]

def load_saved_mapping():
    """Load saved column mapping from a JSON file."""
    mapping_file = Path("column_mapping.json")
    if mapping_file.exists():
        try:
            with open(mapping_file, 'r') as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_mapping(mapping):
    """Save column mapping to a JSON file."""
    mapping_file = Path("column_mapping.json")
    try:
        with open(mapping_file, 'w') as f:
            json.dump(mapping, f)
    except Exception as e:
        st.warning(f"Could not save mapping: {str(e)}")

def suggest_column_mapping(df):
    """Try to automatically detect column mappings based on common patterns."""
    suggestions = {}
    headers = df.columns.str.lower()
    
    # Mapping rules
    mapping_rules = {
        'destination_zip': ['zip', 'postal', 'destination'],
        'weight': ['weight', 'mass', 'lbs', 'pounds'],
        'length': ['length', 'long'],
        'width': ['width', 'wide'],
        'height': ['height', 'tall'],
        'shipment_id': ['id', 'order', 'tracking'],
        'service_level': ['service', 'shipping', 'method'],
        'package_type': ['type', 'package', 'box'],
        'carrier_rate': ['rate', 'paid', 'carrier', 'cost', 'charge', 'amount', 'price']
    }
    
    for field, keywords in mapping_rules.items():
        for col in headers:
            if any(keyword in col for keyword in keywords):
                # Get the first matching column using integer indexing
                matching_cols = df.columns[headers == col]
                if not matching_cols.empty:
                    suggestions[field] = matching_cols[0]
                break
    
    return suggestions

def calculate_dimensional_weight(row):
    """Calculate dimensional weight for a package."""
    try:
        dim_weight = (float(row['length']) * float(row['width']) * float(row['height'])) / 139
        return max(dim_weight, float(row['weight']))
    except:
        return float(row['weight'])

def format_currency(value):
    """Format a number as currency with 2 decimal places."""
    try:
        return f"${float(value):.2f}"
    except (ValueError, TypeError):
        return "$0.00"

def format_weight(value):
    """Format a number as weight with 2 decimal places."""
    try:
        return f"{float(value):.2f}"
    except (ValueError, TypeError):
        return "0.00"

def format_percentage(value):
    """Format a number as percentage with 1 decimal place."""
    try:
        return f"{float(value):.1f}%"
    except (ValueError, TypeError):
        return "0.0%"

def format_surcharge_name(name):
    """Format surcharge name for display"""
    if name == 'das_surcharge':
        return 'DAS'
    elif name == 'edas_surcharge':
        return 'EDAS'
    elif name == 'remote_surcharge':
        return 'Remote'
    elif name == 'fuel_surcharge':
        return 'Fuel'
    else:
        return name.replace('_', ' ').title()

def ensure_string_columns(dataframe):
    """Ensure all DataFrame column names are strings to prevent mixed type warnings"""
    if dataframe is not None and hasattr(dataframe, 'columns') and len(dataframe) > 0:
        # Convert all column names to strings
        dataframe.columns = dataframe.columns.astype(str)
        # Also ensure all data is string-compatible for display
        for col in dataframe.columns:
            if dataframe[col].dtype == 'object':
                dataframe[col] = dataframe[col].astype(str)
    return dataframe

def generate_rate_table(df, markup_pct=10.0, min_margin=0.5):
    """
    Generate a rate table with markup and minimum margin logic.
    Args:
        df: DataFrame with processed shipment data
        markup_pct: Markup percentage to apply
        min_margin: Minimum dollar margin per cell
    Returns:
        DataFrame: Rate table with zones as columns and weight tiers as rows
    """
    try:
        if df is None or len(df) == 0:
            raise ValueError("No data available for rate table generation.")
        
        # Only use zones 2-8
        zone_list = list(range(2, 9))
        
        # Build weight tiers: <= 1oz ... <= 15oz, then <= 1lb ... <= 150lb
        weight_labels = [f"<= {oz}oz" for oz in range(1, 16)] + [f"<= {lb}lb" for lb in range(1, 151)]
        weight_edges = [oz/16 for oz in range(1, 16)] + list(range(1, 151))
        
        # Prepare output
        rate_table = pd.DataFrame(index=weight_labels, columns=zone_list)
        
        # Track empty cells for debugging
        empty_cells = []
        total_cells = 0
        
        for i, label in enumerate(weight_labels):
            if i < 15:
                min_wt = i/16
                max_wt = (i+1)/16
            else:
                min_wt = i-14
                max_wt = i-13
                
            for zone in zone_list:
                total_cells += 1
                
                # Filter data for this zone and weight range
                cell_data = df[(df['zone'].astype(str)==str(zone)) & 
                              (df['billable_weight']>=min_wt) & 
                              (df['billable_weight']<max_wt)]
                
                if len(cell_data) == 0:
                    # No data for this combination - try to find a reasonable default
                    # First, try to find any data for this zone
                    zone_data = df[df['zone'].astype(str)==str(zone)]
                    if len(zone_data) > 0:
                        # Use average rate for this zone as baseline
                        base_rate = zone_data['final_rate'].mean()
                        # Apply markup and minimum margin
                        marked_up = base_rate * (1 + markup_pct/100)
                        min_allowed = base_rate + min_margin
                        final_rate = max(marked_up, min_allowed)
                        # Round to nearest $0.05
                        final_rate = round(final_rate * 20) / 20
                        rate = f"{final_rate:.2f}"
                        # Mark as interpolated
                        rate_table.at[label, zone] = f"{rate}*"
                    else:
                        # No data for this zone at all - use a reasonable default
                        # Base rate increases with zone and weight
                        base_rate = 3.50 + (zone * 0.50) + (min_wt * 0.25)
                        marked_up = base_rate * (1 + markup_pct/100)
                        min_allowed = base_rate + min_margin
                        final_rate = max(marked_up, min_allowed)
                        final_rate = round(final_rate * 20) / 20
                        rate = f"{final_rate:.2f}"
                        rate_table.at[label, zone] = f"{rate}**"
                    
                    empty_cells.append(f"Zone {zone}, {label}: No data, using default")
                else:
                    # We have data for this combination
                    cost = cell_data['final_rate'].mean()
                    # Apply markup
                    marked_up = cost * (1 + markup_pct/100)
                    # Enforce minimum margin
                    min_allowed = cost + min_margin
                    final_rate = max(marked_up, min_allowed)
                    # Round to nearest $0.05
                    final_rate = round(final_rate * 20) / 20
                    rate = f"{final_rate:.2f}"
                    rate_table.at[label, zone] = rate
        
        rate_table.index.name = "Billable Weight"
        
        # Add debug information
        if empty_cells:
            st.warning(f"**Rate Table Issue:** {len(empty_cells)} out of {total_cells} cells had no data and used defaults ({len(empty_cells)/total_cells*100:.1f}%).\n"
                      f"* = Interpolated from zone average\n"
                      f"** = Used reasonable default")
            
            # Show detailed analysis
            with st.expander("🔍 Click to see detailed data analysis"):
                st.write("### Data Distribution Analysis")
                
                # Zone analysis
                zone_counts = df['zone'].value_counts().sort_index()
                st.write(f"**Zones found:** {sorted(df['zone'].unique())}")
                st.write(f"**Zone distribution:**")
                zone_data = []
                for zone, count in zone_counts.items():
                    zone_data.append([f"Zone {zone}", count, f"{count/len(df)*100:.1f}%"])
                st.table(pd.DataFrame(zone_data, columns=["Zone", "Records", "Percentage"]))
                
                # Weight analysis
                st.write(f"**Weight range:** {df['billable_weight'].min():.3f} to {df['billable_weight'].max():.3f} lbs")
                
                # Check weight distribution in rate table ranges
                weight_ranges_with_data = []
                for i in range(1, 16):  # 1oz to 15oz
                    min_wt = i/16
                    max_wt = (i+1)/16
                    count = len(df[(df['billable_weight'] >= min_wt) & (df['billable_weight'] < max_wt)])
                    if count > 0:
                        weight_ranges_with_data.append([f"<= {i}oz", f"{min_wt:.3f}-{max_wt:.3f} lbs", count])
                
                for i in range(1, 151):  # 1lb to 150lb
                    min_wt = i
                    max_wt = i+1
                    count = len(df[(df['billable_weight'] >= min_wt) & (df['billable_weight'] < max_wt)])
                    if count > 0:
                        weight_ranges_with_data.append([f"<= {i}lb", f"{min_wt:.3f}-{max_wt:.3f} lbs", count])
                
                st.write(f"**Weight ranges with data:** {len(weight_ranges_with_data)} out of 165 total ranges")
                
                # Show top weight ranges
                if weight_ranges_with_data:
                    top_ranges = sorted(weight_ranges_with_data, key=lambda x: x[2], reverse=True)[:10]
                    st.write("**Top 10 weight ranges with data:**")
                    st.table(pd.DataFrame(top_ranges, columns=["Weight Tier", "Range (lbs)", "Records"]))
                
                # Data quality checks
                st.write("### Data Quality Issues")
                issues = []
                
                # Check for NaN zones
                nan_zones = df['zone'].isna().sum()
                if nan_zones > 0:
                    issues.append(f"❌ {nan_zones} records have NaN zones")
                
                # Check for invalid zones
                valid_zones = set(range(1, 10))  # Zones 1-9
                invalid_zones = set(df['zone'].dropna().unique()) - valid_zones
                if invalid_zones:
                    issues.append(f"❌ Invalid zones found: {invalid_zones}")
                
                # Check for extreme weights
                extreme_weights = df[df['billable_weight'] > 150]
                if len(extreme_weights) > 0:
                    issues.append(f"⚠️ {len(extreme_weights)} records have weights > 150 lbs")
                
                if issues:
                    for issue in issues:
                        st.write(issue)
                else:
                    st.write("✅ No obvious data quality issues found")
                
                st.write("### Recommendations")
                if len(empty_cells)/total_cells > 0.9:
                    st.error("🔴 **CRITICAL:** Over 90% of rate table cells are empty!")
                    st.write("This suggests:")
                    st.write("1. **Zone calculation issues** - Check if zones are being calculated correctly")
                    st.write("2. **Weight distribution problems** - Your data may not cover the expected weight ranges")
                    st.write("3. **Template issues** - The rate template may not have data for all zones")
                    st.write("4. **Data filtering** - Some records may be getting filtered out")
                
                if len(zone_counts) < 7:
                    st.warning(f"⚠️ Only {len(zone_counts)} zones found, expected 7+ zones for a complete rate table")
        
        return rate_table
        
    except Exception as e:
        st.error(f"Error generating rate table: {e}")
        return pd.DataFrame()

def main():
    # Sidebar for navigation and settings
    with st.sidebar:
        # Logo and header
        st.markdown("""
        <div class="sidebar-logo" style="margin-top:20px;">
            <img src="data:image/png;base64,{}"/>
            <span>IQ</span>
        </div>
        """.format(
            base64.b64encode(open(os.path.join(os.path.dirname(__file__), "static/labl_logo_large.png"), "rb").read()).decode()
        ), unsafe_allow_html=True)
        
        # Custom navigation menu
        st.markdown('<div class="nav-container">', unsafe_allow_html=True)
        
        nav_options = [
            "Basic Settings", 
            "Rate Settings", 
            "Surcharge Settings", 
            "Advanced Settings", 
            "Carrier Recommendations",
            "Debug Options"
        ]
        
        # Find all occurrences of experimental_rerun in the app and replace them
        st.experimental_rerun = st.rerun  # For backward compatibility
        
        # Primary navigation rerun
        for option in nav_options:
            active_class = "nav-active" if st.session_state.active_section == option else ""
            button_key = f"nav_{option}"
            
            # Create the button with proper functionality - removed help parameter
            if st.button(option, key=button_key, 
                        use_container_width=True):
                st.session_state.active_section = option
                st.rerun()
        
        st.markdown('</div>', unsafe_allow_html=True)
        
        # Header for criteria
        st.header("Quote Criteria")
        
        # Basic Settings
        if st.session_state.active_section == "Basic Settings":
            st.markdown('<div class="remove-panel-styling"><div class="settings-header">Basic Settings</div>', unsafe_allow_html=True)
            
            # Origin ZIP
            st.markdown("<div style='color:black; font-weight:600; margin-bottom:5px; padding:3px;'>Origin ZIP Code</div>", unsafe_allow_html=True)
            origin_zip = st.text_input(
                label="Origin ZIP",
                label_visibility="collapsed",
                value=st.session_state.criteria.get('origin_zip', '46307'),
                key="basic_origin_zip"
            )
            # Update session state immediately when value changes
            if origin_zip != st.session_state.criteria.get('origin_zip'):
                st.session_state.criteria['origin_zip'] = origin_zip
                save_settings_to_calculator()
            
            # Service Level
            st.markdown("<div style='color:black; font-weight:600; margin-bottom:5px; padding:3px;'>Default Service Level</div>", unsafe_allow_html=True)
            service_level = st.selectbox(
                label="Service Level",
                label_visibility="collapsed",
                options=['standard', 'expedited', 'priority', 'next_day'],
                format_func=lambda x: x.replace('_', ' ').title(),
                index=['standard', 'expedited', 'priority', 'next_day'].index(
                    st.session_state.criteria.get('service_level', 'standard')
                ),
                key="basic_service_level"
            )
            # Update session state immediately when value changes
            if service_level != st.session_state.criteria.get('service_level'):
                st.session_state.criteria['service_level'] = service_level
                save_settings_to_calculator()
            
            # Package Type
            st.markdown("<div style='color:black; font-weight:600; margin-bottom:5px; padding:3px;'>Default Package Type</div>", unsafe_allow_html=True)
            package_type = st.selectbox(
                label="Package Type",
                label_visibility="collapsed",
                options=['box', 'envelope', 'pak'],
                format_func=lambda x: x.title(),
                index=['box', 'envelope', 'pak'].index(
                    st.session_state.criteria.get('package_type', 'box')
                ),
                key="basic_package_type"
            )
            # Update session state immediately when value changes
            if package_type != st.session_state.criteria.get('package_type'):
                st.session_state.criteria['package_type'] = package_type
                save_settings_to_calculator()
            
            # Weight Unit
            st.markdown("<div style='color:black; font-weight:600; margin-bottom:5px; padding:3px;'>Weight Unit in Uploaded File</div>", unsafe_allow_html=True)
            weight_unit = st.selectbox(
                label="Weight Unit",
                label_visibility="collapsed",
                options=["", "Ounces (oz)", "Grams (g)"],
                format_func=lambda x: x if x else "(No conversion, already lbs)",
                index=["", "Ounces (oz)", "Grams (g)"].index(
                    st.session_state.criteria.get('weight_unit', "")
                ),
                key="basic_weight_unit"
            )
            # Update session state immediately when value changes
            if weight_unit != st.session_state.criteria.get('weight_unit'):
                st.session_state.criteria['weight_unit'] = weight_unit
                save_settings_to_calculator()
            
            # Add explanation for settings
            st.markdown("""
            <div style="background-color:#f0f7ff; border:1px solid #c5d5eb; padding:10px; border-radius:5px; margin-top:15px;">
            <p style="color:black; font-weight:500; margin:0;">Settings are automatically saved as you change them. Use the lock (🔒) to prevent values from being overridden by uploaded data.</p>
            </div>
            """, unsafe_allow_html=True)
            
            st.markdown('</div>', unsafe_allow_html=True)
        
        # Rate Settings
        if st.session_state.active_section == "Rate Settings":
            st.markdown('<div class="remove-panel-styling"><div class="settings-header">Rate Settings</div>', unsafe_allow_html=True)
                
            # Markup Percentage
            col1, col2 = st.columns([4, 1])
            with col1:
                # Add explicit label with markdown
                st.markdown("<div style='color:black; font-weight:600; margin-bottom:5px; padding:3px;'>Markup Percentage (%)</div>", unsafe_allow_html=True)
                markup = st.number_input(
                    label="Markup Percentage",
                    label_visibility="collapsed",
                    min_value=0.0,
                    max_value=50.0,
                    value=st.session_state.criteria.get('markup_percentage', 10.0),
                    step=0.5,
                    key="rate_markup_percentage"
                )
            with col2:
                # Replace toggle with a standard button that shows locked/unlocked state
                is_locked = st.session_state.criteria.get('locked_settings', {}).get('markup_percentage', False)
                button_text = "🔒" if is_locked else "🔓"
                button_help = "Unlock value" if is_locked else "Lock value"
                
                # Add spacing to align with input
                st.write("&nbsp;")
                if st.button(button_text, key='lock_markup', help=button_help):
                    # Toggle the lock state
                    if is_locked:
                        st.session_state.criteria['locked_settings']['markup_percentage'] = False
                    else:
                        if 'locked_settings' not in st.session_state.criteria:
                            st.session_state.criteria['locked_settings'] = {}
                        st.session_state.criteria['locked_settings']['markup_percentage'] = True
                    # Force refresh to update the UI
                    st.rerun()
            
            # Update session state immediately when value changes
            if markup != st.session_state.criteria.get('markup_percentage'):
                st.session_state.criteria['markup_percentage'] = markup
                save_settings_to_calculator()
                
            # Fuel Surcharge
            col1, col2 = st.columns([4, 1])
            with col1:
                # Add explicit label with markdown
                st.markdown("<div style='color:black; font-weight:600; margin-bottom:5px; padding:3px;'>Fuel Surcharge Percentage (%)</div>", unsafe_allow_html=True)
                fuel = st.number_input(
                    label="Fuel Surcharge",
                    label_visibility="collapsed",
                    min_value=0.0,
                    max_value=30.0,
                    value=st.session_state.criteria.get('fuel_surcharge_percentage', 16.0),
                    step=0.5,
                    key="rate_fuel_surcharge"
                )
            with col2:
                # Replace toggle with a standard button that shows locked/unlocked state
                is_locked = st.session_state.criteria.get('locked_settings', {}).get('fuel_surcharge_percentage', False)
                button_text = "🔒" if is_locked else "🔓"
                button_help = "Unlock value" if is_locked else "Lock value"
                
                # Add spacing to align with input
                st.write("&nbsp;")
                if st.button(button_text, key='lock_fuel', help=button_help):
                    # Toggle the lock state
                    if is_locked:
                        st.session_state.criteria['locked_settings']['fuel_surcharge_percentage'] = False
                    else:
                        if 'locked_settings' not in st.session_state.criteria:
                            st.session_state.criteria['locked_settings'] = {}
                        st.session_state.criteria['locked_settings']['fuel_surcharge_percentage'] = True
                    # Force refresh to update the UI
                    st.rerun()
            
            # Update session state immediately when value changes
            if fuel != st.session_state.criteria.get('fuel_surcharge_percentage'):
                st.session_state.criteria['fuel_surcharge_percentage'] = fuel
                save_settings_to_calculator()
                
            # Dimensional Weight Divisor
            col1, col2 = st.columns([4, 1])
            with col1:
                # Add explicit label with markdown
                st.markdown("<div style='color:black; font-weight:600; margin-bottom:5px; padding:3px;'>Dimensional Weight Divisor</div>", unsafe_allow_html=True)
                dim = st.number_input(
                    label="Dimensional Weight Divisor",
                    label_visibility="collapsed",
                    min_value=100,
                    max_value=200,
                    value=st.session_state.criteria.get('dim_divisor', 139),
                    key="rate_dim_divisor"
                )
            with col2:
                # Replace toggle with a standard button that shows locked/unlocked state
                is_locked = st.session_state.criteria.get('locked_settings', {}).get('dim_divisor', False)
                button_text = "🔒" if is_locked else "🔓"
                button_help = "Unlock value" if is_locked else "Lock value"
                
                # Add spacing to align with input
                st.write("&nbsp;")
                if st.button(button_text, key='lock_dim', help=button_help):
                    # Toggle the lock state
                    if is_locked:
                        st.session_state.criteria['locked_settings']['dim_divisor'] = False
                    else:
                        if 'locked_settings' not in st.session_state.criteria:
                            st.session_state.criteria['locked_settings'] = {}
                        st.session_state.criteria['locked_settings']['dim_divisor'] = True
                    # Force refresh to update the UI
                    st.rerun()
            
            # Update session state immediately when value changes
            if dim != st.session_state.criteria.get('dim_divisor'):
                st.session_state.criteria['dim_divisor'] = dim
                save_settings_to_calculator()
                
            # Add explanation for settings
            st.markdown("""
            <div style="background-color:#f0f7ff; border:1px solid #c5d5eb; padding:10px; border-radius:5px; margin-top:15px;">
            <p style="color:black; font-weight:500; margin:0;">Settings are automatically saved as you change them. Use the lock (🔒) to prevent values from being overridden by uploaded data.</p>
            </div>
            """, unsafe_allow_html=True)
            
            st.markdown('</div>', unsafe_allow_html=True)
        
        # Surcharge Settings
        if st.session_state.active_section == "Surcharge Settings":
            st.markdown('<div class="remove-panel-styling"><div class="settings-header">Surcharge Settings</div>', unsafe_allow_html=True)
            
            # DAS Surcharge
            col1, col2 = st.columns([4, 1])
            with col1:
                st.markdown("<div style='color:black; font-weight:600; margin-bottom:5px; padding:3px;'>Delivery Area Surcharge (DAS) ($)</div>", unsafe_allow_html=True)
                das = st.number_input(
                    label="DAS Surcharge",
                    label_visibility="collapsed",
                    min_value=0.0,
                    max_value=20.0,
                    value=st.session_state.criteria.get('das_surcharge', 1.98),
                    step=0.25,
                    key="surcharge_das"
                )
            with col2:
                # Replace toggle with a standard button that shows locked/unlocked state
                is_locked = st.session_state.criteria.get('locked_settings', {}).get('das_surcharge', False)
                button_text = "🔒" if is_locked else "🔓"
                button_help = "Unlock value" if is_locked else "Lock value"
                
                # Add spacing to align with input
                st.write("&nbsp;")
                if st.button(button_text, key='lock_das', help=button_help):
                    # Toggle the lock state
                    if is_locked:
                        st.session_state.criteria['locked_settings']['das_surcharge'] = False
                    else:
                        if 'locked_settings' not in st.session_state.criteria:
                            st.session_state.criteria['locked_settings'] = {}
                        st.session_state.criteria['locked_settings']['das_surcharge'] = True
                    # Force refresh to update the UI
                    st.rerun()
            
            # Update session state immediately when value changes
            if das != st.session_state.criteria.get('das_surcharge'):
                st.session_state.criteria['das_surcharge'] = das
                save_settings_to_calculator()
            
            # EDAS Surcharge
            col1, col2 = st.columns([4, 1])
            with col1:
                st.markdown("<div style='color:black; font-weight:600; margin-bottom:5px; padding:3px;'>Extended Delivery Area Surcharge (EDAS) ($)</div>", unsafe_allow_html=True)
                edas = st.number_input(
                    label="EDAS Surcharge",
                    label_visibility="collapsed",
                    min_value=0.0,
                    max_value=40.0,
                    value=st.session_state.criteria.get('edas_surcharge', 3.92),
                    step=0.25,
                    key="surcharge_edas"
                )
            with col2:
                # Replace toggle with a standard button that shows locked/unlocked state
                is_locked = st.session_state.criteria.get('locked_settings', {}).get('edas_surcharge', False)
                button_text = "🔒" if is_locked else "🔓"
                button_help = "Unlock value" if is_locked else "Lock value"
                
                # Add spacing to align with input
                st.write("&nbsp;")
                if st.button(button_text, key='lock_edas', help=button_help):
                    # Toggle the lock state
                    if is_locked:
                        st.session_state.criteria['locked_settings']['edas_surcharge'] = False
                    else:
                        if 'locked_settings' not in st.session_state.criteria:
                            st.session_state.criteria['locked_settings'] = {}
                        st.session_state.criteria['locked_settings']['edas_surcharge'] = True
                    # Force refresh to update the UI
                    st.rerun()
            
            # Update session state immediately when value changes
            if edas != st.session_state.criteria.get('edas_surcharge'):
                st.session_state.criteria['edas_surcharge'] = edas
                save_settings_to_calculator()
            
            # Remote Surcharge
            col1, col2 = st.columns([4, 1])
            with col1:
                st.markdown("<div style='color:black; font-weight:600; margin-bottom:5px; padding:3px;'>Remote Area Surcharge ($)</div>", unsafe_allow_html=True)
                remote = st.number_input(
                    label="Remote Surcharge",
                    label_visibility="collapsed",
                    min_value=0.0,
                    max_value=40.0,
                    value=st.session_state.criteria.get('remote_surcharge', 14.15),
                    step=0.25,
                    key="surcharge_remote"
                )
            with col2:
                # Replace toggle with a standard button that shows locked/unlocked state
                is_locked = st.session_state.criteria.get('locked_settings', {}).get('remote_surcharge', False)
                button_text = "🔒" if is_locked else "🔓"
                button_help = "Unlock value" if is_locked else "Lock value"
                
                # Add spacing to align with input
                st.write("&nbsp;")
                if st.button(button_text, key='lock_remote', help=button_help):
                    # Toggle the lock state
                    if is_locked:
                        st.session_state.criteria['locked_settings']['remote_surcharge'] = False
                    else:
                        if 'locked_settings' not in st.session_state.criteria:
                            st.session_state.criteria['locked_settings'] = {}
                        st.session_state.criteria['locked_settings']['remote_surcharge'] = True
                    # Force refresh to update the UI
                    st.rerun()
                
            # Update session state immediately when value changes
            if remote != st.session_state.criteria.get('remote_surcharge'):
                st.session_state.criteria['remote_surcharge'] = remote
                save_settings_to_calculator()
            
            # Add explanation for settings
            st.markdown("""
            <div style="background-color:#f0f7ff; border:1px solid #c5d5eb; padding:10px; border-radius:5px; margin-top:15px;">
            <p style="color:black; font-weight:500; margin:0;">Settings are automatically saved as you change them. Use the lock (🔒) to prevent values from being overridden by uploaded data.</p>
            </div>
            """, unsafe_allow_html=True)
            
            st.markdown('</div>', unsafe_allow_html=True)
        
        # Advanced Settings
        if st.session_state.active_section == "Advanced Settings":
            st.markdown('<div class="remove-panel-styling"><div class="settings-header">Advanced Settings</div>', unsafe_allow_html=True)
            
            with st.form("service_markups_form"):
                st.subheader("Service Level Markups")
                
                col1, col2 = st.columns(2)
                with col1:
                    # Add explicit label with markdown
                    st.markdown("<div style='color:black; font-weight:600; margin-bottom:5px; padding:3px;'>Standard (%)</div>", unsafe_allow_html=True)
                    standard_markup = st.number_input(
                        label="Standard",
                        label_visibility="collapsed",
                        min_value=0.0,
                        max_value=100.0,
                        value=st.session_state.criteria.get('standard_markup', 0.0),
                        step=1.0,
                        key="adv_standard_markup"
                    )
                with col2:
                    # Add explicit label with markdown
                    st.markdown("<div style='color:black; font-weight:600; margin-bottom:5px; padding:3px;'>Expedited (%)</div>", unsafe_allow_html=True)
                    expedited_markup = st.number_input(
                        label="Expedited",
                        label_visibility="collapsed",
                        min_value=0.0,
                        max_value=100.0,
                        value=st.session_state.criteria.get('expedited_markup', 10.0),
                        step=1.0,
                        key="adv_expedited_markup"
                    )
                    
                col1, col2 = st.columns(2)
                with col1:
                    # Add explicit label with markdown
                    st.markdown("<div style='color:black; font-weight:600; margin-bottom:5px; padding:3px;'>Priority (%)</div>", unsafe_allow_html=True)
                    priority_markup = st.number_input(
                        label="Priority",
                        label_visibility="collapsed",
                        min_value=0.0,
                        max_value=100.0,
                        value=st.session_state.criteria.get('priority_markup', 15.0),
                        step=1.0,
                        key="adv_priority_markup"
                    )
                with col2:
                    # Add explicit label with markdown
                    st.markdown("<div style='color:black; font-weight:600; margin-bottom:5px; padding:3px;'>Next Day (%)</div>", unsafe_allow_html=True)
                    next_day_markup = st.number_input(
                        label="Next Day",
                        label_visibility="collapsed",
                        min_value=0.0,
                        max_value=100.0,
                        value=st.session_state.criteria.get('next_day_markup', 25.0),
                        step=1.0,
                        key="adv_next_day_markup"
                    )
                    
                submit = st.form_submit_button("Apply Service Level Markups")
                if submit:
                    st.session_state.criteria['service_level_markups'] = {
                        'standard': standard_markup,
                        'expedited': expedited_markup,
                        'priority': priority_markup,
                        'next_day': next_day_markup
                    }
                    st.session_state.criteria['standard_markup'] = standard_markup
                    st.session_state.criteria['expedited_markup'] = expedited_markup
                    st.session_state.criteria['priority_markup'] = priority_markup
                    st.session_state.criteria['next_day_markup'] = next_day_markup
                    # Update calculator if initialized
                    save_settings_to_calculator()
                    st.success("Service level markups applied and saved!")
            
            # Additional Advanced Settings section
            st.subheader("Additional Advanced Settings")
            
            # Add explanation for settings in forms
            st.markdown("""
            <div style="background-color:#f0f7ff; border:1px solid #c5d5eb; padding:10px; border-radius:5px; margin-top:15px;">
            <p style="color:black; font-weight:500; margin:0;">Settings in the form above need to be applied with the button. All settings persist between navigation tabs.</p>
            </div>
            """, unsafe_allow_html=True)
            
            st.markdown('</div>', unsafe_allow_html=True)
        
        # Carrier Recommendations
        if st.session_state.active_section == "Carrier Recommendations":
            st.markdown('<div class="remove-panel-styling"><div class="settings-header">Carrier Recommendations</div>', unsafe_allow_html=True)
            
            st.markdown("""
            <div style="background-color:#fff3cd; border:1px solid #ffeaa7; padding:10px; border-radius:5px; margin-bottom:15px;">
            <p style="color:black; font-weight:500; margin:0;">💡 <strong>Smart Analysis:</strong> Shipments with EDAS or Remote surcharges are often better handled by other carriers. Use these settings to optimize your analysis.</p>
            </div>
            """, unsafe_allow_html=True)
            
            # Enable carrier recommendations
            enable_recommendations = st.checkbox(
                "Enable Smart Carrier Recommendations",
                value=st.session_state.criteria.get('enable_carrier_recommendations', True),
                help="Flag shipments that should be sent via alternative carriers"
            )
            
            # Update session state
            if enable_recommendations != st.session_state.criteria.get('enable_carrier_recommendations'):
                st.session_state.criteria['enable_carrier_recommendations'] = enable_recommendations
                save_settings_to_calculator()
            
            if enable_recommendations:
                # Analysis mode selection
                analysis_mode = st.selectbox(
                    "Analysis Mode",
                    options=['dual_analysis', 'filtered_analysis', 'flag_only'],
                    format_func=lambda x: {
                        'dual_analysis': 'Dual Analysis (Show both with/without EDAS/Remote)',
                        'filtered_analysis': 'Filtered Analysis (Exclude EDAS/Remote shipments)',
                        'flag_only': 'Flag Only (Show all shipments, mark recommendations)'
                    }[x],
                    index=['dual_analysis', 'filtered_analysis', 'flag_only'].index(
                        st.session_state.criteria.get('analysis_mode', 'dual_analysis')
                    ),
                    help="Choose how to handle EDAS and Remote shipments in the analysis"
                )
                
                # Update session state
                if analysis_mode != st.session_state.criteria.get('analysis_mode'):
                    st.session_state.criteria['analysis_mode'] = analysis_mode
                    save_settings_to_calculator()
                
                # Surcharge thresholds for recommendations
                st.subheader("Recommendation Thresholds")
                
                col1, col2 = st.columns(2)
                
                with col1:
                    edas_threshold = st.number_input(
                        "EDAS Threshold ($)",
                        min_value=0.0,
                        max_value=10.0,
                        value=st.session_state.criteria.get('edas_threshold', 3.92),
                        step=0.01,
                        help="Shipments with EDAS surcharge above this amount will be flagged"
                    )
                    
                    # Update session state
                    if edas_threshold != st.session_state.criteria.get('edas_threshold'):
                        st.session_state.criteria['edas_threshold'] = edas_threshold
                        save_settings_to_calculator()
                
                with col2:
                    remote_threshold = st.number_input(
                        "Remote Threshold ($)",
                        min_value=0.0,
                        max_value=20.0,
                        value=st.session_state.criteria.get('remote_threshold', 14.15),
                        step=0.01,
                        help="Shipments with Remote surcharge above this amount will be flagged"
                    )
                    
                    # Update session state
                    if remote_threshold != st.session_state.criteria.get('remote_threshold'):
                        st.session_state.criteria['remote_threshold'] = remote_threshold
                        save_settings_to_calculator()
                
                # Additional options
                st.subheader("Additional Options")
                
                show_excluded_summary = st.checkbox(
                    "Show Excluded Shipments Summary",
                    value=st.session_state.criteria.get('show_excluded_summary', True),
                    help="Display summary of shipments excluded from analysis due to EDAS or Remote surcharges"
                )
                
                # Update session state
                if show_excluded_summary != st.session_state.criteria.get('show_excluded_summary'):
                    st.session_state.criteria['show_excluded_summary'] = show_excluded_summary
                    save_settings_to_calculator()
                
                include_recommendations_in_export = st.checkbox(
                    "Include Recommendations in Export",
                    value=st.session_state.criteria.get('include_recommendations_in_export', True),
                    help="Add carrier recommendation column to exported data"
                )
                
                # Update session state
                if include_recommendations_in_export != st.session_state.criteria.get('include_recommendations_in_export'):
                    st.session_state.criteria['include_recommendations_in_export'] = include_recommendations_in_export
                    save_settings_to_calculator()
                
                # Explanation of modes
                st.markdown("""
                <div style="background-color:#f0f7ff; border:1px solid #c5d5eb; padding:10px; border-radius:5px; margin-top:15px;">
                <p style="color:black; font-weight:500; margin:0 0 10px 0;"><strong>Analysis Modes:</strong></p>
                <ul style="color:black; margin:0; padding-left:20px;">
                <li><strong>Dual Analysis:</strong> Shows savings both with and without EDAS/Remote shipments</li>
                <li><strong>Filtered Analysis:</strong> Excludes EDAS/Remote shipments to show "clean" savings</li>
                <li><strong>Flag Only:</strong> Shows all shipments but marks which ones should use alternative carriers</li>
                </ul>
                </div>
                """, unsafe_allow_html=True)
            
            st.markdown('</div>', unsafe_allow_html=True)
        
        # Debug Options
        if st.session_state.active_section == "Debug Options":
            st.markdown('<div class="remove-panel-styling"><div class="settings-header">Debug Options</div>', unsafe_allow_html=True)
            
            # Replace toggle with a button-based approach for better visibility
            is_debug_enabled = st.session_state.criteria.get('debug_mode', False)
            debug_button_text = "Disable Debug Mode" if is_debug_enabled else "Enable Debug Mode"
            debug_button_help = "Turn off detailed logging" if is_debug_enabled else "Turn on detailed logging for troubleshooting"
            
            if st.button(debug_button_text, help=debug_button_help, key="debug_mode_button"):
                # Toggle the debug mode
                st.session_state.criteria['debug_mode'] = not is_debug_enabled
                # Set appropriate logging level
                if not is_debug_enabled:  # Toggling from False to True
                    logging.getLogger('labl_iq.calc_engine').setLevel(logging.DEBUG)
                    st.info("Debug logging enabled")
                else:  # Toggling from True to False
                    logging.getLogger('labl_iq.calc_engine').setLevel(logging.INFO)
                # Save setting
                save_settings_to_calculator()
                # Force refresh to update the UI
                st.rerun()
            
            # Show current debug status
            if is_debug_enabled:
                st.info("Debug mode is currently enabled")
            else:
                st.info("Debug mode is currently disabled")
            
            # Display current settings for debugging
            if is_debug_enabled:
                st.subheader("Current Settings")
                st.json(st.session_state.criteria)
                
                st.subheader("Locked Settings")
                st.json(st.session_state.criteria.get('locked_settings', {}))
            
            # Add explanation for automatic saving
            st.markdown("""
            <div style="background-color:#f0f7ff; border:1px solid #c5d5eb; padding:10px; border-radius:5px; margin-top:15px;">
            <p style="color:black; font-weight:500; margin:0;">Debug settings are automatically saved as you change them.</p>
            </div>
            """, unsafe_allow_html=True)
            
            st.markdown('</div>', unsafe_allow_html=True)
    
    # Main content area
    # Navigation logic based on app_step
    app_step = st.session_state.get('app_step', 'upload')

    if app_step == 'upload':
        st.write("Upload your shipment data to begin")
        if 'uploaded_df' not in st.session_state:
            uploaded_file = st.file_uploader("Choose a CSV file", type="csv", key="persistent_file_uploader")
            if uploaded_file is not None:
                try:
                    df = pd.read_csv(uploaded_file)
                    st.session_state['uploaded_df'] = df
                    st.session_state['app_step'] = 'mapping'
                    st.experimental_rerun()
                except Exception as e:
                    st.error(f"Error reading file: {str(e)}")
                    st.stop()
        else:
            st.session_state['app_step'] = 'mapping'
            st.experimental_rerun()
        return

    if app_step == 'mapping':
        df = st.session_state['uploaded_df']
        try:
            st.subheader("Data Preview")
            st.dataframe(df.head())
            st.subheader("Map Your CSV Columns")
            st.write("Please map your CSV columns to the required fields below.")
            suggested_mapping = suggest_column_mapping(df)
            saved_mapping = load_saved_mapping()
            if saved_mapping:
                use_saved = st.checkbox("Use previously saved mapping", value=True)
                if use_saved:
                    suggested_mapping = saved_mapping
            col1, col2 = st.columns(2)
            mapping = {}
            with col1:
                st.markdown("### Required Fields")
                st.write("These fields are necessary for quote calculation")
                for field in REQUIRED_FIELDS:
                    mapping[field] = st.selectbox(
                        field.replace('_', ' ').title(),
                        options=df.columns,
                        index=list(df.columns).index(suggested_mapping.get(field, df.columns[0])) 
                        if field in suggested_mapping else 0
                    )
            with col2:
                st.markdown("### Optional Fields")
                st.write("These fields provide additional information")
                for field in OPTIONAL_FIELDS:
                    mapping[field] = st.selectbox(
                        field.replace('_', ' ').title(),
                        options=df.columns,
                        index=list(df.columns).index(suggested_mapping.get(field, df.columns[0]))
                        if field in suggested_mapping else 0
                    )
            save_mapping_checkbox = st.checkbox("Save this mapping for future use")
            if st.button("Process Data"):
                st.session_state['mapping'] = mapping
                st.session_state['save_mapping_checkbox'] = save_mapping_checkbox
                st.session_state['app_step'] = 'results'
                st.experimental_rerun()
        except Exception as e:
            st.error(f"Error in mapping step: {str(e)}")
        return

    if app_step == 'results':
        df = st.session_state['uploaded_df']
        mapping = st.session_state.get('mapping', {})
        save_mapping_checkbox = st.session_state.get('save_mapping_checkbox', False)
        try:
            with st.spinner("Processing data..."):
                try:
                    # Save mapping if requested
                    if save_mapping_checkbox:
                        save_mapping(mapping)
                    
                    if 'debug_mode' in locals() and debug_mode:
                        st.write("Starting data processing...")
                    
                    # Define summary columns for display and export
                    summary_columns = [
                        'shipment_id',
                        'destination_zip',
                        'weight',
                        'dim_weight',
                        'billable_weight',
                        'zone',
                        'service_level',
                        'base_rate',
                        'fuel_surcharge',
                        'das_surcharge',
                        'edas_surcharge',
                        'remote_surcharge',
                        'total_surcharges',
                        'markup_amount',
                        'final_rate',
                        'carrier_rate',
                        'savings',
                        'savings_percent'
                    ]
                    
                    # Create processed dataframe
                    processed_df = pd.DataFrame()
                    
                    # Copy mapped columns and ensure all column names are strings
                    for field, col in mapping.items():
                        processed_df[field] = df[col]
                    
                    # Ensure all column names are strings to prevent mixed type warnings
                    processed_df.columns = processed_df.columns.astype(str)
                    
                    # Also ensure the original DataFrame columns are strings
                    df.columns = df.columns.astype(str)
                    
                    # Ensure all DataFrames have string column names to prevent mixed type warnings
                    
                    # Apply to all DataFrames
                    df = ensure_string_columns(df)
                    processed_df = ensure_string_columns(processed_df)
                    
                    if 'debug_mode' in locals() and debug_mode:
                        st.write(f"Initial mapped data shape: {processed_df.shape}")
                        st.write(processed_df.head())
                    
                    # Convert weight to lbs if needed
                    weight_unit = st.session_state.criteria.get('weight_unit', "")
                    if weight_unit == "Ounces (oz)":
                        processed_df['weight'] = processed_df['weight'].astype(float) / 16.0
                    elif weight_unit == "Grams (g)":
                        processed_df['weight'] = processed_df['weight'].astype(float) / 453.592
                    
                    # Convert DataFrame to list of shipment dictionaries
                    shipments = []
                    for idx, row in processed_df.iterrows():
                        # Standardize service level
                        service_level = str(row.get('service_level', 'standard')).lower()
                        if 'ground' in service_level:
                            service_level = 'standard'
                        elif 'express' in service_level:
                            service_level = 'expedited'
                        elif 'priority' in service_level:
                            service_level = 'priority'
                        elif 'next day' in service_level or 'next-day' in service_level:
                            service_level = 'next_day'
                        else:
                            service_level = st.session_state.criteria.get('service_level', 'standard')
                        
                        try:
                            # Calculate dimensional weight
                            dim_weight = 0.0
                            try:
                                dim_weight = (float(row['length']) * float(row['width']) * float(row['height'])) / st.session_state.criteria.get('dim_divisor', 139.0)
                            except (ValueError, KeyError, TypeError):
                                dim_weight = float(row.get('weight', 0))
                            
                            # Store carrier rate as-is for reference
                            carrier_rate = float(row['carrier_rate'])
                            
                            # Determine billable weight (greater of actual weight and dimensional weight)
                            weight = float(row['weight'])
                            billable_weight = max(weight, dim_weight)
                            
                            shipment = {
                                'shipment_id': str(row.get('shipment_id', '')),
                                'origin_zip': st.session_state.criteria['origin_zip'],
                                'destination_zip': str(row['destination_zip']),
                                'weight': weight,
                                'billable_weight': billable_weight,
                                'dim_weight': dim_weight,
                                'length': float(row['length']),
                                'width': float(row['width']),
                                'height': float(row['height']),
                                'package_type': row.get('package_type', st.session_state.criteria.get('package_type', 'box')),
                                'service_level': service_level,
                                'carrier_rate': carrier_rate
                            }
                            shipments.append(shipment)
                        except Exception as e:
                            if 'debug_mode' in locals() and debug_mode:
                                st.error(f"Error processing row {idx}: {str(e)}")
                            st.write(row)
                    
                    if 'debug_mode' in locals() and debug_mode:
                        st.write(f"Converted {len(shipments)} shipments to dictionaries")
                        st.write("First shipment:", shipments[0] if shipments else "No shipments")
                    
                    if not shipments:
                        st.error("No valid shipments to process. Check your data and mapping.")
                        return
                    
                    # Initialize calculator if not already done
                    if st.session_state.calculator is None:
                        try:
                            # Build configuration from session state
                            config = {
                                'dim_divisor': st.session_state.criteria.get('dim_divisor', 139),
                                'min_billable_weight': st.session_state.criteria.get('min_billable_weight', 1.0),
                                'enable_das': st.session_state.criteria.get('enable_das', True),
                                'das_amount': st.session_state.criteria.get('das_amount', 1.98),
                                'edas_amount': st.session_state.criteria.get('edas_amount', 3.92),
                                'remote_amount': st.session_state.criteria.get('remote_amount', 14.15),
                                'fuel_surcharge_percentage': st.session_state.criteria.get('fuel_surcharge_percentage', 16.0),
                                'service_level_markups': {
                                    'standard': st.session_state.criteria.get('standard_markup', 10.0),
                                    'expedited': st.session_state.criteria.get('expedited_markup', 10.0),
                                    'priority': st.session_state.criteria.get('priority_markup', 10.0),
                                    'next_day': st.session_state.criteria.get('next_day_markup', 10.0)
                                }
                            }
                            
                            # Try to find the template file in various locations
                            template_path = "2025 Amazon Quote Tool Template.xlsx"
                            template_found = False
                            
                            # Define the absolute path to the current directory
                            current_dir = os.path.abspath(os.path.dirname(__file__))
                            
                            # Define possible paths to search for the template file
                            possible_paths = [
                                os.path.join(current_dir, "data", "templates", template_path),  # data/templates subdirectory
                                os.path.join(current_dir, "data", template_path),  # data subdirectory
                                os.path.join(current_dir, template_path),  # Same directory as this file
                                os.path.join(os.path.dirname(current_dir), "data", "templates", template_path),  # Parent data/templates directory
                                os.path.join(os.path.dirname(current_dir), "data", template_path),  # Parent data directory
                                os.path.join(os.path.dirname(current_dir), template_path),  # Parent directory
                                os.path.join("/mount/src/labl-iq-rate-analyzer/data/templates", template_path),  # Streamlit Cloud data/templates directory
                                os.path.join("/mount/src/labl-iq-rate-analyzer/data", template_path),  # Streamlit Cloud data directory
                                os.path.join("/mount/src/labl-iq-rate-analyzer", template_path),  # Streamlit Cloud root
                                os.path.join("/mount/src", template_path),  # Streamlit Cloud mount point
                                template_path  # Current directory
                            ]
                            
                            # Log the search paths for debugging
                            if st.session_state.criteria.get('debug_mode', False):
                                st.write("Searching for template file in:")
                                for path in possible_paths:
                                    st.write(f"- {path}")
                            
                            # Try each path
                            for path in possible_paths:
                                if os.path.isfile(path):
                                    template_path = path
                                    template_found = True
                                    if st.session_state.criteria.get('debug_mode', False):
                                        st.success(f"Template file found at: {template_path}")
                                    break
                            
                            if not template_found:
                                st.error(f"Template file not found. Searched in: {', '.join(possible_paths)}")
                                return
                                
                            st.session_state.calculator = AmazonRateCalculator(template_path)
                            
                            # Update the calculator with our configuration
                            st.session_state.calculator.update_criteria(config)
                            st.success("Rate calculator initialized successfully!")
                            
                        except Exception as e:
                            st.error(f"Error initializing rate calculator: {str(e)}")
                            st.exception(e)  # Show full stack trace
                            return
                    
                    # Update calculator criteria with current session state settings
                    if 'debug_mode' in locals() and debug_mode:
                        st.write("Updating calculator criteria...")
                    st.session_state.calculator.update_criteria(st.session_state.criteria)
                    
                    # Calculate rates using the calculator
                    if 'debug_mode' in locals() and debug_mode:
                        st.write("Calculating rates...")
                    results = st.session_state.calculator.calculate_rates(shipments)
                    
                    if 'debug_mode' in locals() and debug_mode:
                        st.write(f"Got {len(results)} results")
                        st.write("First result:", results[0] if results else "No results")
                    
                    # Convert results back to DataFrame
                    processed_df = pd.DataFrame(results)
                    
                    if 'debug_mode' in locals() and debug_mode:
                        st.write("Processed data shape:", processed_df.shape)
                        st.write(processed_df.head())
                    
                    # Store processed data in session state
                    st.session_state.processed_data = processed_df
                    
                    # Apply carrier recommendation logic
                    if st.session_state.criteria.get('enable_carrier_recommendations', True):
                        # Add carrier recommendation columns
                        processed_df['carrier_recommendation'] = 'Current Carrier'
                        processed_df['recommendation_reason'] = ''
                        
                        # Identify shipments that should use alternative carriers
                        edas_threshold = st.session_state.criteria.get('edas_threshold', 3.92)
                        remote_threshold = st.session_state.criteria.get('remote_threshold', 14.15)
                        
                        # Flag EDAS shipments
                        edas_mask = (processed_df['edas_surcharge'] > 0) & (processed_df['edas_surcharge'] >= edas_threshold)
                        processed_df.loc[edas_mask, 'carrier_recommendation'] = 'Alternative Carrier'
                        processed_df.loc[edas_mask, 'recommendation_reason'] = processed_df.loc[edas_mask, 'edas_surcharge'].apply(lambda x: f'EDAS surcharge: ${x:.2f}')
                        
                        # Flag Remote shipments
                        remote_mask = (processed_df['remote_surcharge'] > 0) & (processed_df['remote_surcharge'] >= remote_threshold)
                        processed_df.loc[remote_mask, 'carrier_recommendation'] = 'Alternative Carrier'
                        processed_df.loc[remote_mask, 'recommendation_reason'] = processed_df.loc[remote_mask, 'remote_surcharge'].apply(lambda x: f'Remote surcharge: ${x:.2f}')
                        
                        # Create filtered datasets based on analysis mode
                        analysis_mode = st.session_state.criteria.get('analysis_mode', 'dual_analysis')
                        
                        if analysis_mode == 'filtered_analysis':
                            # Exclude EDAS and Remote shipments
                            filtered_df = processed_df[
                                (processed_df['edas_surcharge'] == 0) & 
                                (processed_df['remote_surcharge'] == 0)
                            ].copy()
                            st.session_state.filtered_data = filtered_df
                            st.session_state.original_data = processed_df.copy()
                            
                        elif analysis_mode == 'dual_analysis':
                            # Keep both datasets
                            st.session_state.original_data = processed_df.copy()
                            filtered_df = processed_df[
                                (processed_df['edas_surcharge'] == 0) & 
                                (processed_df['remote_surcharge'] == 0)
                            ].copy()
                            st.session_state.filtered_data = filtered_df
                            
                        else:  # flag_only
                            # Keep all data, just flag recommendations
                            st.session_state.original_data = processed_df.copy()
                            st.session_state.filtered_data = processed_df.copy()
                    
                    # Show results
                    st.success("Data processed successfully!")
                    
                    # Display results tabs
                    tabs = st.tabs(["Executive Summary", "Rate Analysis", "Zone Analysis", "Surcharge Analysis", "Carrier Recommendations", "Detailed Breakdown", "Export"])
                    
                    with tabs[0]:
                        st.subheader("Executive Summary")
                        
                        # Carrier Recommendation Analysis (if enabled)
                        if st.session_state.criteria.get('enable_carrier_recommendations', True):
                            # Determine which dataset to use for analysis
                            analysis_mode = st.session_state.criteria.get('analysis_mode', 'dual_analysis')
                            
                            if analysis_mode == 'dual_analysis':
                                # Show both original and filtered analysis
                                st.markdown("### 📊 Dual Analysis Results")
                                
                                # Create two columns for comparison
                                comp_col1, comp_col2 = st.columns(2)
                                
                                with comp_col1:
                                    st.markdown("**📈 All Shipments (Including EDAS/Remote)**")
                                    original_df = st.session_state.get('original_data', processed_df)
                                    
                                    # Key metrics for original data
                                    total_shipments_orig = len(original_df)
                                    total_savings_orig = original_df['savings'].fillna(0).sum() if 'savings' in original_df else 0
                                    avg_savings_pct_orig = original_df['savings_percent'].mean() if 'savings_percent' in original_df else 0
                                    if pd.isna(avg_savings_pct_orig):
                                        avg_savings_pct_orig = 0
                                    
                                    st.metric("Total Shipments", total_shipments_orig)
                                    st.metric("Total Savings", format_currency(total_savings_orig))
                                    st.metric("Average Savings", format_percentage(avg_savings_pct_orig))
                                    
                                    # Carrier recommendation breakdown
                                    if 'carrier_recommendation' in original_df.columns:
                                        rec_dist = original_df['carrier_recommendation'].value_counts()
                                        st.markdown("**Carrier Recommendations:**")
                                        for carrier, count in rec_dist.items():
                                            pct = (count / total_shipments_orig) * 100
                                            st.write(f"• {carrier}: {count} ({pct:.1f}%)")
                                
                                with comp_col2:
                                    st.markdown("**🎯 Clean Shipments (Excluding EDAS/Remote)**")
                                    filtered_df = st.session_state.get('filtered_data', processed_df)
                                    
                                    # Key metrics for filtered data
                                    total_shipments_filt = len(filtered_df)
                                    total_savings_filt = filtered_df['savings'].fillna(0).sum() if 'savings' in filtered_df else 0
                                    avg_savings_pct_filt = filtered_df['savings_percent'].mean() if 'savings_percent' in filtered_df else 0
                                    if pd.isna(avg_savings_pct_filt):
                                        avg_savings_pct_filt = 0
                                    
                                    st.metric("Total Shipments", total_shipments_filt)
                                    st.metric("Total Savings", format_currency(total_savings_filt))
                                    st.metric("Average Savings", format_percentage(avg_savings_pct_filt))
                                    
                                    # Improvement metrics
                                    if total_shipments_orig > 0 and total_shipments_filt > 0:
                                        savings_improvement = ((total_savings_filt / total_shipments_filt) - (total_savings_orig / total_shipments_orig)) / (total_savings_orig / total_shipments_orig) * 100 if total_savings_orig > 0 else 0
                                        st.metric("Savings Improvement", f"{savings_improvement:+.1f}%")
                                
                                # Summary of excluded shipments
                                if st.session_state.criteria.get('show_excluded_summary', True):
                                    excluded_count = total_shipments_orig - total_shipments_filt
                                    if excluded_count > 0:
                                        st.markdown("---")
                                        st.markdown(f"**📋 Summary:** {excluded_count} shipments ({excluded_count/total_shipments_orig*100:.1f}%) were flagged for alternative carriers due to EDAS or Remote surcharges.")
                                
                                # Use filtered data for the rest of the analysis
                                analysis_df = filtered_df
                                
                            elif analysis_mode == 'filtered_analysis':
                                # Show only filtered analysis
                                st.markdown("### 🎯 Filtered Analysis Results")
                                st.info("Analysis excludes shipments with EDAS or Remote surcharges for optimal savings.")
                                
                                analysis_df = st.session_state.get('filtered_data', processed_df)
                                
                                # Show excluded summary
                                if st.session_state.criteria.get('show_excluded_summary', True):
                                    original_df = st.session_state.get('original_data', processed_df)
                                    excluded_count = len(original_df) - len(analysis_df)
                                    if excluded_count > 0:
                                        st.markdown(f"**📋 Excluded:** {excluded_count} shipments ({excluded_count/len(original_df)*100:.1f}%) were excluded due to EDAS or Remote surcharges.")
                                
                            else:  # flag_only
                                # Show all data with recommendations
                                st.markdown("### 🏷️ All Shipments with Recommendations")
                                st.info("All shipments are included. Alternative carrier recommendations are flagged.")
                                
                                analysis_df = processed_df
                                
                                # Show recommendation summary
                                if 'carrier_recommendation' in analysis_df.columns:
                                    rec_dist = analysis_df['carrier_recommendation'].value_counts()
                                    st.markdown("**Carrier Recommendations:**")
                                    for carrier, count in rec_dist.items():
                                        pct = (count / len(analysis_df)) * 100
                                        st.write(f"• {carrier}: {count} ({pct:.1f}%)")
                        else:
                            # Carrier recommendations disabled - use original data
                            analysis_df = processed_df
                        
                        # Key Metrics (using the appropriate dataset)
                        col1, col2, col3, col4 = st.columns(4)
                        
                        with col1:
                            st.metric(
                                "Total Shipments",
                                len(analysis_df),
                                help="Total number of shipments in analysis"
                            )
                        
                        with col2:
                            # Ensure 'savings' column exists and fill NaNs before summing
                            total_savings = analysis_df['savings'].fillna(0).sum() if 'savings' in analysis_df else 0
                            st.metric(
                                "Total Savings",
                                format_currency(total_savings),
                                help="Total cost savings across analyzed shipments"
                            )
                        
                        with col3:
                            # Ensure 'savings_percent' column exists and fill NaNs before averaging
                            avg_savings_pct = analysis_df['savings_percent'].mean() if 'savings_percent' in analysis_df else 0
                            if pd.isna(avg_savings_pct):
                                avg_savings_pct = 0
                            st.metric(
                                "Average Savings",
                                format_percentage(avg_savings_pct),
                                help="Average percentage savings across analyzed shipments"
                            )
                        
                        with col4:
                            projected_annual = total_savings * 52  # Assuming weekly volume
                            st.metric(
                                "Projected Annual Savings",
                                format_currency(projected_annual),
                                help="Projected annual savings based on current volume"
                            )
                    
                    # Service Level Breakdown
                    st.subheader("Service Level Analysis")
                    service_cols = st.columns(2)
                    
                    with service_cols[0]:
                        # Service level distribution
                        if 'service_level' in analysis_df.columns:
                            service_dist = analysis_df['service_level'].value_counts()
                            st.bar_chart(service_dist)
                            st.caption("Shipment Distribution by Service Level")
                    
                    with service_cols[1]:
                        # Average savings by service level
                        if 'service_level' in analysis_df.columns:
                            # Fix pandas FutureWarning: fill NaNs first, then group
                            if 'savings_percent' in analysis_df:
                                analysis_df_filled = analysis_df.copy()
                                analysis_df_filled['savings_percent'] = analysis_df_filled['savings_percent'].fillna(0)
                                service_savings_mean = analysis_df_filled.groupby('service_level', observed=False)['savings_percent'].mean()
                            else:
                                service_savings_mean = None
                            # Check if result is valid (not None, and if Series, not empty)
                            if service_savings_mean is not None and not (isinstance(service_savings_mean, pd.Series) and service_savings_mean.empty):
                                # Ensure input to st.bar_chart is DataFrame or Series
                                if not isinstance(service_savings_mean, (pd.Series, pd.DataFrame)):
                                    # Convert scalar to a simple Series/DataFrame for charting
                                    chart_data = pd.Series([float(service_savings_mean)], index=["Average"])
                                else:
                                    chart_data = service_savings_mean
                                st.bar_chart(chart_data)
                                st.caption("Average Savings % by Service Level")
                            else:
                                st.caption("Could not calculate average savings % by service level.")
                    
                    # Weight Analysis
                    st.subheader("Weight Analysis")
                    weight_cols = st.columns(2)
                    
                    with weight_cols[0]:
                        # Create weight brackets - use billable weight for analysis
                        if 'billable_weight' in analysis_df.columns:
                            analysis_df['weight_bracket'] = pd.cut(
                                analysis_df['billable_weight'],
                                bins=[0, 1, 5, 10, 20, 50, 100, float('inf')],
                                labels=['0-1 lbs', '1-5 lbs', '5-10 lbs', '10-20 lbs', '20-50 lbs', '50-100 lbs', '100+ lbs']
                            )
                        else:
                            # Fallback to actual weight if billable isn't available
                            analysis_df['weight_bracket'] = pd.cut(
                                analysis_df['weight'],
                                bins=[0, 1, 5, 10, 20, 50, 100, float('inf')],
                                labels=['0-1 lbs', '1-5 lbs', '5-10 lbs', '10-20 lbs', '20-50 lbs', '50-100 lbs', '100+ lbs']
                            )
                        weight_dist = analysis_df['weight_bracket'].value_counts()
                        st.bar_chart(weight_dist)
                        st.caption("Shipment Distribution by Weight Range")
                    
                    with weight_cols[1]:
                        # Fix pandas FutureWarning: fill NaNs first, then group
                        if 'savings_percent' in analysis_df:
                            analysis_df_filled_weight = analysis_df.copy()
                            analysis_df_filled_weight['savings_percent'] = analysis_df_filled_weight['savings_percent'].fillna(0)
                            weight_savings_mean = analysis_df_filled_weight.groupby('weight_bracket', observed=False)['savings_percent'].mean()
                        else:
                            weight_savings_mean = None
                        # Check if result is valid (not None, and if Series, not empty)
                        if weight_savings_mean is not None and not (isinstance(weight_savings_mean, pd.Series) and weight_savings_mean.empty):
                            # Ensure input to st.bar_chart is DataFrame or Series
                            if not isinstance(weight_savings_mean, (pd.Series, pd.DataFrame)):
                                # Convert scalar to a simple Series/DataFrame for charting
                                chart_data_weight = pd.Series([float(weight_savings_mean)], index=["Average"])
                            else:
                                chart_data_weight = weight_savings_mean
                            st.bar_chart(chart_data_weight)
                            st.caption("Average Savings % by Weight Range")
                        else:
                            st.caption("Could not calculate average savings % by weight range.")
                    
                    with tabs[1]:
                        st.subheader("Rate Analysis")
                        
                        # Rate comparison
                        rate_cols = st.columns(2)
                        
                        with rate_cols[0]:
                            rate_comparison = pd.DataFrame({
                                'Labl IQ Rate': processed_df['final_rate'],
                                'Carrier Rate': processed_df['carrier_rate']
                            })
                            st.line_chart(rate_comparison)
                            st.caption("Labl IQ Rate vs Carrier Rate Comparison")
                        
                        with rate_cols[1]:
                            # Calculate rate components
                            rate_components = pd.DataFrame({
                                'Base Rate': processed_df['base_rate'].mean(),
                                'Fuel Surcharge': processed_df['fuel_surcharge'].mean(),
                                'DAS': processed_df['das_surcharge'].mean(),
                                'EDAS': processed_df['edas_surcharge'].mean(),
                                'Remote': processed_df['remote_surcharge'].mean()
                            }, index=[0]).T
                            st.bar_chart(rate_components)
                            st.caption("Average Rate Components")
                    
                    with tabs[2]:
                        st.subheader("Zone Analysis")
                        
                        # Zone metrics table
                        if 'zone' in processed_df.columns:
                            # Define base aggregation dictionary
                            agg_dict = {
                                'shipment_id': 'count',
                                'final_rate': 'mean',
                                'carrier_rate': 'mean'
                                # Removed savings_percent - will add conditionally
                            }
                            
                            # Prepare DataFrame for aggregation, filling NaNs if columns exist
                            columns_ordered = ['Shipments', 'Avg Labl IQ Rate', 'Avg Carrier Rate']
                            processed_df_filled = processed_df.copy() # Start with a copy

                            if 'savings' in processed_df:
                                agg_dict['savings'] = 'sum' # Add savings aggregation
                                processed_df_filled['savings'] = processed_df_filled['savings'].fillna(0)
                                columns_ordered.append('Total Savings')
                                
                            if 'savings_percent' in processed_df:
                                agg_dict['savings_percent'] = 'mean' # Add savings percent aggregation
                                processed_df_filled['savings_percent'] = processed_df_filled['savings_percent'].fillna(0)
                                columns_ordered.append('Avg Savings %')

                            # Perform aggregation
                            if 'zone' in processed_df_filled.columns:
                                zone_metrics = processed_df_filled.groupby('zone', observed=False).agg(agg_dict).round(2)
                                
                                # Set and reorder columns
                                zone_metrics.columns = columns_ordered
                                zone_metrics = zone_metrics[columns_ordered] # Ensure order
                                
                                st.dataframe(zone_metrics)
                            else:
                                st.warning("Zone column not found or empty, cannot display zone metrics.")
                    
                    with tabs[3]:
                        st.subheader("Surcharge Analysis")
                        
                        # Check if required surcharge columns exist
                        surcharge_cols_needed = ['das_surcharge', 'edas_surcharge', 'remote_surcharge', 'fuel_surcharge']
                        missing_cols = [col for col in surcharge_cols_needed if col not in processed_df.columns]
                        
                        if missing_cols:
                            st.warning(f"Some surcharge columns are missing: {', '.join(missing_cols)}")
                            st.info("Surcharge analysis may be incomplete.")
                        
                        # Surcharge frequency
                        surcharge_cols = st.columns(2)
                        
                        with surcharge_cols[0]:
                            # Create dictionary with only available columns
                            freq_data = {}
                            if 'das_surcharge' in processed_df.columns:
                                freq_data['DAS'] = (processed_df['das_surcharge'] > 0).mean() * 100
                            if 'edas_surcharge' in processed_df.columns:
                                freq_data['EDAS'] = (processed_df['edas_surcharge'] > 0).mean() * 100
                            if 'remote_surcharge' in processed_df.columns:
                                freq_data['Remote'] = (processed_df['remote_surcharge'] > 0).mean() * 100
                            if 'fuel_surcharge' in processed_df.columns:
                                freq_data['Fuel'] = (processed_df['fuel_surcharge'] > 0).mean() * 100
                            
                            if freq_data:
                                surcharge_freq = pd.DataFrame(freq_data, index=[0]).T
                                st.bar_chart(surcharge_freq)
                                st.caption("Surcharge Application Frequency (%)")
                            else:
                                st.info("No surcharge data available for frequency analysis")
                        
                        with surcharge_cols[1]:
                            # Create dictionary with only available columns
                            impact_data = {}
                            if 'das_surcharge' in processed_df.columns:
                                impact_data['DAS'] = processed_df['das_surcharge'].sum()
                            if 'edas_surcharge' in processed_df.columns:
                                impact_data['EDAS'] = processed_df['edas_surcharge'].sum()
                            if 'remote_surcharge' in processed_df.columns:
                                impact_data['Remote'] = processed_df['remote_surcharge'].sum()
                            if 'fuel_surcharge' in processed_df.columns:
                                impact_data['Fuel'] = processed_df['fuel_surcharge'].sum()
                            
                            if impact_data:
                                surcharge_impact = pd.DataFrame(impact_data, index=[0]).T
                                st.bar_chart(surcharge_impact)
                                st.caption("Total Surcharge Impact ($)")
                            else:
                                st.info("No surcharge data available for impact analysis")
                        
                        # Surcharge summary table
                        if any(col in processed_df.columns for col in surcharge_cols_needed):
                            # Create dictionaries for each metric with only available columns
                            frequency_data = {}
                            total_amount_data = {}
                            avg_amount_data = {}
                            
                            for surcharge, display_name in zip(
                                ['das_surcharge', 'edas_surcharge', 'remote_surcharge', 'fuel_surcharge'],
                                ['DAS', 'EDAS', 'Remote', 'Fuel']
                            ):
                                if surcharge in processed_df.columns:
                                    frequency_data[display_name] = (processed_df[surcharge] > 0).mean() * 100
                                    total_amount_data[display_name] = processed_df[surcharge].sum()
                                    avg_amount_data[display_name] = processed_df[surcharge].mean()
                            
                            surcharge_summary = pd.DataFrame({
                                'Frequency': frequency_data,
                                'Total Amount': total_amount_data,
                                'Average Amount': avg_amount_data
                            })
                            
                            if not surcharge_summary.empty:
                                surcharge_summary['Frequency'] = surcharge_summary['Frequency'].apply(format_percentage)
                                surcharge_summary['Total Amount'] = surcharge_summary['Total Amount'].apply(format_currency)
                                surcharge_summary['Average Amount'] = surcharge_summary['Average Amount'].apply(format_currency)
                                
                                st.dataframe(surcharge_summary)
                            else:
                                st.info("No surcharge data available for summary table")
                        else:
                            st.info("No surcharge columns found in the data")
                    
                    with tabs[4]:
                        st.subheader("Carrier Recommendations")
                        
                        if st.session_state.criteria.get('enable_carrier_recommendations', True):
                            # Show carrier recommendation analysis
                            if 'carrier_recommendation' in processed_df.columns:
                                # Recommendation summary
                                rec_summary = processed_df['carrier_recommendation'].value_counts()
                                
                                col1, col2 = st.columns(2)
                                
                                with col1:
                                    st.markdown("**📊 Carrier Recommendation Distribution**")
                                    st.bar_chart(rec_summary)
                                    st.caption("Shipments by Recommended Carrier")
                                
                                with col2:
                                    st.markdown("**📈 Recommendation Impact**")
                                    
                                    # Calculate impact metrics
                                    current_carrier_savings = processed_df[
                                        processed_df['carrier_recommendation'] == 'Current Carrier'
                                    ]['savings'].fillna(0).sum()
                                    
                                    alternative_carrier_savings = processed_df[
                                        processed_df['carrier_recommendation'] == 'Alternative Carrier'
                                    ]['savings'].fillna(0).sum()
                                    
                                    st.metric("Current Carrier Savings", format_currency(current_carrier_savings))
                                    st.metric("Alternative Carrier Shipments", len(processed_df[processed_df['carrier_recommendation'] == 'Alternative Carrier']))
                                
                                # Detailed recommendation table
                                st.markdown("**📋 Detailed Recommendations**")
                                
                                # Filter for alternative carrier recommendations
                                alt_carrier_df = processed_df[
                                    processed_df['carrier_recommendation'] == 'Alternative Carrier'
                                ].copy()
                                
                                if not alt_carrier_df.empty:
                                    # Format the recommendation table
                                    display_cols = ['shipment_id', 'destination_zip', 'weight', 'service_level', 
                                                   'edas_surcharge', 'remote_surcharge', 'recommendation_reason', 'savings']
                                    
                                    # Only include columns that exist
                                    available_cols = [col for col in display_cols if col in alt_carrier_df.columns]
                                    rec_table = alt_carrier_df[available_cols].copy()
                                    
                                    # Format currency columns
                                    for col in ['edas_surcharge', 'remote_surcharge', 'savings']:
                                        if col in rec_table.columns:
                                            rec_table[col] = rec_table[col].apply(format_currency)
                                    
                                    st.dataframe(rec_table, use_container_width=True)
                                    
                                    # Summary statistics
                                    st.markdown("**📊 Alternative Carrier Summary**")
                                    summary_cols = st.columns(3)
                                    
                                    with summary_cols[0]:
                                        st.metric("Total Alternative Shipments", len(alt_carrier_df))
                                    
                                    with summary_cols[1]:
                                        avg_edas = alt_carrier_df['edas_surcharge'].mean() if 'edas_surcharge' in alt_carrier_df.columns else 0
                                        st.metric("Average EDAS Surcharge", format_currency(avg_edas))
                                    
                                    with summary_cols[2]:
                                        avg_remote = alt_carrier_df['remote_surcharge'].mean() if 'remote_surcharge' in alt_carrier_df.columns else 0
                                        st.metric("Average Remote Surcharge", format_currency(avg_remote))
                                
                                else:
                                    st.success("🎉 No shipments require alternative carriers! All shipments are optimized for your current carrier.")
                            
                            else:
                                st.info("Carrier recommendations not available. Please enable carrier recommendations in settings.")
                        
                        else:
                            st.info("Carrier recommendations are disabled. Enable them in the Carrier Recommendations settings to see this analysis.")
                        
                    with tabs[5]:
                        st.subheader("Detailed Breakdown")
                        
                        # Format the detailed dataframe
                        detailed_df = processed_df.copy()
                        
                        # Format currency columns
                        currency_columns = [
                            'base_rate', 
                            'fuel_surcharge', 
                            'das_surcharge',
                            'edas_surcharge',
                            'remote_surcharge',
                            'total_surcharges',
                            'final_rate', 
                            'carrier_rate', 
                            'savings'
                        ]
                        for col in currency_columns:
                            if col in detailed_df.columns:
                                detailed_df[col] = detailed_df[col].apply(format_currency)
                        
                        # Format weight columns
                        weight_columns = ['weight', 'billable_weight', 'dim_weight']
                        for col in weight_columns:
                            if col in detailed_df.columns:
                                detailed_df[col] = detailed_df[col].apply(format_weight)
                        
                        # Format percentage column
                        if 'savings_percent' in detailed_df.columns:
                            detailed_df['savings_percent'] = detailed_df['savings_percent'].apply(format_percentage)
                        
                        st.dataframe(detailed_df)
                    
                    with tabs[6]:
                        st.subheader("Export Options")
                        
                        export_cols = st.columns(3)
                        
                        with export_cols[0]:
                            # Full detailed export
                            export_df = processed_df.copy()
                            
                            # Include carrier recommendations if enabled
                            if st.session_state.criteria.get('enable_carrier_recommendations', True) and st.session_state.criteria.get('include_recommendations_in_export', True):
                                if 'carrier_recommendation' not in export_df.columns:
                                    # Add carrier recommendation columns if they don't exist
                                    export_df['carrier_recommendation'] = 'Current Carrier'
                                    export_df['recommendation_reason'] = ''
                            
                            csv = export_df.to_csv(index=False)
                            st.download_button(
                                "Download Full Report (CSV)",
                                csv,
                                "labl_iq_results.csv",
                                "text/csv",
                                key='download-csv'
                            )
                        
                        with export_cols[1]:
                            # Summary export
                            # Filter summary_columns to only include columns that exist in processed_df
                            available_summary_columns = [col for col in summary_columns if col in processed_df.columns]
                            
                            # Add carrier recommendation columns if enabled
                            if st.session_state.criteria.get('enable_carrier_recommendations', True) and st.session_state.criteria.get('include_recommendations_in_export', True):
                                if 'carrier_recommendation' in processed_df.columns:
                                    available_summary_columns.extend(['carrier_recommendation', 'recommendation_reason'])
                            
                            summary_df = processed_df[available_summary_columns]
                            csv_summary = summary_df.to_csv(index=False)
                            st.download_button(
                                "Download Summary (CSV)",
                                csv_summary,
                                "labl_iq_summary.csv",
                                "text/csv",
                                key='download-csv-summary'
                            )
                        
                        with export_cols[2]:
                            # Alternative carrier export (if recommendations enabled)
                            if st.session_state.criteria.get('enable_carrier_recommendations', True) and 'carrier_recommendation' in processed_df.columns:
                                alt_carrier_df = processed_df[
                                    processed_df['carrier_recommendation'] == 'Alternative Carrier'
                                ].copy()
                                
                                if not alt_carrier_df.empty:
                                    csv_alt_carrier = alt_carrier_df.to_csv(index=False)
                                    st.download_button(
                                        "Download Alternative Carrier Shipments (CSV)",
                                        csv_alt_carrier,
                                        "labl_iq_alternative_carrier_shipments.csv",
                                        "text/csv",
                                        key='download-csv-alt-carrier'
                                    )
                                else:
                                    st.info("No alternative carrier shipments to export")
                            else:
                                # Zone analysis export (fallback)
                                if 'zone' in processed_df.columns:
                                    # Ensure columns exist and fill NaNs before aggregating for export
                                    agg_dict_export = {
                                        'shipment_id': 'count',
                                        'final_rate': ['mean', 'sum'],
                                        'carrier_rate': ['mean', 'sum']
                                    }
                                    processed_df_filled_export = processed_df.copy()

                                    if 'savings' in processed_df:
                                        agg_dict_export['savings'] = ['mean', 'sum']
                                        processed_df_filled_export['savings'] = processed_df_filled_export['savings'].fillna(0)
                                    
                                    if 'savings_percent' in processed_df:
                                        agg_dict_export['savings_percent'] = 'mean'
                                        processed_df_filled_export['savings_percent'] = processed_df_filled_export['savings_percent'].fillna(0)

                                    zone_analysis = processed_df_filled_export.groupby('zone', observed=False).agg(agg_dict_export).round(2)
                                    
                                    csv_zone = zone_analysis.to_csv()
                                    st.download_button(
                                        "Download Zone Analysis (CSV)",
                                        csv_zone,
                                        "labl_iq_zone_analysis.csv",
                                        "text/csv",
                                        key='download-csv-zone'
                                    )
                        
                        # Additional export options
                        if st.session_state.criteria.get('enable_carrier_recommendations', True):
                            st.markdown("---")
                            st.markdown("**Additional Export Options**")
                            
                            additional_cols = st.columns(2)
                            
                            with additional_cols[0]:
                                # Filtered data export (clean shipments only)
                                if 'filtered_data' in st.session_state:
                                    filtered_csv = st.session_state.filtered_data.to_csv(index=False)
                                    st.download_button(
                                        "Download Clean Shipments Only (CSV)",
                                        filtered_csv,
                                        "labl_iq_clean_shipments.csv",
                                        "text/csv",
                                        key='download-csv-clean'
                                    )
                            
                            with additional_cols[1]:
                                # Current carrier shipments only
                                if 'carrier_recommendation' in processed_df.columns:
                                    current_carrier_df = processed_df[
                                        processed_df['carrier_recommendation'] == 'Current Carrier'
                                    ].copy()
                                    
                                    current_csv = current_carrier_df.to_csv(index=False)
                                    st.download_button(
                                        "Download Current Carrier Shipments (CSV)",
                                        current_csv,
                                        "labl_iq_current_carrier_shipments.csv",
                                        "text/csv",
                                        key='download-csv-current'
                                    )
                        
                        # Rate Table Export
                        st.markdown("---")
                        st.markdown("**📊 Rate Table Export**")
                        st.markdown("Generate a rate table based on your analysis data for use in customer pricing.")
                        
                        # Rate table configuration
                        rate_data_source = st.selectbox(
                            "Rate Table Data Source",
                            options=['all_shipments', 'clean_shipments', 'current_carrier_only'],
                            format_func=lambda x: {
                                'all_shipments': 'All Shipments',
                                'clean_shipments': 'Clean Shipments (No EDAS/Remote)',
                                'current_carrier_only': 'Current Carrier Only'
                            }[x],
                            help="Choose which shipments to use for calculating rates"
                        )
                        
                        # Generate rate table button
                        if st.button("Generate Rate Table Preview", key="generate_rate_table"):
                            with st.spinner("Generating rate table..."):
                                try:
                                    # Check if processed data exists
                                    if 'processed_data' not in st.session_state:
                                        st.error("No processed data available. Please process your shipment data first.")
                                        return
                                    
                                    processed_df = st.session_state.processed_data
                                    
                                    # Select the appropriate dataset based on data source
                                    if rate_data_source == 'all_shipments':
                                        rate_df = processed_df.copy()
                                    elif rate_data_source == 'clean_shipments':
                                        rate_df = st.session_state.get('filtered_data', processed_df).copy()
                                    else:  # current_carrier_only
                                        if 'carrier_recommendation' in processed_df.columns:
                                            rate_df = processed_df[
                                                processed_df['carrier_recommendation'] == 'Current Carrier'
                                            ].copy()
                                        else:
                                            rate_df = processed_df.copy()
                                    
                                    # Add debugging information
                                    st.write(f"**Debug Info:** Available columns: {list(rate_df.columns)}")
                                    st.write(f"**Debug Info:** Data source: {rate_data_source}")
                                    st.write(f"**Debug Info:** Dataset has {len(rate_df)} rows for rate table generation")
                                    
                                    # Ensure required columns exist for rate table generation
                                    required_columns = ['billable_weight', 'final_rate']
                                    missing_columns = [col for col in required_columns if col not in rate_df.columns]
                                    
                                    if missing_columns:
                                        st.warning(f"Missing required columns for rate table: {missing_columns}")
                                        st.write(f"**Debug Info:** Available columns: {list(rate_df.columns)}")
                                        
                                        # Try to create missing columns if possible
                                        if 'billable_weight' not in rate_df.columns and 'weight' in rate_df.columns:
                                            rate_df['billable_weight'] = rate_df['weight']
                                            st.info("Using 'weight' column as 'billable_weight'")
                                        
                                        if 'final_rate' not in rate_df.columns:
                                            # Try to calculate final rate from components
                                            if all(col in rate_df.columns for col in ['base_rate', 'total_surcharges', 'markup_amount']):
                                                rate_df['final_rate'] = rate_df['base_rate'] + rate_df['total_surcharges'] + rate_df['markup_amount']
                                                st.info("Calculated 'final_rate' from components")
                                            else:
                                                st.error("Cannot generate rate table without rate information")
                                                return
                                    
                                    # Ensure rate table DataFrame has string columns
                                    rate_df = ensure_string_columns(rate_df)
                                    
                                    # Generate rate table (simplified - no service level or package type filtering)
                                    rate_table = generate_rate_table(rate_df, 'standard', 'box')
                                    
                                    # Ensure the generated rate table also has string columns
                                    rate_table = ensure_string_columns(rate_table)
                                    
                                    # Store in session state for export
                                    st.session_state.rate_table = rate_table
                                    st.session_state.rate_table_config = {
                                        'data_source': rate_data_source,
                                        'service_level': 'standard',
                                        'package_type': 'box'
                                    }
                                    
                                    st.success("Rate table generated successfully!")
                                    
                                except Exception as e:
                                    st.error(f"Error generating rate table: {str(e)}")
                                    st.exception(e)  # Show full error details for debugging
                        
                        # Show rate table preview if available
                        if 'rate_table' in st.session_state:
                            st.markdown("**📋 Rate Table Preview**")
                            
                            # Show configuration
                            config = st.session_state.rate_table_config
                            st.info(f"**Configuration:** {config['data_source'].replace('_', ' ').title()} | {config['service_level'].replace('_', ' ').title()} | {config['package_type'].title()}")
                            
                            # Display rate table
                            rate_table = st.session_state.rate_table
                            st.dataframe(rate_table, use_container_width=True)
                            
                            # Export options for rate table
                            rate_export_cols = st.columns(2)
                            
                            with rate_export_cols[0]:
                                # CSV export
                                rate_csv = rate_table.to_csv(index=False)
                                st.download_button(
                                    "Download Rate Table (CSV)",
                                    rate_csv,
                                    f"labl_iq_rate_table_{config['service_level']}_{config['package_type']}.csv",
                                    "text/csv",
                                    key='download-rate-table-csv'
                                )
                            
                            with rate_export_cols[1]:
                                # Excel export (if available)
                                try:
                                    import io
                                    buffer = io.BytesIO()
                                    with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
                                        rate_table.to_excel(writer, sheet_name='Rate Table', index=False)
                                    buffer.seek(0)
                                    st.download_button(
                                        "Download Rate Table (Excel)",
                                        buffer.getvalue(),
                                        f"labl_iq_rate_table_{config['service_level']}_{config['package_type']}.xlsx",
                                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                        key='download-rate-table-excel'
                                    )
                                except ImportError:
                                    st.info("Excel export requires openpyxl package")
                            
                            # Rate table statistics
                            st.markdown("**📊 Rate Table Statistics**")
                            stats_cols = st.columns(4)
                            
                            with stats_cols[0]:
                                st.metric("Zones", len(rate_table.columns) - 1)  # Exclude weight column
                            
                            with stats_cols[1]:
                                st.metric("Weight Tiers", len(rate_table))
                            
                            with stats_cols[2]:
                                min_rate = rate_table.iloc[:, 1:].min().min()
                                st.metric("Min Rate", format_currency(min_rate))
                            
                            with stats_cols[3]:
                                max_rate = rate_table.iloc[:, 1:].max().max()
                                st.metric("Max Rate", format_currency(max_rate))
                
                except Exception as e:
                    st.error(f"Error processing data: {str(e)}")
            
            # After processing:
            st.session_state['app_step'] = 'export'
            # Don't rerun here - let the app naturally show the export step
        
        except Exception as e:
            st.error(f"Error reading file: {str(e)}")
        
        return

    if app_step == 'export':
        if st.button("Start Over", key="start_over"):
            for key in ['uploaded_df', 'processed_data', 'mapping', 'save_mapping_checkbox', 'filtered_data', 'original_data', 'rate_table', 'rate_table_config']:
                if key in st.session_state:
                    del st.session_state[key]
            st.session_state['app_step'] = 'upload'
            st.experimental_rerun()
        
        # --- BEGIN: Results and Export UI ---
        processed_df = st.session_state.get('processed_data')
        if processed_df is not None:
            # Display results tabs
            tabs = st.tabs(["Executive Summary", "Rate Analysis", "Zone Analysis", "Surcharge Analysis", "Carrier Recommendations", "Detailed Breakdown", "Export"])
            
            with tabs[0]:
                st.subheader("Executive Summary")
                
                # Carrier Recommendation Analysis (if enabled)
                if st.session_state.criteria.get('enable_carrier_recommendations', True):
                    # Determine which dataset to use for analysis
                    analysis_mode = st.session_state.criteria.get('analysis_mode', 'dual_analysis')
                    
                    if analysis_mode == 'dual_analysis':
                        # Show both original and filtered analysis
                        st.markdown("### 📊 Dual Analysis Results")
                        
                        # Create two columns for comparison
                        comp_col1, comp_col2 = st.columns(2)
                        
                        with comp_col1:
                            st.markdown("**📈 All Shipments (Including EDAS/Remote)**")
                            original_df = st.session_state.get('original_data', processed_df)
                            
                            # Key metrics for original data
                            total_shipments_orig = len(original_df)
                            total_savings_orig = original_df['savings'].fillna(0).sum() if 'savings' in original_df else 0
                            avg_savings_pct_orig = original_df['savings_percent'].mean() if 'savings_percent' in original_df else 0
                            if pd.isna(avg_savings_pct_orig):
                                avg_savings_pct_orig = 0
                            
                            st.metric("Total Shipments", total_shipments_orig)
                            st.metric("Total Savings", format_currency(total_savings_orig))
                            st.metric("Average Savings", format_percentage(avg_savings_pct_orig))
                            
                            # Carrier recommendation breakdown
                            if 'carrier_recommendation' in original_df.columns:
                                rec_dist = original_df['carrier_recommendation'].value_counts()
                                st.markdown("**Carrier Recommendations:**")
                                for carrier, count in rec_dist.items():
                                    pct = (count / total_shipments_orig) * 100
                                    st.write(f"• {carrier}: {count} ({pct:.1f}%)")
                        
                        with comp_col2:
                            st.markdown("**🎯 Clean Shipments (Excluding EDAS/Remote)**")
                            filtered_df = st.session_state.get('filtered_data', processed_df)
                            
                            # Key metrics for filtered data
                            total_shipments_filt = len(filtered_df)
                            total_savings_filt = filtered_df['savings'].fillna(0).sum() if 'savings' in filtered_df else 0
                            avg_savings_pct_filt = filtered_df['savings_percent'].mean() if 'savings_percent' in filtered_df else 0
                            if pd.isna(avg_savings_pct_filt):
                                avg_savings_pct_filt = 0
                            
                            st.metric("Total Shipments", total_shipments_filt)
                            st.metric("Total Savings", format_currency(total_savings_filt))
                            st.metric("Average Savings", format_percentage(avg_savings_pct_filt))
                            
                            # Improvement metrics
                            if total_shipments_orig > 0 and total_shipments_filt > 0:
                                savings_improvement = ((total_savings_filt / total_shipments_filt) - (total_savings_orig / total_shipments_orig)) / (total_savings_orig / total_shipments_orig) * 100 if total_savings_orig > 0 else 0
                                st.metric("Savings Improvement", f"{savings_improvement:+.1f}%")
                        
                        # Summary of excluded shipments
                        if st.session_state.criteria.get('show_excluded_summary', True):
                            excluded_count = total_shipments_orig - total_shipments_filt
                            if excluded_count > 0:
                                st.markdown("---")
                                st.markdown(f"**📋 Summary:** {excluded_count} shipments ({excluded_count/total_shipments_orig*100:.1f}%) were flagged for alternative carriers due to EDAS or Remote surcharges.")
                        
                        # Use filtered data for the rest of the analysis
                        analysis_df = filtered_df
                        
                    elif analysis_mode == 'filtered_analysis':
                        # Show only filtered analysis
                        st.markdown("### 🎯 Filtered Analysis Results")
                        st.info("Analysis excludes shipments with EDAS or Remote surcharges for optimal savings.")
                        
                        analysis_df = st.session_state.get('filtered_data', processed_df)
                        
                        # Show excluded summary
                        if st.session_state.criteria.get('show_excluded_summary', True):
                            original_df = st.session_state.get('original_data', processed_df)
                            excluded_count = len(original_df) - len(analysis_df)
                            if excluded_count > 0:
                                st.markdown(f"**📋 Excluded:** {excluded_count} shipments ({excluded_count/len(original_df)*100:.1f}%) were excluded due to EDAS or Remote surcharges.")
                        
                    else:  # flag_only
                        # Show all data with recommendations
                        st.markdown("### 🏷️ All Shipments with Recommendations")
                        st.info("All shipments are included. Alternative carrier recommendations are flagged.")
                        
                        analysis_df = processed_df
                        
                        # Key metrics
                        total_shipments = len(analysis_df)
                        total_savings = analysis_df['savings'].fillna(0).sum() if 'savings' in analysis_df else 0
                        avg_savings_pct = analysis_df['savings_percent'].mean() if 'savings_percent' in analysis_df else 0
                        if pd.isna(avg_savings_pct):
                            avg_savings_pct = 0
                        
                        st.metric("Total Shipments", total_shipments)
                        st.metric("Total Savings", format_currency(total_savings))
                        st.metric("Average Savings", format_percentage(avg_savings_pct))
                        
                        # Carrier recommendation breakdown
                        if 'carrier_recommendation' in analysis_df.columns:
                            rec_dist = analysis_df['carrier_recommendation'].value_counts()
                            st.markdown("**Carrier Recommendations:**")
                            for carrier, count in rec_dist.items():
                                pct = (count / total_shipments) * 100
                                st.write(f"• {carrier}: {count} ({pct:.1f}%)")
                else:
                    # No carrier recommendations - use all data
                    analysis_df = processed_df
                    
                    # Key metrics
                    total_shipments = len(analysis_df)
                    total_savings = analysis_df['savings'].fillna(0).sum() if 'savings' in analysis_df else 0
                    avg_savings_pct = analysis_df['savings_percent'].mean() if 'savings_percent' in analysis_df else 0
                    if pd.isna(avg_savings_pct):
                        avg_savings_pct = 0
                    
                    st.metric("Total Shipments", total_shipments)
                    st.metric("Total Savings", format_currency(total_savings))
                    st.metric("Average Savings", format_percentage(avg_savings_pct))
                
                # Additional summary metrics
                if 'analysis_df' in locals() and len(analysis_df) > 0:
                    # Weight distribution
                    if 'weight' in analysis_df.columns:
                        avg_weight = analysis_df['weight'].mean()
                        max_weight = analysis_df['weight'].max()
                        st.metric("Average Weight", format_weight(avg_weight))
                        st.metric("Max Weight", format_weight(max_weight))
                    
                    # Zone distribution
                    if 'zone' in analysis_df.columns:
                        zone_dist = analysis_df['zone'].value_counts().sort_index()
                        st.markdown("**Zone Distribution:**")
                        for zone, count in zone_dist.items():
                            pct = (count / len(analysis_df)) * 100
                            st.write(f"• Zone {zone}: {count} shipments ({pct:.1f}%)")
            
            # Add other tabs here (Rate Analysis, Zone Analysis, etc.)
            with tabs[1]:
                st.subheader("Rate Analysis")
                st.info("Rate analysis details will be shown here.")
            
            with tabs[2]:
                st.subheader("Zone Analysis")
                st.info("Zone analysis details will be shown here.")
            
            with tabs[3]:
                st.subheader("Surcharge Analysis")
                st.info("Surcharge analysis details will be shown here.")
            
            with tabs[4]:
                st.subheader("Carrier Recommendations")
                st.info("Carrier recommendations will be shown here.")
            
            with tabs[5]:
                st.subheader("Detailed Breakdown")
                st.info("Detailed breakdown will be shown here.")
            
            with tabs[6]:
                st.subheader("Export Options")
                
                # Determine which dataset to use for export
                analysis_mode = st.session_state.criteria.get('analysis_mode', 'dual_analysis')
                if analysis_mode == 'dual_analysis':
                    export_df = st.session_state.get('filtered_data', processed_df)
                elif analysis_mode == 'filtered_analysis':
                    export_df = st.session_state.get('filtered_data', processed_df)
                else:  # flag_only
                    export_df = processed_df
                
                if len(export_df) > 0:
                    # Export options
                    st.markdown("### Export Analysis Results")
                    
                    # CSV Export
                    csv = export_df.to_csv(index=False)
                    st.download_button(
                        "Download CSV",
                        csv,
                        "labl_iq_analysis_results.csv",
                        "text/csv",
                        key='download-csv'
                    )
                    
                    # Excel Export (if available)
                    try:
                        import io
                        buffer = io.BytesIO()
                        with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
                            export_df.to_excel(writer, sheet_name='Analysis Results', index=False)
                        buffer.seek(0)
                        st.download_button(
                            "Download Excel",
                            buffer.getvalue(),
                            "labl_iq_analysis_results.xlsx",
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            key='download-excel'
                        )
                    except ImportError:
                        st.info("Excel export requires openpyxl package")
                    
                    # Rate Table Export
                    st.markdown("---")
                    st.markdown("**📊 Rate Table Export**")
                    st.markdown("Generate a rate table based on your analysis data for use in customer pricing.")
                    
                    # Choose data source for rate table
                    rate_data_source = st.selectbox(
                        "Rate Table Data Source",
                        options=['all_shipments', 'clean_shipments', 'current_carrier_only'],
                        format_func=lambda x: {
                            'all_shipments': 'All Shipments',
                            'clean_shipments': 'Clean Shipments (No EDAS/Remote)',
                            'current_carrier_only': 'Current Carrier Only'
                        }[x],
                        help="Choose which shipments to use for calculating rates"
                    )
                    
                    # Rate table pricing controls
                    st.markdown("**💰 Rate Table Pricing**")
                    markup_col, min_margin_col = st.columns(2)
                    
                    with markup_col:
                        export_markup_pct = st.number_input(
                            "Markup Percentage (%)",
                            min_value=0.0, max_value=100.0, value=10.0, step=0.5,
                            help="Percent markup to apply to each cell in the rate table."
                        )
                    
                    with min_margin_col:
                        export_min_margin = st.number_input(
                            "Minimum Margin ($)",
                            min_value=0.0, max_value=100.0, value=0.50, step=0.05,
                            help="Minimum dollar profit per shipment."
                        )
                    
                    # Generate rate table button
                    if st.button("Generate Rate Table Preview", key="generate_rate_table"):
                        with st.spinner("Generating rate table..."):
                            try:
                                # Check if processed data exists
                                if 'processed_data' not in st.session_state:
                                    st.error("No processed data available. Please process your shipment data first.")
                                    return
                                
                                processed_df = st.session_state.processed_data
                                
                                # Select the appropriate dataset
                                if rate_data_source == 'all_shipments':
                                    rate_df = processed_df.copy()
                                elif rate_data_source == 'clean_shipments':
                                    rate_df = st.session_state.get('filtered_data', processed_df).copy()
                                else:  # current_carrier_only
                                    if 'carrier_recommendation' in processed_df.columns:
                                        rate_df = processed_df[
                                            processed_df['carrier_recommendation'] == 'Current Carrier'
                                        ].copy()
                                    else:
                                        rate_df = processed_df.copy()
                                
                                # Check if we have data after filtering
                                if len(rate_df) == 0:
                                    st.error(f"No data available for rate table generation. Try a different data source.")
                                    return
                                
                                # Ensure rate table DataFrame has string columns
                                rate_df = ensure_string_columns(rate_df)
                                
                                # Generate rate table with markup and minimum margin
                                rate_table = generate_rate_table(rate_df, markup_pct=export_markup_pct, min_margin=export_min_margin)
                                
                                # Ensure the generated rate table also has string columns
                                rate_table = ensure_string_columns(rate_table)
                                
                                # Store in session state for export
                                st.session_state.rate_table = rate_table
                                st.session_state.rate_table_config = {
                                    'data_source': rate_data_source
                                }
                                
                                st.success("Rate table generated successfully!")
                                
                            except Exception as e:
                                st.error(f"Error generating rate table: {str(e)}")
                                st.exception(e)  # Show full error details for debugging
                    
                    # Show rate table preview if available
                    if 'rate_table' in st.session_state:
                        st.markdown("**📋 Rate Table Preview**")
                        
                        # Show configuration
                        config = st.session_state.rate_table_config
                        st.info(f"**Configuration:** {config['data_source'].replace('_', ' ').title()}")
                        
                        # Display rate table
                        rate_table = st.session_state.rate_table
                        # Ensure rate table has string columns before display
                        rate_table = ensure_string_columns(rate_table)
                        st.dataframe(rate_table, use_container_width=True)
                        
                        # Export options for rate table
                        rate_export_cols = st.columns(2)
                        
                        with rate_export_cols[0]:
                            # CSV export
                            rate_csv = rate_table.to_csv(index=False)
                            st.download_button(
                                "Download Rate Table (CSV)",
                                rate_csv,
                                f"labl_iq_rate_table_{config['data_source']}.csv",
                                "text/csv",
                                key='download-rate-table-csv'
                            )
                        
                        with rate_export_cols[1]:
                            # Excel export (if available)
                            try:
                                import io
                                buffer = io.BytesIO()
                                with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
                                    rate_table.to_excel(writer, sheet_name='Rate Table', index=False)
                                buffer.seek(0)
                                st.download_button(
                                    "Download Rate Table (Excel)",
                                    buffer.getvalue(),
                                    f"labl_iq_rate_table_{config['data_source']}.xlsx",
                                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                    key='download-rate-table-excel'
                                )
                            except ImportError:
                                st.info("Excel export requires openpyxl package")
                        
                        # Rate table statistics
                        st.markdown("**📊 Rate Table Statistics**")
                        stats_cols = st.columns(4)
                        
                        with stats_cols[0]:
                            st.metric("Zones", len(rate_table.columns) - 1)  # Exclude weight column
                        
                        with stats_cols[1]:
                            st.metric("Weight Tiers", len(rate_table))
                        
                        with stats_cols[2]:
                            min_rate = rate_table.iloc[:, 1:].min().min()
                            st.metric("Min Rate", format_currency(min_rate))
                        
                        with stats_cols[3]:
                            max_rate = rate_table.iloc[:, 1:].max().max()
                            st.metric("Max Rate", format_currency(max_rate))
                else:
                    st.warning("No data available for export.")
        else:
            st.warning("No processed data found. Please start over and process your data.")
        # --- END: Results and Export UI ---
        return

# Add a function to persist settings
def save_settings_to_calculator():
    """Update the calculator with current settings from session state"""
    if st.session_state.calculator is not None:
        st.session_state.calculator.update_criteria(st.session_state.criteria)
        return True
    return False

if __name__ == "__main__":
    main() 
