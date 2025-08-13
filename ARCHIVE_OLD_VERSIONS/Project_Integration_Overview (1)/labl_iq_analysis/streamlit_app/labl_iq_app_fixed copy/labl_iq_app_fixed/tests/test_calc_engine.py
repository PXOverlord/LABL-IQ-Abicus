import pytest
from calc_engine import AmazonRateCalculator

def test_calculator_initialization():
    """Test that the calculator can be initialized with a template file."""
    try:
        calculator = AmazonRateCalculator("2025 Amazon Quote Tool Template.xlsx")
        assert calculator is not None
    except Exception as e:
        pytest.fail(f"Calculator initialization failed: {str(e)}")

def test_criteria_update():
    """Test that calculator criteria can be updated."""
    try:
        calculator = AmazonRateCalculator("2025 Amazon Quote Tool Template.xlsx")
        test_criteria = {
            'dim_divisor': 139,
            'markup_percentage': 10.0,
            'fuel_surcharge_percentage': 16.0
        }
        calculator.update_criteria(test_criteria)
        assert calculator.criteria['dim_divisor'] == 139
        assert calculator.criteria['markup_percentage'] == 10.0
        assert calculator.criteria['fuel_surcharge_percentage'] == 16.0
    except Exception as e:
        pytest.fail(f"Criteria update test failed: {str(e)}")

def test_rate_calculation():
    """Test basic rate calculation functionality."""
    try:
        calculator = AmazonRateCalculator("2025 Amazon Quote Tool Template.xlsx")
        test_shipment = {
            'origin_zip': '75001',
            'destination_zip': '10001',
            'weight': 5.0,
            'length': 10.0,
            'width': 8.0,
            'height': 6.0,
            'service_level': 'standard',
            'package_type': 'box'
        }
        result = calculator.calculate_rate(test_shipment)
        assert result is not None
        assert 'final_rate' in result
        assert isinstance(result['final_rate'], (int, float))
    except Exception as e:
        pytest.fail(f"Rate calculation test failed: {str(e)}") 