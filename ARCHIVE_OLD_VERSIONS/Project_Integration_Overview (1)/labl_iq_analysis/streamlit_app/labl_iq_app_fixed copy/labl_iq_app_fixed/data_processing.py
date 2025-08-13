#!/usr/bin/env python3
"""
Labl IQ Rate Analyzer - Data Processing Module

This module handles the processing of shipment data from CSV files for the Labl IQ Rate Analyzer.
It provides functionality for:
1. Parsing and validating CSV files
2. Mapping columns from user's CSV to required fields
3. Cleaning and normalizing data (handling different formats, units, etc.)
4. Preparing the data structure for the calculation engine

Date: April 22, 2025
"""

import csv
import os
import json
import re
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple, Union, Set

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('labl_iq.data_processing')

# Define constants
REQUIRED_FIELDS = {
    'origin_zip': 'Origin ZIP Code',
    'destination_zip': 'Destination ZIP Code',
    'weight': 'Weight (lbs)',
    'length': 'Length (in)',
    'width': 'Width (in)',
    'height': 'Height (in)',
    'package_type': 'Package Type'
}

OPTIONAL_FIELDS = {
    'shipment_id': 'Shipment ID',
    'description': 'Description',
    'value': 'Declared Value ($)',
    'service_level': 'Service Level',
    'reference': 'Reference Number',
    'carrier_rate': 'Postage Cost'
}

VALID_PACKAGE_TYPES = ['box', 'envelope', 'pak', 'custom']
VALID_SERVICE_LEVELS = ['standard', 'expedited', 'priority', 'next_day']

# Default values for optional fields
DEFAULT_VALUES = {
    'package_type': 'box',
    'service_level': 'standard',
    'value': 0.0
}

class DataProcessingError(Exception):
    """Base exception for all data processing errors."""
    pass

class CSVValidationError(DataProcessingError):
    """Exception raised when CSV validation fails."""
    pass

class ColumnMappingError(DataProcessingError):
    """Exception raised when column mapping fails."""
    pass

class DataCleaningError(DataProcessingError):
    """Exception raised when data cleaning fails."""
    pass

