# Labl IQ Rate Analyzer

A powerful Streamlit application for analyzing and optimizing shipping rates. This tool helps businesses compare carrier rates with Labl IQ rates, calculate potential savings, and make data-driven shipping decisions.

## Features

- Upload and process CSV files with shipment data
- Configure rate settings and surcharges
- View detailed analysis of shipping rates and savings
- Export results in various formats
- Interactive visualizations and reports
- Support for multiple service levels and package types
- Automatic column mapping for uploaded data
- Settings persistence between sessions

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/labl-iq-rate-analyzer.git
cd labl-iq-rate-analyzer
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

1. Start the application:
```bash
streamlit run app.py
```

2. Open your web browser and navigate to http://localhost:8501

3. Upload your shipment data CSV file and follow the on-screen instructions to:
   - Map your CSV columns to required fields
   - Configure rate settings
   - View analysis and reports
   - Export results

## Required CSV Fields

The application requires the following fields in your CSV file:
- destination_zip
- weight
- length
- width
- height
- carrier_rate

Optional fields:
- shipment_id
- service_level
- package_type

## Configuration

The application allows you to configure:
- Origin ZIP code
- Markup percentages
- Fuel surcharge rates
- DAS/EDAS/Remote surcharges
- Service level markups
- Dimensional weight divisor

## Template File

The application requires the "2025 Amazon Quote Tool Template.xlsx" file to function. This file is not included in the repository due to its size and proprietary nature. You can obtain the template file in one of the following ways:

1. **Google Drive** (Recommended):
   - Download the template file from [Google Drive](https://docs.google.com/spreadsheets/d/1mIQRySVmyaO6TDyTvwPWEvXPPHVkJP_8/edit?usp=sharing&ouid=110063094521985982871&rtpof=true&sd=true)
   - Create a `data/templates` directory in the project root if it doesn't exist
   - Place the downloaded file in the `data/templates/` directory
   - Ensure the file is named exactly: `2025 Amazon Quote Tool Template.xlsx`

2. **Manual Setup**:
   - Create a `data/templates` directory in the project root
   - Place your template file in this directory
   - Ensure the file is named exactly: `2025 Amazon Quote Tool Template.xlsx`

The application will look for the template file in the following locations (in order):
1. `data/templates/2025 Amazon Quote Tool Template.xlsx`
2. `data/2025 Amazon Quote Tool Template.xlsx`
3. Current directory

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact support@labl.com 