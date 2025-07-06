#!/usr/bin/env python3
"""
Frontend Test Script for Admin Login Flow
Tests the complete admin login process through API simulation
"""

import time
import requests

def test_admin_login_frontend():
    """Test admin login through API simulation"""
    
    try:
        # Test admin login via API (simulating frontend behavior)
        print("Frontend Test: Admin Login Flow")
        print("=" * 40)
        
        # Test 1: Verify admin can login via API
        login_data = {
            "email": "krishankshh54@gmail.com",
            "password": "adminadmin"
        }
        
        response = requests.post("http://localhost:5000/api/auth/login", json=login_data)
        
        if response.status_code == 200:
            data = response.json()
            user = data.get('user', {})
            
            if user.get('is_admin') == True:
                print("✓ Admin login successful via API")
                print(f"  - Email: {user['email']}")
                print(f"  - Admin status: {user['is_admin']}")
                print(f"  - Whitelisted: {user['is_whitelisted']}")
                
                # Test 2: Verify admin can access admin endpoints
                token = data.get('token')
                headers = {"Authorization": f"Bearer {token}"}
                
                admin_response = requests.get("http://localhost:5000/api/admin/stats", headers=headers)
                
                if admin_response.status_code == 200:
                    stats = admin_response.json()
                    print("✓ Admin can access admin endpoints")
                    print(f"  - Total users: {stats['total_users']}")
                    print(f"  - Admin users: {stats['admin_users']}")
                    print(f"  - Whitelisted users: {stats['whitelisted_users']}")
                    
                    return True
                else:
                    print("✗ Admin cannot access admin endpoints")
                    return False
            else:
                print("✗ User logged in but is not admin")
                return False
        else:
            print("✗ Admin login failed")
            return False
            
    except Exception as e:
        print(f"✗ Frontend test error: {str(e)}")
        return False

def test_regular_user_restrictions():
    """Test that regular users cannot access admin features"""
    print("\nFrontend Test: Regular User Restrictions")
    print("=" * 40)
    
    try:
        # Create a regular user
        test_email = f"testuser_{int(time.time())}@example.com"
        registration_data = {
            "email": test_email,
            "password": "testpassword123",
            "name": "Test User",
            "phone": "1234567890",
            "academic_level": "undergraduate",
            "subject_interest": "Computer Science"
        }
        
        reg_response = requests.post("http://localhost:5000/api/auth/register", json=registration_data)
        
        if reg_response.status_code == 201:
            data = reg_response.json()
            token = data.get('token')
            user = data.get('user', {})
            
            print(f"✓ Regular user created: {user['email']}")
            print(f"  - Admin status: {user.get('is_admin', False)}")
            
            # Try to access admin endpoints
            headers = {"Authorization": f"Bearer {token}"}
            admin_response = requests.get("http://localhost:5000/api/admin/stats", headers=headers)
            
            if admin_response.status_code == 403:
                print("✓ Regular user correctly denied admin access")
                return True
            else:
                print("✗ Regular user was able to access admin endpoints")
                return False
        else:
            print("✗ Failed to create regular user")
            return False
            
    except Exception as e:
        print(f"✗ Regular user test error: {str(e)}")
        return False

def main():
    """Run all frontend tests"""
    print("RPM Platform Frontend Testing")
    print("=" * 50)
    
    # Test admin login
    admin_test = test_admin_login_frontend()
    
    # Test regular user restrictions
    regular_test = test_regular_user_restrictions()
    
    print("\n" + "=" * 50)
    print("Frontend Test Results:")
    print(f"Admin Login Test: {'PASS' if admin_test else 'FAIL'}")
    print(f"Regular User Restrictions: {'PASS' if regular_test else 'FAIL'}")
    
    if admin_test and regular_test:
        print("\n🎉 All frontend tests passed!")
        return 0
    else:
        print("\n❌ Some frontend tests failed.")
        return 1

if __name__ == "__main__":
    exit(main())