class DataProcessor:
    """
    Main class for processing shipment data from CSV files.
    
    This class handles the entire data processing pipeline:
    1. CSV parsing and validation
    2. Column mapping
    3. Data cleaning and normalization
    4. Data preparation for the calculation engine
    """
    
    def __init__(self):
        """Initialize the DataProcessor."""
        self.column_mapping = {}
        self.raw_data = []
        self.processed_data = []
        self.validation_errors = []
        self.csv_headers = []
        self.cleaned_data = []
        
    def load_csv(self, file_path: str) -> bool:
        """
        Load and parse a CSV file.
        
        Args:
            file_path: Path to the CSV file
            
        Returns:
            bool: True if successful, False otherwise
            
        Raises:
            CSVValidationError: If the CSV file is invalid or cannot be read
        """
        try:
            if not os.path.exists(file_path):
                raise CSVValidationError(f"File not found: {file_path}")
                
            with open(file_path, 'r', newline='', encoding='utf-8-sig') as csvfile:
                # Try to detect the dialect
                try:
                    dialect = csv.Sniffer().sniff(csvfile.read(4096))
                    csvfile.seek(0)
                except:
                    dialect = 'excel'  # Default to Excel dialect if detection fails
                    csvfile.seek(0)
                
                reader = csv.DictReader(csvfile, dialect=dialect)
                
                # Validate that the CSV has headers
                if not reader.fieldnames:
                    raise CSVValidationError("CSV file has no headers")
                
                self.csv_headers = reader.fieldnames
                self.raw_data = list(reader)
                
                if not self.raw_data:
                    raise CSVValidationError("CSV file has no data rows")
                
                logger.info(f"Successfully loaded CSV with {len(self.raw_data)} rows and {len(self.csv_headers)} columns")
                return True
                
        except Exception as e:
            if not isinstance(e, CSVValidationError):
                raise CSVValidationError(f"Failed to load CSV: {str(e)}")
            raise
            
    def suggest_column_mapping(self) -> Dict[str, str]:
        """
        Suggest column mappings based on header names.
        
        Returns:
            Dict[str, str]: Suggested mapping of required fields to CSV columns
        """
        if not self.csv_headers:
            raise ColumnMappingError("No CSV headers available for mapping")
            
        suggested_mapping = {}
        
        # Combine required and optional fields for mapping suggestions
        all_fields = {**REQUIRED_FIELDS, **OPTIONAL_FIELDS}
        
        for field_key, field_name in all_fields.items():
            # Try to find exact matches first
            exact_matches = [header for header in self.csv_headers 
                            if header.lower() == field_name.lower() or 
                               header.lower() == field_key.lower()]
            
            if exact_matches:
                suggested_mapping[field_key] = exact_matches[0]
                continue
                
            # Try to find partial matches
            partial_matches = []
            for header in self.csv_headers:
                # Create normalized versions for matching
                header_norm = re.sub(r'[^a-zA-Z0-9]', '', header.lower())
                field_norm = re.sub(r'[^a-zA-Z0-9]', '', field_name.lower())
                field_key_norm = re.sub(r'[^a-zA-Z0-9]', '', field_key.lower())
                
                # Check if the normalized header contains the normalized field name or key
                if field_norm in header_norm or field_key_norm in header_norm:
                    partial_matches.append(header)
                    
                # Special case for dimensions
                if field_key in ['length', 'width', 'height']:
                    dimension_abbr = field_key[0].lower()  # l, w, h
                    if (f"dim{dimension_abbr}" in header_norm or 
                        f"{dimension_abbr}dim" in header_norm or
                        f"dimension{dimension_abbr}" in header_norm or
                        f"{dimension_abbr}dimension" in header_norm):
                        partial_matches.append(header)
                        
                # Special case for zip codes
                if field_key in ['origin_zip', 'destination_zip']:
                    prefix = 'origin' if field_key == 'origin_zip' else 'destination'
                    prefix_abbr = 'o' if field_key == 'origin_zip' else 'd'
                    
                    if (f"{prefix}zip" in header_norm or 
                        f"{prefix}postal" in header_norm or
                        f"{prefix_abbr}zip" in header_norm or
                        f"{prefix}code" in header_norm):
                        partial_matches.append(header)
            
            if partial_matches:
                suggested_mapping[field_key] = partial_matches[0]
                
        return suggested_mapping
    
    def set_column_mapping(self, mapping: Dict[str, str]) -> None:
        """
        Set the column mapping to use for processing.
        
        Args:
            mapping: Dictionary mapping required fields to CSV columns
            
        Raises:
            ColumnMappingError: If the mapping is invalid
        """
        # Validate that all required fields are mapped
        missing_fields = [field for field in REQUIRED_FIELDS.keys() 
                         if field not in mapping or not mapping[field]]
        
        if missing_fields:
            raise ColumnMappingError(
                f"Missing required field mappings: {', '.join(missing_fields)}"
            )
            
        # Validate that all mapped columns exist in the CSV
        invalid_columns = [col for col in mapping.values() 
                          if col and col not in self.csv_headers]
        
        if invalid_columns:
            raise ColumnMappingError(
                f"Mapped columns not found in CSV: {', '.join(invalid_columns)}"
            )
            
        self.column_mapping = mapping
        logger.info(f"Column mapping set: {mapping}")
        
    def clean_and_validate_data(self) -> List[Dict[str, Any]]:
        """
        Clean and validate the raw data based on the column mapping.
        
        Returns:
            List[Dict[str, Any]]: List of cleaned and validated data rows
            
        Raises:
            DataCleaningError: If data cleaning fails
        """
        if not self.raw_data:
            raise DataCleaningError("No data to clean")
            
        if not self.column_mapping:
            raise DataCleaningError("Column mapping not set")
            
        cleaned_data = []
        self.validation_errors = []
        
        for row_idx, row in enumerate(self.raw_data, start=2):  # Start at 2 to account for header row
            try:
                cleaned_row = self._clean_row(row, row_idx)
                cleaned_data.append(cleaned_row)
            except Exception as e:
                error_msg = f"Row {row_idx}: {str(e)}"
                self.validation_errors.append(error_msg)
                logger.warning(error_msg)
                
        if self.validation_errors:
            logger.warning(f"Found {len(self.validation_errors)} validation errors")
            
        logger.info(f"Cleaned {len(cleaned_data)} rows of data")
        self.cleaned_data = cleaned_data
        return cleaned_data
    
    def _clean_row(self, row: Dict[str, str], row_idx: int) -> Dict[str, Any]:
        """
        Clean and validate a single row of data.
        
        Args:
            row: Dictionary containing the row data
            row_idx: Index of the row (for error reporting)
            
        Returns:
            Dict[str, Any]: Cleaned row data
            
        Raises:
            DataCleaningError: If cleaning fails
        """
        cleaned_row = {}
        
        # Process required fields
        for field_key in REQUIRED_FIELDS:
            if field_key not in self.column_mapping:
                raise DataCleaningError(f"Missing mapping for required field: {field_key}")
                
            value = row.get(self.column_mapping[field_key], '')
            
            if not value:
                self.validation_errors.append(f"Row {row_idx + 1}: Missing required field {field_key}")
                continue
                
            try:
                if field_key in ['origin_zip', 'destination_zip']:
                    cleaned_row[field_key] = self._clean_zip_code(value, field_key, row_idx)
                elif field_key in ['weight', 'length', 'width', 'height', 'carrier_rate']:
                    cleaned_row[field_key] = self._clean_numeric(value, field_key, row_idx)
                elif field_key == 'package_type':
                    cleaned_row[field_key] = self._clean_package_type(value, row_idx)
                else:
                    cleaned_row[field_key] = value.strip()
            except Exception as e:
                self.validation_errors.append(f"Row {row_idx + 1}: Error cleaning {field_key}: {str(e)}")
                
        # Process optional fields
        for field_key in OPTIONAL_FIELDS:
            if field_key in self.column_mapping:
                value = row.get(self.column_mapping[field_key], '')
                
                if value:
                    try:
                        if field_key == 'service_level':
                            cleaned_row[field_key] = self._clean_service_level(value, row_idx)
                        elif field_key == 'value':
                            cleaned_row[field_key] = self._clean_numeric(value, field_key, row_idx)
                        else:
                            cleaned_row[field_key] = value.strip()
                    except Exception as e:
                        self.validation_errors.append(f"Row {row_idx + 1}: Error cleaning {field_key}: {str(e)}")
                else:
                    # Use default value if available
                    cleaned_row[field_key] = DEFAULT_VALUES.get(field_key, '')
                    
        return cleaned_row
    
    def _clean_zip_code(self, value: str, field_key: str, row_idx: int) -> str:
        """Clean and validate a ZIP code."""
        # Ensure value is a string
        value = str(value)
        
        # Remove any non-alphanumeric characters
        zip_code = re.sub(r'[^a-zA-Z0-9]', '', value)
        
        # For US ZIP codes, ensure it's 5 digits
        if len(zip_code) > 5:
            zip_code = zip_code[:5]  # Truncate to first 5 digits
        elif len(zip_code) < 5 and zip_code.isdigit():
            zip_code = zip_code.zfill(5)  # Pad with leading zeros
            
        if not zip_code:
            raise DataCleaningError(f"Invalid {field_key}: '{value}'")
            
        return zip_code
    
    def _clean_numeric(self, value: str, field_key: str, row_idx: int) -> float:
        """Clean and validate a numeric value."""
        # Remove any currency symbols and commas
        cleaned_value = re.sub(r'[$,]', '', value)
        
        # Handle different decimal separators
        if ',' in cleaned_value and '.' in cleaned_value:
            # If both comma and period exist, assume comma is thousands separator
            cleaned_value = cleaned_value.replace(',', '')
        elif ',' in cleaned_value and '.' not in cleaned_value:
            # If only comma exists, it might be a decimal separator
            cleaned_value = cleaned_value.replace(',', '.')
            
        try:
            numeric_value = float(cleaned_value)
            
            # Validate based on field type
            if field_key in ['weight', 'length', 'width', 'height'] and numeric_value <= 0:
                raise DataCleaningError(f"Invalid {field_key}: must be greater than 0")
                
            if field_key == 'value' and numeric_value < 0:
                raise DataCleaningError(f"Invalid {field_key}: cannot be negative")
                
            return numeric_value
        except ValueError:
            raise DataCleaningError(f"Invalid numeric value for {field_key}: '{value}'")
    
    def _clean_package_type(self, value: str, row_idx: int) -> str:
        """Clean and validate package type."""
        package_type = value.lower().strip()
        
        # Map common variations to standard values
        package_type_mapping = {
            'parcel': 'box',
            'carton': 'box',
            'env': 'envelope',
            'flat': 'envelope',
            'poly': 'pak',
            'polybag': 'pak',
            'bag': 'pak',
            'other': 'custom',
            'special': 'custom'
        }
        
        if package_type in package_type_mapping:
            package_type = package_type_mapping[package_type]
            
        if package_type not in VALID_PACKAGE_TYPES:
            logger.warning(f"Row {row_idx}: Unknown package type '{value}', defaulting to 'box'")
            package_type = 'box'
            
        return package_type
    
    def _clean_service_level(self, value: str, row_idx: int) -> str:
        """Clean and validate service level."""
        service_level = value.lower().strip()
        
        # Map common variations to standard values
        service_level_mapping = {
            'std': 'standard',
            'regular': 'standard',
            'ground': 'standard',
            'exp': 'expedited',
            'express': 'expedited',
            '2day': 'expedited',
            'prio': 'priority',
            'overnight': 'next_day',
            'next': 'next_day',
            '1day': 'next_day'
        }
        
        if service_level in service_level_mapping:
            service_level = service_level_mapping[service_level]
            
        if service_level not in VALID_SERVICE_LEVELS:
            logger.warning(f"Row {row_idx}: Unknown service level '{value}', defaulting to 'standard'")
            service_level = 'standard'
            
        return service_level
    
    def _calculate_dimensional_weight(self, length: float, width: float, height: float) -> float:
        """
        Calculate dimensional weight based on dimensions.
        
        Formula: (Length × Width × Height) ÷ 139 (for domestic shipments)
        """
        dim_weight = (length * width * height) / 139
        return round(dim_weight, 2)
    
    def prepare_data_for_calculation(self) -> List[Dict[str, Any]]:
        """
        Prepare the cleaned data for the calculation engine.
        
        Returns:
            List[Dict[str, Any]]: Data prepared for the calculation engine
        """
        if not hasattr(self, 'cleaned_data') or not self.cleaned_data:
            self.cleaned_data = self.clean_and_validate_data()
            
        self.processed_data = self.cleaned_data
        
        # Add any additional fields or transformations needed for the calculation engine
        for row in self.processed_data:
            # Add a timestamp for tracking
            row['processed_at'] = datetime.now().isoformat()
            
            # Calculate dimensional weight if not already present
            if 'dim_weight' not in row and all(k in row for k in ['length', 'width', 'height']):
                row['dim_weight'] = self._calculate_dimensional_weight(
                    row['length'], row['width'], row['height']
                )
                
            # Calculate billable weight if not already present
            if 'billable_weight' not in row and 'dim_weight' in row and 'weight' in row:
                row['billable_weight'] = max(row['weight'], row['dim_weight'])
            elif 'billable_weight' not in row and 'weight' in row:
                row['billable_weight'] = row['weight']
            
            # Ensure all required fields for calculation are present
            for field in ['billable_weight', 'package_type', 'service_level']:
                if field not in row:
                    if field in DEFAULT_VALUES:
                        row[field] = DEFAULT_VALUES[field]
                    else:
                        row[field] = None
        
        logger.info(f"Prepared {len(self.processed_data)} rows for calculation")
        return self.processed_data
    
    def get_validation_errors(self) -> List[str]:
        """
        Get the list of validation errors.
        
        Returns:
            List[str]: List of validation error messages
        """
        return self.validation_errors
    
    def export_to_json(self, file_path: str) -> None:
        """
        Export the processed data to a JSON file.
        
        Args:
            file_path: Path to the output JSON file
        """
        if not self.processed_data:
            self.prepare_data_for_calculation()
            
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(self.processed_data, f, indent=2)
            
        logger.info(f"Exported processed data to {file_path}")
    
    def get_summary_stats(self) -> Dict[str, Any]:
        """
        Get summary statistics of the processed data.
        
        Returns:
            Dict[str, Any]: Summary statistics
        """
        if not self.processed_data:
            self.prepare_data_for_calculation()
            
        stats = {
            'total_shipments': len(self.processed_data),
            'total_weight': sum(row['weight'] for row in self.processed_data),
            'total_billable_weight': sum(row['billable_weight'] for row in self.processed_data),
            'avg_weight': sum(row['weight'] for row in self.processed_data) / len(self.processed_data) if self.processed_data else 0,
            'avg_billable_weight': sum(row['billable_weight'] for row in self.processed_data) / len(self.processed_data) if self.processed_data else 0,
            'package_types': {},
            'service_levels': {},
            'origin_zips': set(),
            'destination_zips': set()
        }
        
        for row in self.processed_data:
            # Count package types
            package_type = row.get('package_type', 'unknown')
            stats['package_types'][package_type] = stats['package_types'].get(package_type, 0) + 1
            
            # Count service levels
            service_level = row.get('service_level', 'unknown')
            stats['service_levels'][service_level] = stats['service_levels'].get(service_level, 0) + 1
            
            # Collect unique ZIP codes
            if 'origin_zip' in row:
                stats['origin_zips'].add(row['origin_zip'])
            if 'destination_zip' in row:
                stats['destination_zips'].add(row['destination_zip'])
        
        # Convert sets to counts
        stats['unique_origin_zips'] = len(stats['origin_zips'])
        stats['unique_destination_zips'] = len(stats['destination_zips'])
        del stats['origin_zips']
        del stats['destination_zips']
        
        return stats


