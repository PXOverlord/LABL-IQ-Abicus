Summary of fixes made to the Labl IQ Rate Analyzer app:

1. Fixed logo display issue:
   - Changed from relative path to absolute path using os.path.join(os.path.dirname(__file__), "static/labl_logo.png")

2. Fixed template file path issue:
   - Copied the template file to the data directory
   - Prioritized the data directory in the search paths

3. Fixed criteria dropdowns functionality:
   - Added CSS styling for selectbox and dropdown elements
   - Ensured proper visibility and functionality of dropdown menus

All fixes maintain the Labl IQ branding and the reverted zone logic.
