#!/usr/bin/env python3
"""
Test script to verify the simple zone calculator is working.
"""

from simple_zone_calculator import zone_calculator

def test_simple_zone_calculator():
    """Test the simple zone calculator with various ZIP codes."""
    
    test_cases = [
        ("75238", "76087"),  # Dallas to Fort Worth - should be zone 1 (same region)
        ("75238", "92626"),  # Dallas to California - should be zone 7 (Northwest)
        ("75238", "10001"),  # Dallas to NYC - should be zone 2 (Northeast)
        ("75238", "20001"),  # Dallas to DC - should be zone 3 (Southeast)
        ("75238", "60001"),  # Dallas to Chicago - should be zone 4 (Midwest)
        ("75238", "99501"),  # Dallas to Alaska - should be zone 8 (Alaska/Hawaii)
    ]
    
    print("Testing Simple Zone Calculator:")
    print("=" * 50)
    
    for origin, dest in test_cases:
        try:
            zone = zone_calculator.get_zone(origin, dest)
            description = zone_calculator.get_zone_description(zone)
            print(f"{origin} to {dest}: Zone {zone} ({description})")
        except Exception as e:
            print(f"{origin} to {dest}: ERROR - {str(e)}")
    
    print("\n" + "=" * 50)
    print("Test completed!")

if __name__ == "__main__":
    test_simple_zone_calculator() 