#!/usr/bin/env python3
"""
Labl IQ Rate Analyzer - Calculation Engine Module

This module handles the rate calculations for the Labl IQ Rate Analyzer.
It provides functionality for:
1. Determining shipping zones based on origin and destination ZIP codes
2. Identifying applicable surcharges (like DAS) based on destination ZIP codes
3. Calculating base shipping rates based on weight, dimensions, and zone
4. Applying applicable surcharges (DAS, fuel, etc.)
5. Applying user-configured discounts and markups
6. Calculating margins compared to current rates

Date: April 22, 2025
"""

import os
import pandas as pd
import numpy as np
import logging
from typing import Dict, List, Any, Optional, Tuple, Union, Set
import bisect
from simple_zone_calculator import zone_calculator

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('labl_iq.calc_engine')

class CalculationError(Exception):
    """Base exception for all calculation errors."""
    pass

class ReferenceDataError(CalculationError):
    """Exception raised when reference data cannot be loaded or is invalid."""
    pass

class ZoneLookupError(CalculationError):
    """Exception raised when zone lookup fails."""
    pass

class RateCalculationError(CalculationError):
    """Exception raised when rate calculation fails."""
    pass

class AmazonRateCalculator:
    """
    Main class for calculating Amazon shipping rates.
    
    This class handles the entire rate calculation process:
    1. Loading reference data (zone matrix, DAS zips, rate tables)
    2. Determining shipping zones
    3. Calculating base rates
    4. Applying surcharges
    5. Applying discounts and markups
    6. Calculating margins
    """
    
    def __init__(self, template_file="2025 Amazon Quote Tool Template.xlsx"):
        """Initialize the calculator with a template file."""
        self.template_file = template_file
        self.criteria = {
            'dim_divisor': 139,
            'markup_percentage': 10.0,
            'fuel_surcharge_percentage': 16.0
        }
        self.template_data = self._load_template()
        
        self.zone_matrix = None
        self.das_zips = None
        self.das_zips_dict = {}
        self.edas_zips_dict = {}
        self.remote_zips_dict = {}
        self.rate_table = None
        self.criteria_values = {}
        
        # Toggle for simple zone calculator
        self.use_simple_zone_calculator = True  # Set to True to use new logic
        
        # Load reference data
        self.load_reference_data()
        
    def _load_template(self):
        # Implementation of _load_template method
        pass
    
    def load_reference_data(self) -> None:
        """
        Load reference data from the Excel template.
        
        This includes:
        - UPS Zone matrix for origin-destination ZIP code pairs
        - Amazon DAS ZIP codes for delivery area surcharges
        - Amazon Rates for base shipping rates
        - Criteria for discount/markup calculations and other parameters
        
        Raises:
            ReferenceDataError: If reference data cannot be loaded or is invalid
        """
        try:
            logger.info(f"Loading reference data from {self.template_file}")
            
            # Load UPS Zone matrix from fixed file if available
            zone_matrix_file = "data/zone_matrix_fixed.xlsx"
            if os.path.exists(zone_matrix_file):
                logger.info(f"Loading zone matrix from fixed file: {zone_matrix_file}")
                self.zone_matrix = pd.read_excel(
                    zone_matrix_file, 
                    sheet_name='UPS Zone matrix_April 2024'
                )
            else:
                logger.info(f"Fixed zone matrix file not found, loading from template: {self.template_file}")
                self.zone_matrix = pd.read_excel(
                    self.template_file, 
                    sheet_name='UPS Zone matrix_April 2024'
                )
            
            # Validate zone matrix structure
            if self.zone_matrix.shape[0] < 2 or self.zone_matrix.shape[1] < 2:
                raise ReferenceDataError("Zone matrix must have at least 2 rows and 2 columns")
            
            # Set the first column as index (origin ZIPs)
            self.zone_matrix.set_index('Unnamed: 0', inplace=True)
            
            # Convert all values to numeric, replacing non-numeric with NaN
            self.zone_matrix = self.zone_matrix.apply(pd.to_numeric, errors='coerce')
            
            # Validate that we have valid zones
            invalid_zones = self.zone_matrix.isna().sum().sum()
            if invalid_zones > 0:
                logger.warning(f"Found {invalid_zones} invalid zones in matrix")
            
            # Ensure index contains origin ZIPs and columns contain destination ZIPs
            if not all(str(x).isdigit() for x in self.zone_matrix.index):
                raise ReferenceDataError("First column must contain origin ZIP prefixes")
            
            if not all(str(x).isdigit() for x in self.zone_matrix.columns):
                raise ReferenceDataError("Column headers must contain destination ZIP prefixes")
            
            logger.info(f"Loaded UPS Zone matrix with shape {self.zone_matrix.shape}")
            
            # Load Amazon DAS ZIP codes
            self.das_zips = pd.read_excel(
                self.template_file,
                sheet_name='Amazon DAS Zips and Types'
            )
            
            # Clean up DAS zips data
            # Create separate dictionaries for each surcharge type
            self.das_zips_dict = {}
            self.edas_zips_dict = {}
            self.remote_zips_dict = {}
            
            # Log the structure of the DAS sheet for debugging
            logger.info(f"DAS sheet shape: {self.das_zips.shape}")
            logger.info(f"DAS sheet columns: {list(self.das_zips.columns)}")
            logger.info(f"First few rows of DAS sheet:")
            for i in range(min(5, len(self.das_zips))):
                logger.info(f"Row {i}: {list(self.das_zips.iloc[i])}")
            
            # Process ZIP codes by type
            for _, row in self.das_zips.iterrows():
                if pd.notna(row.iloc[0]):
                    zip_code = str(row.iloc[0]).strip()
                    
                    # Skip header rows
                    if zip_code == "Zipcode" or not zip_code.isdigit():
                        continue
                        
                    # Standardize ZIP code format (5 digits)
                    zip_code = zip_code.zfill(5)[:5]
                    
                    # Store by surcharge type - use more robust column detection
                    das_col = 1  # "Do DAS, EDAS or RAS apply?" column
                    edas_col = 2  # "EDAS" column
                    remote_col = 3  # "Remote Area in Continental US" column
                    
                    # Safely get values with error handling
                    try:
                        das_value = str(row.iloc[das_col]).strip() if pd.notna(row.iloc[das_col]) else ""
                        edas_value = str(row.iloc[edas_col]).strip() if pd.notna(row.iloc[edas_col]) else ""
                        remote_value = str(row.iloc[remote_col]).strip() if pd.notna(row.iloc[remote_col]) else ""
                        
                        self.das_zips_dict[zip_code] = das_value == "Yes"
                        self.edas_zips_dict[zip_code] = edas_value == "Yes"
                        self.remote_zips_dict[zip_code] = remote_value == "Yes"
                        
                        # Log any ZIP codes that have multiple surcharge types for debugging
                        surcharge_count = sum([
                            self.das_zips_dict[zip_code],
                            self.edas_zips_dict[zip_code], 
                            self.remote_zips_dict[zip_code]
                        ])
                        if surcharge_count > 1:
                            logger.warning(f"ZIP {zip_code} has multiple surcharge types: DAS={self.das_zips_dict[zip_code]}, EDAS={self.edas_zips_dict[zip_code]}, Remote={self.remote_zips_dict[zip_code]}")
                            
                    except Exception as e:
                        logger.error(f"Error processing ZIP {zip_code}: {str(e)}")
                        continue
            
            # Log summary statistics
            das_count = sum(self.das_zips_dict.values())
            edas_count = sum(self.edas_zips_dict.values())
            remote_count = sum(self.remote_zips_dict.values())
            
            logger.info(f"Loaded {len(self.das_zips_dict)} total ZIP codes")
            logger.info(f"  - DAS eligible: {das_count}")
            logger.info(f"  - EDAS eligible: {edas_count}")
            logger.info(f"  - Remote eligible: {remote_count}")
            
            # Check for overlaps
            das_zips = set(k for k, v in self.das_zips_dict.items() if v)
            edas_zips = set(k for k, v in self.edas_zips_dict.items() if v)
            remote_zips = set(k for k, v in self.remote_zips_dict.items() if v)
            
            das_edas_overlap = das_zips & edas_zips
            das_remote_overlap = das_zips & remote_zips
            edas_remote_overlap = edas_zips & remote_zips
            
            if das_edas_overlap:
                logger.warning(f"Found {len(das_edas_overlap)} ZIPs with both DAS and EDAS: {list(das_edas_overlap)[:10]}")
            if das_remote_overlap:
                logger.warning(f"Found {len(das_remote_overlap)} ZIPs with both DAS and Remote: {list(das_remote_overlap)[:10]}")
            if edas_remote_overlap:
                logger.warning(f"Found {len(edas_remote_overlap)} ZIPs with both EDAS and Remote: {list(edas_remote_overlap)[:10]}")
            
            # Load Amazon Rates
            self.rate_table = pd.read_excel(
                self.template_file,
                sheet_name='Amazon Rates',
                skiprows=2  # Skip the first two rows
            )
            
            # Rename columns
            self.rate_table.columns = ['Cntr', 'Rate Type', 'lbs', '1', '2', '3', '4', '5', '6', '7', '8']
            
            # Clean up rate table
            # Convert weight breaks to numeric
            self.rate_table['lbs'] = pd.to_numeric(self.rate_table['lbs'], errors='coerce')
            
            # Convert rate columns to numeric
            for col in self.rate_table.columns:
                if col not in ['Cntr', 'Rate Type', 'lbs']:
                    self.rate_table[col] = pd.to_numeric(self.rate_table[col], errors='coerce')
            
            logger.info(f"Loaded Amazon Rates with {len(self.rate_table)} weight breaks")
            
            # Load Criteria
            self.criteria = pd.read_excel(
                self.template_file,
                sheet_name='Criteria',
                header=None
            )
            
            # Extract key criteria values
            self.extract_criteria_values()
            
            # Add default service level markups if not loaded from file
            if 'service_level_markups' not in self.criteria_values:
                self.criteria_values['service_level_markups'] = {
                    'standard': 0.0,
                    'expedited': 0.0,
                    'priority': 0.0,
                    'next_day': 0.0
                }

            logger.info("Successfully loaded all reference data")
            
        except Exception as e:
            logger.error(f"Failed to load reference data: {str(e)}")
            raise ReferenceDataError(f"Failed to load reference data: {str(e)}")
    
    def extract_criteria_values(self) -> None:
        """
        Extract key values from the Criteria sheet.
        
        This includes:
        - Client origin ZIP
        - Fuel surcharges
        - DAS/EDAS surcharges
        - Discount/markup percentages
        - Dimensional weight divisor
        """
        try:
            # Initialize criteria dictionary
            self.criteria_values = {}
            
            # Extract values by exact match on first column
            for idx, row in self.criteria.iterrows():
                if pd.isna(row[0]):
                    continue
                    
                key = str(row[0]).strip()
                if key == "Client Origin Zip":
                    self.criteria_values['origin_zip'] = str(row[1]).strip()
                elif key == "Fuel Surcharge":
                    self.criteria_values['fuel_surcharge'] = float(row[1])
                elif key == "DAS Surcharge":
                    self.criteria_values['das_surcharge'] = float(row[1])
                elif key == "EDAS Surcharge":
                    self.criteria_values['edas_surcharge'] = float(row[1])
                elif key == "Remote Area Surcharge":
                    self.criteria_values['remote_surcharge'] = float(row[1])
                elif key == "Dimensional Weight Divisor":
                    self.criteria_values['dim_divisor'] = float(row[1])
            
            # Set default values for any missing criteria
            if 'origin_zip' not in self.criteria_values:
                self.criteria_values['origin_zip'] = None
            if 'fuel_surcharge' not in self.criteria_values:
                self.criteria_values['fuel_surcharge'] = 0.0
            if 'fuel_surcharge_percentage' not in self.criteria_values:
                self.criteria_values['fuel_surcharge_percentage'] = 16.0
            if 'das_surcharge' not in self.criteria_values:
                self.criteria_values['das_surcharge'] = 1.98
            if 'edas_surcharge' not in self.criteria_values:
                self.criteria_values['edas_surcharge'] = 3.92
            if 'remote_surcharge' not in self.criteria_values:
                self.criteria_values['remote_surcharge'] = 14.15
            if 'dim_divisor' not in self.criteria_values:
                self.criteria_values['dim_divisor'] = 139.0
            
            # Set default values for discount/markup
            self.criteria_values['discount_percent'] = 0.0
            self.criteria_values['markup_percentage'] = 10.0
            
            # Ensure no negative values
            for key in ['fuel_surcharge', 'das_surcharge', 'edas_surcharge', 'remote_surcharge']:
                if self.criteria_values[key] < 0:
                    logger.warning(f"{key} cannot be negative, setting to 0")
                    self.criteria_values[key] = 0.0
            
            if self.criteria_values['dim_divisor'] <= 0:
                logger.warning("Dimensional weight divisor must be positive, using default value of 139.0")
                self.criteria_values['dim_divisor'] = 139.0
            
            logger.info(f"Extracted criteria values: {self.criteria_values}")
            
        except Exception as e:
            logger.error(f"Failed to extract criteria values: {str(e)}")
            # Set default values if extraction fails
            self.criteria_values = {
                'origin_zip': None,
                'fuel_surcharge': 0.0,
                'fuel_surcharge_percentage': 16.0,
                'das_surcharge': 1.98,
                'edas_surcharge': 3.92,
                'remote_surcharge': 14.15,
                'dim_divisor': 139.0,
                'discount_percent': 0.0,
                'markup_percentage': 10.0
            }
    
    def standardize_zip(self, zip_code: str) -> str:
        """
        Standardize ZIP code format to 3-digit prefix.
        
        Args:
            zip_code: ZIP code to standardize
            
        Returns:
            str: Standardized 3-digit ZIP prefix or "INT" for international
            
        Raises:
            ValueError: If ZIP code is invalid
        """
        if not zip_code:
            raise ValueError("ZIP code cannot be empty")
        
        # Ensure input is a string
        zip_code = str(zip_code)
        
        # Clean the input by removing any whitespace and hyphens
        zip_code = zip_code.strip().replace(' ', '').replace('-', '')
        
        # Canadian postal codes (e.g., E3G7P6) or other international formats
        if any(c.isalpha() for c in zip_code):
            logger.debug(f"International/Canadian postal code detected: {zip_code}")
            return "INT"
        
        # Extract digits for any alphanumeric codes
        zip_digits = ''.join(filter(str.isdigit, zip_code))
        
        # Validate the digits
        if not zip_digits:
            logger.debug(f"No digits found in ZIP code: {zip_code}")
            return "INT"
        
        # Get the first 3 digits (or pad with zeros if needed)
        if len(zip_digits) < 3:
            zip_digits = zip_digits.zfill(3)
        
        # Return the 3-digit prefix as a string
        return zip_digits[:3]

    def validate_zone_matrix(self) -> None:
        """
        Validate the zone matrix structure and content.
        
        Raises:
            ReferenceDataError: If zone matrix is invalid
        """
        if self.zone_matrix is None or self.zone_matrix.empty:
            raise ReferenceDataError("Zone matrix is empty or not loaded")
        
        if self.zone_matrix.shape[0] < 2 or self.zone_matrix.shape[1] < 2:
            raise ReferenceDataError("Zone matrix must have at least 2 rows and 2 columns")
        
        # Convert all values to numeric, replacing non-numeric with NaN
        self.zone_matrix = self.zone_matrix.apply(pd.to_numeric, errors='coerce')
        
        # Check for invalid zones
        invalid_zones = self.zone_matrix.isna().sum().sum()
        total_cells = self.zone_matrix.size
        valid_cells = total_cells - invalid_zones
        invalid_pct = invalid_zones / total_cells * 100
        valid_pct = valid_cells / total_cells * 100
        
        if invalid_zones > 0:
            if invalid_zones > total_cells * 0.1:  # If > 10% are invalid
                logger.warning(f"Found {invalid_zones} invalid zones ({invalid_pct:.1f}%) in matrix of size {total_cells}")
                logger.warning("This is normal for sparse zone matrices where not all ZIP prefix combinations have defined zones")
            else:
                logger.info(f"Found {invalid_zones} invalid zones ({invalid_pct:.1f}%) in matrix")
            
            logger.info(f"Valid zones: {valid_cells} ({valid_pct:.1f}%)")

    def get_zone(self, origin_zip: str, dest_zip: str) -> int:
        """
        Get the shipping zone for a given origin-destination ZIP code pair.
        
        Uses the simple, reliable zone calculator if enabled, otherwise falls back to the old Excel matrix logic.
        """
        if self.use_simple_zone_calculator:
            try:
                zone = zone_calculator.get_zone(origin_zip, dest_zip)
                logger.info(f"[SIMPLE] Zone for {origin_zip} to {dest_zip}: {zone} ({zone_calculator.get_zone_description(zone)})")
                return zone
            except Exception as e:
                logger.error(f"[SIMPLE] Error getting zone for {origin_zip} to {dest_zip}: {str(e)}")
                return 8
        else:
            try:
                origin_zip_str = str(origin_zip)
                dest_zip_str = str(dest_zip)
                if any(c.isalpha() for c in dest_zip_str):
                    logger.info(f"Skipping international destination: {dest_zip_str}")
                    return 8
                origin_prefix = self.standardize_zip(origin_zip_str)
                dest_prefix = self.standardize_zip(dest_zip_str)
                if origin_prefix == "INT" or dest_prefix == "INT":
                    logger.info(f"International destination detected: origin={origin_zip_str}, dest={dest_zip_str}")
                    return 8
                origin_idx = None
                dest_idx = None
                origin_prefix_str = str(origin_prefix)
                if origin_prefix in self.zone_matrix.index:
                    origin_idx = origin_prefix
                else:
                    if self.criteria_values.get('origin_zip'):
                        client_origin = str(self.criteria_values['origin_zip'])
                        client_origin_prefix = self.standardize_zip(client_origin)
                        client_origin_prefix_str = str(client_origin_prefix)
                        if client_origin_prefix in self.zone_matrix.index:
                            origin_idx = client_origin_prefix
                        else:
                            for zip_prefix in self.zone_matrix.index:
                                zip_prefix_str = str(zip_prefix)
                                if (len(origin_prefix_str) >= 2 and len(zip_prefix_str) >= 2 and zip_prefix_str.startswith(origin_prefix_str)):
                                    logger.info(f"Using similar origin ZIP prefix {zip_prefix} instead of {origin_prefix}")
                                    origin_idx = zip_prefix
                                    break
                            if origin_idx is None and len(self.zone_matrix.index) > 0:
                                origin_idx = self.zone_matrix.index[0]
                                logger.info(f"Using default origin ZIP prefix {origin_idx} for {origin_prefix}")
                dest_prefix_str = str(dest_prefix)
                if dest_prefix in self.zone_matrix.columns:
                    dest_idx = dest_prefix
                else:
                    for zip_prefix in self.zone_matrix.columns:
                        zip_prefix_str = str(zip_prefix)
                        if (len(dest_prefix_str) >= 2 and len(zip_prefix_str) >= 2 and zip_prefix_str.startswith(dest_prefix_str)):
                            logger.info(f"Using similar destination ZIP prefix {zip_prefix} instead of {dest_prefix}")
                            dest_idx = zip_prefix
                            break
                    if dest_idx is None:
                        logger.info(f"Destination ZIP prefix {dest_prefix} not found, defaulting to zone 8")
                        return 8
                if origin_idx is None:
                    logger.info(f"Origin ZIP prefix {origin_prefix} not found in zone matrix, using default")
                    if len(self.zone_matrix.index) > 0:
                        origin_idx = self.zone_matrix.index[0]
                    else:
                        raise ZoneLookupError(f"No origin ZIPs found in zone matrix")
                if dest_idx is None:
                    logger.info(f"Destination ZIP prefix {dest_prefix} not found, defaulting to zone 8")
                    return 8
                zone = self.zone_matrix.loc[origin_idx, dest_idx]
                if pd.isna(zone) or zone <= 0:
                    logger.info(f"Invalid zone {zone} for {origin_zip} to {dest_zip}, defaulting to zone 8")
                    return 8
                return int(zone)
            except ValueError as e:
                logger.warning(f"Invalid ZIP code format: {str(e)}, defaulting to zone 8")
                return 8
            except Exception as e:
                logger.error(f"Zone lookup issue: {str(e)}, defaulting to zone 8")
                return 8
    
    def is_das_zip(self, zip_code: str) -> bool:
        """
        Check if a ZIP code is subject to delivery area surcharges.
        
        Args:
            zip_code: ZIP code to check
            
        Returns:
            bool: True if the ZIP code is subject to DAS, False otherwise
        """
        # Check for Canadian postal codes or other non-US formats
        if any(c.isalpha() for c in str(zip_code)):
            # Consider all Canadian postal codes to be DAS (rural areas)
            return True
        
        # Extract digits for alphanumeric codes
        zip_code = ''.join(filter(str.isdigit, str(zip_code)))
        if not zip_code:
            # Completely non-numeric codes (international)
            return True
        
        # Standardize ZIP code format (5 digits)
        zip_code = zip_code.zfill(5)[:5]
        
        # Check if the ZIP code is in the DAS dictionary
        return self.das_zips_dict.get(zip_code, False)
    
    def get_base_rate(self, weight: float, zone: int, package_type: str = 'box') -> float:
        """
        Get the base shipping rate based on weight, zone, and package type.
        
        Args:
            weight: Weight in pounds
            zone: Shipping zone
            package_type: Type of package ('box', 'envelope', 'pak', 'custom')
            
        Returns:
            float: Base shipping rate
            
        Raises:
            RateCalculationError: If rate calculation fails
        """
        try:
            # Map zone 1 to zone 2 for rate table lookup
            if zone == 1:
                zone = 2
            # Ensure package_type is a string
            if package_type is None:
                package_type = 'box'
                
            # Handle case where package_type might be a number/float
            if isinstance(package_type, (int, float)):
                logger.warning(f"Invalid package_type: {package_type} (numeric type), using 'box' instead")
                package_type_str = 'box'
            else:
                try:
                    package_type_str = str(package_type).lower().strip()
                except (AttributeError, TypeError):
                    # Handle case where package_type is not string-convertible
                    logger.warning(f"Invalid package_type: {package_type}, using 'box' instead")
                    package_type_str = 'box'
            
            # Convert zone to string for column lookup
            zone_col = str(zone)
            
            # Filter rate table by package type
            if package_type_str == 'envelope':
                rate_rows = self.rate_table[self.rate_table['Cntr'] == 'Letters']
            else:
                rate_rows = self.rate_table[self.rate_table['Cntr'] == 'Pkg']
            
            if rate_rows.empty:
                raise RateCalculationError(f"No rates found for package type {package_type_str}")
            
            # Check if zone column exists
            if zone_col not in rate_rows.columns:
                raise RateCalculationError(f"Zone {zone} not found in rate table")
            
            # Get weight breaks
            weight_breaks = rate_rows['lbs'].tolist()
            
            # Find the appropriate weight break
            idx = bisect.bisect_right(weight_breaks, weight)
            if idx == 0:
                # Weight is less than the smallest weight break
                idx = 1
            elif idx > len(weight_breaks) - 1:
                # Weight is greater than the largest weight break
                idx = len(weight_breaks) - 1
            
            # Get the rate for the weight break and zone
            rate = rate_rows.iloc[idx-1][zone_col]
            
            # Validate the rate
            if pd.isna(rate) or rate <= 0:
                raise RateCalculationError(f"Invalid rate for weight {weight}, zone {zone}, package type {package_type_str}")
            
            return float(rate)
            
        except AttributeError as e:
            # Handle specific attribute errors (likely "lower" method on float)
            error_msg = f"Package type error: {str(e)}"
            logger.error(error_msg)
            raise RateCalculationError(error_msg)
        except Exception as e:
            if not isinstance(e, RateCalculationError):
                logger.error(f"Rate calculation failed: {str(e)}")
                raise RateCalculationError(f"Rate calculation failed: {str(e)}")
            raise
    
    def apply_discounts_and_markups(self, base_rate: float, surcharges: Dict[str, float],
                               service_level: str) -> Dict[str, float]:
        """
        Apply service-level markups to the rate (base + all surcharges).
        Note: Markups are applied based on service level.

        Args:
            base_rate: The base shipping rate.
            surcharges: Dictionary of calculated surcharges.
            service_level: The service level for the shipment.

        Returns:
            Dictionary containing the final rate and markup percentage used.
        """
        try:
            # Calculate rate including all surcharges
            rate_with_surcharges = base_rate + surcharges.get('total_surcharges', 0.0)
            
            # More detailed logging for debugging
            logger.info(f"Checking for markup - Current criteria values: {self.criteria_values}")
            
            # IMPORTANT: Check for general markup percentage first, then fall back to service-specific
            default_markup_key = 'markup_percentage'
            markup_key = f"{service_level}_markup"
            
            if default_markup_key in self.criteria_values and self.criteria_values[default_markup_key] is not None:
                markup_pct = float(self.criteria_values[default_markup_key])
                logger.info(f"Using default markup percentage: {markup_pct}%")
            elif markup_key in self.criteria_values and self.criteria_values[markup_key] is not None:
                markup_pct = float(self.criteria_values[markup_key])
                logger.info(f"Using service-specific markup for {service_level}: {markup_pct}%")
            else:
                markup_pct = 0.0
                logger.warning(f"No markup found for {service_level}, using 0%")
            
            # Convert percentage to decimal (e.g., 10% -> 0.10)
            markup_decimal = float(markup_pct) / 100.0
            
            # Apply markup
            markup_amount = rate_with_surcharges * markup_decimal
            final_rate = rate_with_surcharges + markup_amount
            
            logger.info(f"Rate calculation: Base={base_rate}, Surcharges={surcharges.get('total_surcharges', 0.0)}, Markup={markup_pct}%, Final={final_rate}")
            
            return {
                'markup_percentage': markup_pct,
                'markup_amount': round(markup_amount, 2),
                'final_rate': round(final_rate, 2)
            }
            
        except Exception as e:
            logger.error(f"Error applying markups: {str(e)}")
            
            # Fallback to safe values
            return {
                'markup_percentage': 0.0,
                'markup_amount': 0.0,
                'final_rate': round(base_rate + surcharges.get('total_surcharges', 0.0), 2)
            }
    
    def apply_surcharges(self, base_rate: float, dest_zip: str, weight: float, package_type: str) -> Dict[str, float]:
        """
        Apply applicable surcharges to the base rate.
        
        Args:
            base_rate: Base shipping rate
            dest_zip: Destination ZIP code
            weight: Weight in pounds
            package_type: Type of package
            
        Returns:
            Dict[str, float]: Dictionary with surcharge details
        """
        surcharges = {
            'fuel_surcharge': 0.0,
            'das_surcharge': 0.0,
            'edas_surcharge': 0.0,
            'remote_surcharge': 0.0,
            'total_surcharges': 0.0
        }
        
        try:
            # Ensure dest_zip is a string for checking
            dest_zip_str = str(dest_zip)
            
            # Define zip_prefix here at the beginning so it's available throughout the function
            try:
                zip_prefix = self.standardize_zip(dest_zip_str)
            except Exception as e:
                logger.error(f"Error getting ZIP prefix for {dest_zip_str}: {str(e)}")
                zip_prefix = "000"  # Use a safe default value
            
            # Apply fuel surcharge (convert percentage to decimal)
            fuel_pct = self.criteria_values.get('fuel_surcharge_percentage', 16.0)
            # Convert percentage to decimal (e.g., 16% -> 0.16)
            fuel_decimal = float(fuel_pct) / 100.0
            
            # Apply fuel surcharge to base rate
            fuel_amount = base_rate * fuel_decimal
            surcharges['fuel_surcharge'] = round(fuel_amount, 2)
            
            # Apply ONE surcharge type based on priority (Remote > EDAS > DAS)
            # Use original 5-digit ZIP for surcharge lookups (not standardized prefix)
            zip_5digit = None
            if zip_prefix != "INT":
                # Clean the original ZIP and ensure it's 5 digits
                clean_zip = dest_zip_str.strip().replace(' ', '').replace('-', '')
                if clean_zip.isdigit():
                    zip_5digit = clean_zip.zfill(5)[:5]
            
            # Priority 1: Remote Area Surcharge (highest priority)
            remote_applied = False
            if zip_prefix == "INT":
                # International destinations
                surcharges['remote_surcharge'] = self.criteria_values.get('remote_surcharge', 14.15)
                logger.info(f"Applied Remote surcharge to international zip: {dest_zip_str}")
                remote_applied = True
            elif zip_5digit and zip_5digit in self.remote_zips_dict and self.remote_zips_dict[zip_5digit]:
                # ZIP codes in remote ZIP dictionary
                surcharges['remote_surcharge'] = self.criteria_values.get('remote_surcharge', 14.15)
                logger.info(f"Applied Remote surcharge to remote area zip: {dest_zip_str}")
                remote_applied = True
            
            # Priority 2: EDAS (only if Remote not applied)
            if not remote_applied and zip_5digit:
                if zip_5digit in self.edas_zips_dict and self.edas_zips_dict[zip_5digit]:
                    surcharges['edas_surcharge'] = self.criteria_values.get('edas_surcharge', 3.92)
                    logger.info(f"Applied EDAS to zip: {dest_zip_str}")
            
            # Priority 3: DAS (only if Remote and EDAS not applied)
            if not remote_applied and not surcharges['edas_surcharge']:
                if self.is_das_zip(dest_zip_str):
                    surcharges['das_surcharge'] = self.criteria_values.get('das_surcharge', 1.98)
                    logger.info(f"Applied DAS to zip: {dest_zip_str}")
            
            # Calculate total surcharges
            surcharges['total_surcharges'] = round(
                surcharges['fuel_surcharge'] + 
                surcharges['das_surcharge'] + 
                surcharges['edas_surcharge'] + 
                surcharges['remote_surcharge'], 
                2
            )
            
            return surcharges
            
        except Exception as e:
            logger.error(f"Error applying surcharges: {str(e)}")
            # Return the default surcharges with at least the fuel surcharge
            try:
                # Attempt to still calculate fuel surcharge even if other surcharges fail
                fuel_pct = self.criteria_values.get('fuel_surcharge_percentage', 16.0)
                fuel_decimal = float(fuel_pct) / 100.0
                surcharges['fuel_surcharge'] = round(base_rate * fuel_decimal, 2)
                surcharges['total_surcharges'] = surcharges['fuel_surcharge']
            except Exception:
                pass
            return surcharges
    
    def calculate_margin(self, final_rate: float, current_rate: float = None) -> Dict[str, float]:
        """
        Calculate margin compared to current rate.
        
        Args:
            final_rate: Final calculated rate
            current_rate: Current rate being paid (if available)
            
        Returns:
            Dict[str, float]: Dictionary with margin details
        """
        margin = {
            'carrier_rate': current_rate,
            'savings': 0.0,
            'savings_percent': 0.0
        }
        
        # Calculate savings if current rate is available
        if current_rate is not None and current_rate > 0:
            margin['savings'] = current_rate - final_rate
            margin['savings_percent'] = (margin['savings'] / current_rate) * 100
        
        return margin
    
    def calculate_shipment_rate(self, shipment: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate the complete rate for a single shipment.
        
        Args:
            shipment: Dictionary with shipment details
            
        Returns:
            Dict[str, Any]: Dictionary with complete rate details
            
        Raises:
            CalculationError: If rate calculation fails
        """
        # Initialize default result with error indicators
        default_result = {
            'shipment_id': shipment.get('shipment_id', ''),
            'origin_zip': shipment.get('origin_zip', ''),
            'destination_zip': shipment.get('destination_zip', ''),
            'weight': shipment.get('weight', 0),
            'billable_weight': shipment.get('billable_weight', shipment.get('weight', 0)),
            'package_type': shipment.get('package_type', 'box'),
            'zone': 'Error',
            'base_rate': np.nan,
            'fuel_surcharge': np.nan,
            'das_surcharge': np.nan,
            'edas_surcharge': np.nan,
            'remote_surcharge': np.nan,
            'total_surcharges': np.nan,
            'discount_amount': np.nan,
            'markup_amount': np.nan,
            'markup_percentage': np.nan,  # Add this to match the key returned by apply_discounts_and_markups
            'final_rate': np.nan,
            'carrier_rate': shipment.get('carrier_rate', np.nan),
            'savings': np.nan,
            'savings_percent': np.nan,
            'service_level': shipment.get('service_level', 'standard'),
            'errors': ''
        }
        
        try:
            # Extract shipment details
            origin_zip = shipment.get('origin_zip')
            dest_zip = shipment.get('destination_zip')
            weight = shipment.get('weight')
            package_type = shipment.get('package_type', 'box')
            current_rate = shipment.get('carrier_rate')
            service_level = shipment.get('service_level', 'standard')
            
            # Use billable_weight if provided, otherwise use weight
            rating_weight = shipment.get('billable_weight', weight)
            
            # Validate required fields
            if not origin_zip or not dest_zip or not rating_weight:
                raise CalculationError("Missing required shipment details")
            
            # Handle Canadian/international postal codes
            is_international = False
            dest_zip_str = str(dest_zip)
            
            if any(c.isalpha() for c in dest_zip_str):
                is_international = True
                logger.info(f"Processing international destination: {dest_zip_str}")
                # Set zone to 8 for international
                zone = 8
                default_result['zone'] = zone
            else:
                try:
                    # Get regular zone for domestic shipments
                    zone = self.get_zone(origin_zip, dest_zip)
                    default_result['zone'] = zone
                except Exception as e:
                    logger.error(f"Zone lookup failed: {str(e)}")
                    zone = 8  # Default to zone 8 for any failures
                    default_result['zone'] = zone
                    default_result['errors'] = f"Zone lookup error: {str(e)}"
            
            # Get base rate
            try:
                base_rate = self.get_base_rate(rating_weight, zone, package_type)
                default_result['base_rate'] = base_rate
                
                # Apply surcharges
                try:
                    surcharges = self.apply_surcharges(base_rate, dest_zip, rating_weight, package_type)
                    default_result.update({
                        'fuel_surcharge': surcharges['fuel_surcharge'],
                        'das_surcharge': surcharges['das_surcharge'],
                        'edas_surcharge': surcharges['edas_surcharge'],
                        'remote_surcharge': surcharges['remote_surcharge'],
                        'total_surcharges': surcharges['total_surcharges']
                    })
                    
                    # Apply discounts and markups
                    try:
                        pricing = self.apply_discounts_and_markups(base_rate, surcharges, service_level)
                        default_result['final_rate'] = pricing['final_rate']
                        default_result['markup_percentage'] = pricing['markup_percentage']
                        default_result['markup_amount'] = pricing['markup_amount']
                        
                        # Calculate margin if carrier_rate is provided
                        if current_rate is not None:
                            try:
                                margin = self.calculate_margin(pricing['final_rate'], current_rate)
                                default_result.update({
                                    'savings': margin['savings'],
                                    'savings_percent': margin['savings_percent']
                                })
                            except Exception as e:
                                logger.warning(f"Margin calculation failed: {str(e)}")
                                default_result['errors'] = f"Margin calculation error: {str(e)}"
                        
                    except Exception as e:
                        logger.warning(f"Discount/markup application failed: {str(e)}")
                        default_result['errors'] = f"Discount/markup error: {str(e)}"
                    
                except Exception as e:
                    logger.warning(f"Surcharge application failed: {str(e)}")
                    default_result['errors'] = f"Surcharge error: {str(e)}"
                
            except Exception as e:
                logger.warning(f"Base rate calculation failed: {str(e)}")
                default_result['errors'] = f"Base rate error: {str(e)}"
            
            # If we got this far with no errors, return the result
            return default_result
            
        except Exception as e:
            logger.error(f"Shipment rate calculation failed: {str(e)}")
            default_result['errors'] = f"Calculation error: {str(e)}"
            return default_result
    
    def calculate_rates(self, shipments: List[Dict[str, Any]], 
                       discount_percent: float = None, 
                       markup_percent: float = None) -> List[Dict[str, Any]]:
        """
        Calculate rates for multiple shipments.
        
        Args:
            shipments: List of dictionaries with shipment details
            discount_percent: Optional discount percentage override
            markup_percent: Optional markup percentage override
            
        Returns:
            List[Dict[str, Any]]: List of dictionaries with complete rate details
        """
        results = []
        errors = []
        
        for i, shipment in enumerate(shipments):
            try:
                result = self.calculate_shipment_rate(shipment)
                results.append(result)
            except Exception as e:
                logger.error(f"Failed to calculate rate for shipment {shipment.get('shipment_id', 'N/A')}: {str(e)}", exc_info=True)
                # Create a result dictionary with error indicators for all expected columns
                error_result = {
                    'shipment_id': shipment.get('shipment_id', 'N/A'),
                    'origin_zip': shipment.get('origin_zip', 'N/A'),
                    'destination_zip': shipment.get('destination_zip', 'N/A'),
                    'weight': shipment.get('weight', np.nan),
                    'dim_weight': np.nan,
                    'billable_weight': shipment.get('billable_weight', np.nan), # Use original billable if available, else NaN
                    'rating_weight': np.nan,
                    'package_type': shipment.get('package_type', 'N/A'),
                    'service_level': shipment.get('service_level', 'N/A'),
                    'zone': 'Error',
                    'base_rate': np.nan,
                    'fuel_surcharge': np.nan,
                    'das_surcharge': np.nan,
                    'edas_surcharge': np.nan,
                    'remote_surcharge': np.nan,
                    'total_surcharges': np.nan,
                    'discount_amount': np.nan, # Assuming 0 discount
                    'markup_percent': np.nan,
                    'final_rate': np.nan,
                    'carrier_rate': shipment.get('carrier_rate', np.nan),
                    'savings': np.nan,
                    'savings_percent': np.nan,
                    'errors': f"Calculation Error: {e}"
                }
                results.append(error_result)
        
        if errors:
            logger.warning(f"Completed with {len(errors)} errors: {errors}")
        
        logger.info(f"Calculated rates for {len(results)} shipments")
        return results
    
    def get_summary_stats(self, results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Get summary statistics for the calculated rates.
        
        Args:
            results: List of dictionaries with rate details
            
        Returns:
            Dict[str, Any]: Summary statistics
        """
        # Filter out results with errors
        valid_results = [r for r in results if 'error' not in r]
        
        if not valid_results:
            return {
                'total_shipments': 0,
                'total_base_rate': 0,
                'total_surcharges': 0,
                'total_final_rate': 0,
                'total_savings': 0,
                'avg_base_rate': 0,
                'avg_final_rate': 0,
                'avg_savings_percent': 0
            }
        
        # Calculate summary statistics
        stats = {
            'total_shipments': len(valid_results),
            'total_base_rate': sum(r['base_rate'] for r in valid_results),
            'total_surcharges': sum(r['total_surcharges'] for r in valid_results),
            'total_final_rate': sum(r['final_rate'] for r in valid_results),
            'total_savings': sum(r['savings'] for r in valid_results if r.get('carrier_rate')),
            'avg_base_rate': sum(r['base_rate'] for r in valid_results) / len(valid_results),
            'avg_final_rate': sum(r['final_rate'] for r in valid_results) / len(valid_results),
            'avg_savings_percent': sum(r['savings_percent'] for r in valid_results if r.get('carrier_rate')) / 
                                  len([r for r in valid_results if r.get('carrier_rate')]) 
                                  if any(r.get('carrier_rate') for r in valid_results) else 0
        }
        
        return stats

    def update_criteria(self, criteria: Dict[str, Any]) -> None:
        """
        Update calculation criteria.
        
        Args:
            criteria: Dictionary of criteria values
        """
        if not criteria:
            logger.warning("Empty criteria provided, using defaults")
            return
            
        # Log the update
        logger.info(f"Updating criteria with: {criteria}")
        
        # Handle potential naming inconsistencies
        if 'fuel_surcharge_percentage' in criteria and 'fuel_surcharge' not in criteria:
            criteria['fuel_surcharge'] = criteria['fuel_surcharge_percentage'] / 100.0  # Convert to decimal
        elif 'fuel_surcharge' in criteria and 'fuel_surcharge_percentage' not in criteria:
            criteria['fuel_surcharge_percentage'] = criteria['fuel_surcharge'] * 100.0  # Convert to percentage
        
        # Explicitly handle markup_percentage
        if 'markup_percentage' in criteria:
            try:
                markup_value = float(criteria['markup_percentage'])
                criteria['markup_percentage'] = markup_value
                logger.info(f"Setting markup_percentage to {markup_value}%")
            except (ValueError, TypeError):
                logger.warning(f"Invalid markup_percentage value: {criteria['markup_percentage']}, using default 10.0%")
                criteria['markup_percentage'] = 10.0
        else:
            logger.info("No markup_percentage provided in criteria, keeping current value")
        
        # Convert surcharge values to proper types
        surcharge_fields = [
            'das_surcharge', 'edas_surcharge', 'remote_surcharge', 
            'markup_percentage', 'fuel_surcharge_percentage'
        ]
        
        for field in surcharge_fields:
            if field in criteria:
                try:
                    criteria[field] = float(criteria[field])
                except (ValueError, TypeError):
                    logger.warning(f"Could not convert {field} value '{criteria[field]}' to float, using default")
                    if field in self.criteria_values:
                        criteria[field] = self.criteria_values[field]
                    else:
                        # Set sensible defaults for missing values
                        defaults = {
                            'das_surcharge': 1.98,
                            'edas_surcharge': 3.92,
                            'remote_surcharge': 14.15,
                            'markup_percentage': 10.0,
                            'fuel_surcharge_percentage': 16.0
                        }
                        criteria[field] = defaults.get(field, 0.0)
            
        # Process service level markups if provided
        if 'service_level_markups' in criteria:
            service_markups = criteria['service_level_markups']
            if isinstance(service_markups, dict):
                # Update individual service level markups in criteria
                for service, markup in service_markups.items():
                    criteria[f'{service}_markup'] = float(markup)
        
        # Create a service_level_markups dict if not present but individual markups are
        service_levels = ['standard', 'expedited', 'priority', 'next_day']
        has_individual_markups = any(f'{level}_markup' in criteria for level in service_levels)
        
        if has_individual_markups and 'service_level_markups' not in criteria:
            criteria['service_level_markups'] = {}
            for level in service_levels:
                key = f'{level}_markup'
                if key in criteria:
                    criteria['service_level_markups'][level] = float(criteria[key])
                elif key in self.criteria_values:
                    criteria['service_level_markups'][level] = float(self.criteria_values[key])
                else:
                    # Default values for service level markups
                    defaults = {
                        'standard_markup': 0.0,
                        'expedited_markup': 10.0,
                        'priority_markup': 15.0,
                        'next_day_markup': 25.0
                    }
                    criteria['service_level_markups'][level] = defaults.get(f'{level}_markup', 0.0)
                    
        # Store the updated criteria
        self.criteria_values.update(criteria)
        
        # Log the final criteria
        logger.info(f"Updated criteria: {self.criteria_values}")
        
        # Validate any changes that need validation
        if 'dim_divisor' in criteria:
            try:
                self.criteria_values['dim_divisor'] = float(criteria['dim_divisor'])
            except (ValueError, TypeError):
                logger.warning(f"Invalid dim_divisor value: {criteria['dim_divisor']}, using default 139.0")
                self.criteria_values['dim_divisor'] = 139.0
                
        if 'min_billable_weight' in criteria:
            try:
                self.criteria_values['min_billable_weight'] = float(criteria['min_billable_weight'])
            except (ValueError, TypeError):
                logger.warning(f"Invalid min_billable_weight value: {criteria['min_billable_weight']}, using default 1.0")
                self.criteria_values['min_billable_weight'] = 1.0


def calculate_rates(shipments: List[Dict[str, Any]], 
                   template_file: str,
                   discount_percent: float = None, 
                   markup_percent: float = None) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """
    Calculate Amazon shipping rates for a list of shipments.
    
    Args:
        shipments: List of dictionaries with shipment details
        template_file: Path to the Excel template with reference data
        discount_percent: Optional discount percentage override
        markup_percent: Optional markup percentage override
        
    Returns:
        Tuple[List[Dict[str, Any]], Dict[str, Any]]: Calculated rates and summary statistics
    """
    calculator = AmazonRateCalculator(template_file)
    results = calculator.calculate_rates(shipments, discount_percent, markup_percent)
    stats = calculator.get_summary_stats(results)
    
    return results, stats


if __name__ == "__main__":
    import sys
    import json
    
    # Test the calculation engine with sample data
    template_file = '2025 Amazon Quote Tool Template.xlsx'
    
    # Create a sample shipment
    sample_shipments = [
        {
            'shipment_id': 'SHP001',
            'origin_zip': '90210',
            'destination_zip': '10001',
            'weight': 12.5,
            'billable_weight': 12.5,
            'length': 12,
            'width': 10,
            'height': 8,
            'package_type': 'box',
            'service_level': 'standard',
            'current_rate': 15.75
        },
        {
            'shipment_id': 'SHP002',
            'origin_zip': '75001',
            'destination_zip': '60007',
            'weight': 5.2,
            'billable_weight': 5.2,
            'length': 8,
            'width': 6,
            'height': 4,
            'package_type': 'envelope',
            'service_level': 'expedited',
            'current_rate': 8.25
        }
    ]
    
    try:
        # Initialize the calculator
        calculator = AmazonRateCalculator(template_file)
        
        # Calculate rates
        results = calculator.calculate_rates(sample_shipments)
        
        # Get summary statistics
        stats = calculator.get_summary_stats(results)
        
        # Print results
        print("\nCalculated Rates:")
        for result in results:
            print(f"\nShipment ID: {result.get('shipment_id', 'N/A')}")
            print(f"Origin ZIP: {result.get('origin_zip', 'N/A')}")
            print(f"Destination ZIP: {result.get('destination_zip', 'N/A')}")
            print(f"Weight: {result.get('weight', 0)} lbs")
            print(f"Zone: {result.get('zone', 'N/A')}")
            print(f"Base Rate: ${result.get('base_rate', 0):.2f}")
            print(f"Fuel Surcharge: ${result.get('fuel_surcharge', 0):.2f}")
            print(f"DAS Surcharge: ${result.get('das_surcharge', 0):.2f}")
            print(f"EDAS Surcharge: ${result.get('edas_surcharge', 0):.2f}")
            print(f"Remote Surcharge: ${result.get('remote_surcharge', 0):.2f}")
            print(f"Total Surcharges: ${result.get('total_surcharges', 0):.2f}")
            print(f"Final Rate: ${result.get('final_rate', 0):.2f}")
            if result.get('current_rate'):
                print(f"Current Rate: ${result.get('current_rate', 0):.2f}")
                print(f"Savings: ${result.get('savings', 0):.2f}")
                print(f"Savings Percent: {result.get('savings_percent', 0):.2f}%")
        
        # Print summary statistics
        print("\nSummary Statistics:")
        print(f"Total Shipments: {stats['total_shipments']}")
        print(f"Total Base Rate: ${stats['total_base_rate']:.2f}")
        print(f"Total Surcharges: ${stats['total_surcharges']:.2f}")
        print(f"Total Final Rate: ${stats['total_final_rate']:.2f}")
        print(f"Total Savings: ${stats['total_savings']:.2f}")
        print(f"Average Base Rate: ${stats['avg_base_rate']:.2f}")
        print(f"Average Final Rate: ${stats['avg_final_rate']:.2f}")
        print(f"Average Savings Percent: {stats['avg_savings_percent']:.2f}%")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)