def process_csv_file(file_path: str, column_mapping: Optional[Dict[str, str]] = None) -> Tuple[List[Dict[str, Any]], List[str]]:
    """
    Process a CSV file and return the prepared data and any validation errors.
    
    Args:
        file_path: Path to the CSV file
        column_mapping: Optional column mapping to use
        
    Returns:
        Tuple[List[Dict[str, Any]], List[str]]: Prepared data and validation errors
    """
    processor = DataProcessor()
    
    try:
        # Load the CSV file
        processor.load_csv(file_path)
        
        # If no column mapping provided, suggest one
        if not column_mapping:
            column_mapping = processor.suggest_column_mapping()
            
        # Set the column mapping
        processor.set_column_mapping(column_mapping)
        
        # Clean and validate the data
        processor.cleaned_data = processor.clean_and_validate_data()
        
        # Prepare the data for calculation
        prepared_data = processor.prepare_data_for_calculation()
        
        return prepared_data, processor.get_validation_errors()
        
    except Exception as e:
        return [], [str(e)]


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python data_processing.py <csv_file_path>")
        sys.exit(1)
        
    csv_file_path = sys.argv[1]
    
    try:
        processor = DataProcessor()
        processor.load_csv(csv_file_path)
        
        print(f"\nCSV Headers: {processor.csv_headers}")
        
        # Suggest column mapping
        suggested_mapping = processor.suggest_column_mapping()
        print("\nSuggested Column Mapping:")
        for field, column in suggested_mapping.items():
            print(f"  {field} -> {column}")
            
        # For our sample file, we need to manually set the destination_zip mapping
        if 'Dest Zip' in processor.csv_headers:
            suggested_mapping['destination_zip'] = 'Dest Zip'
            print("  destination_zip -> Dest Zip (manually added)")
            
        # Set the column mapping
        processor.set_column_mapping(suggested_mapping)
        
        # Clean and validate the data
        processor.cleaned_data = processor.clean_and_validate_data()
        
        # Check for validation errors
        validation_errors = processor.get_validation_errors()
        if validation_errors:
            print("\nValidation Errors:")
            for error in validation_errors:
                print(f"  - {error}")
                
        # Prepare the data for calculation
        prepared_data = processor.prepare_data_for_calculation()
        
        # Print summary statistics
        stats = processor.get_summary_stats()
        print("\nSummary Statistics:")
        print(f"  Total Shipments: {stats['total_shipments']}")
        print(f"  Total Weight: {stats['total_weight']:.2f} lbs")
        print(f"  Total Billable Weight: {stats['total_billable_weight']:.2f} lbs")
        print(f"  Average Weight: {stats['avg_weight']:.2f} lbs")
        print(f"  Average Billable Weight: {stats['avg_billable_weight']:.2f} lbs")
        print(f"  Package Types: {stats['package_types']}")
        print(f"  Service Levels: {stats['service_levels']}")
        print(f"  Unique Origin ZIPs: {stats['unique_origin_zips']}")
        print(f"  Unique Destination ZIPs: {stats['unique_destination_zips']}")
        
        # Print the first 2 prepared data rows
        print("\nSample Prepared Data (first 2 rows):")
        for i, row in enumerate(prepared_data[:2]):
            print(f"\nRow {i+1}:")
            for key, value in row.items():
                print(f"  {key}: {value}")
                
        print(f"\nSuccessfully processed {len(prepared_data)} shipments")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)
