#!/usr/bin/env python3
"""
Comprehensive Test Suite for RPM Platform
Tests admin login functionality and platform features
"""

import sys
import os
import requests
import json
import time
from datetime import datetime

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'rpm/backend'))

from src.database import User, Credits

class RPMTestSuite:
    def __init__(self, base_url="http://localhost:5000"):
        self.base_url = base_url
        self.admin_token = None
        self.regular_user_token = None
        self.test_results = []
        
    def log_test(self, test_name, passed, message=""):
        """Log test result"""
        status = "PASS" if passed else "FAIL"
        result = {
            'test': test_name,
            'status': status,
            'message': message,
            'timestamp': datetime.now().isoformat()
        }
        self.test_results.append(result)
        print(f"[{status}] {test_name}: {message}")
        
    def test_health_check(self):
        """Test API health endpoint"""
        try:
            response = requests.get(f"{self.base_url}/api/health")
            if response.status_code == 200:
                data = response.json()
                self.log_test("Health Check", True, f"API is healthy: {data['message']}")
                return True
            else:
                self.log_test("Health Check", False, f"Health check failed with status {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Health Check", False, f"Health check error: {str(e)}")
            return False
    
    def test_admin_login(self):
        """Test admin user login"""
        try:
            login_data = {
                "email": "krishankshh54@gmail.com",
                "password": "adminadmin"
            }
            
            response = requests.post(f"{self.base_url}/api/auth/login", json=login_data)
            
            if response.status_code == 200:
                data = response.json()
                user = data.get('user', {})
                
                # Check if user is admin
                if user.get('is_admin') == True:
                    self.admin_token = data.get('token')
                    self.log_test("Admin Login", True, f"Admin user logged in successfully: {user['email']}")
                    return True
                else:
                    self.log_test("Admin Login", False, "User logged in but is_admin flag is False")
                    return False
            else:
                self.log_test("Admin Login", False, f"Login failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Admin Login", False, f"Admin login error: {str(e)}")
            return False
    
    def test_regular_user_registration(self):
        """Test regular user registration"""
        try:
            # Create a test user
            test_email = f"testuser_{int(time.time())}@example.com"
            registration_data = {
                "email": test_email,
                "password": "testpassword123",
                "name": "Test User",
                "phone": "1234567890",
                "academic_level": "undergraduate",
                "subject_interest": "Computer Science"
            }
            
            response = requests.post(f"{self.base_url}/api/auth/register", json=registration_data)
            
            if response.status_code == 201:
                data = response.json()
                user = data.get('user', {})
                
                # Check user properties
                if (user.get('email') == test_email and 
                    user.get('is_whitelisted') == False and 
                    user.get('is_admin') == False):
                    self.regular_user_token = data.get('token')
                    self.log_test("Regular User Registration", True, f"User registered successfully: {test_email}")
                    return True
                else:
                    self.log_test("Regular User Registration", False, "User registered but properties are incorrect")
                    return False
            else:
                self.log_test("Regular User Registration", False, f"Registration failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Regular User Registration", False, f"Registration error: {str(e)}")
            return False
    
    def test_regular_user_login(self):
        """Test regular user login with existing user"""
        try:
            # Try to login with a regular user (create one first if needed)
            test_email = f"regularuser_{int(time.time())}@example.com"
            
            # First register the user
            registration_data = {
                "email": test_email,
                "password": "regularpassword123",
                "name": "Regular User",
                "phone": "1234567890",
                "academic_level": "undergraduate",
                "subject_interest": "Mathematics"
            }
            
            reg_response = requests.post(f"{self.base_url}/api/auth/register", json=registration_data)
            
            if reg_response.status_code != 201:
                self.log_test("Regular User Login", False, "Failed to create test user for login test")
                return False
            
            # Now test login
            login_data = {
                "email": test_email,
                "password": "regularpassword123"
            }
            
            response = requests.post(f"{self.base_url}/api/auth/login", json=login_data)
            
            if response.status_code == 200:
                data = response.json()
                user = data.get('user', {})
                
                # Check if user is NOT admin
                if user.get('is_admin') == False and user.get('email') == test_email:
                    self.log_test("Regular User Login", True, f"Regular user logged in successfully: {user['email']}")
                    return True
                else:
                    self.log_test("Regular User Login", False, "User logged in but admin status is incorrect")
                    return False
            else:
                self.log_test("Regular User Login", False, f"Login failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Regular User Login", False, f"Regular user login error: {str(e)}")
            return False
    
    def test_admin_endpoints(self):
        """Test admin-only endpoints"""
        if not self.admin_token:
            self.log_test("Admin Endpoints", False, "No admin token available")
            return False
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        try:
            # Test admin stats endpoint
            response = requests.get(f"{self.base_url}/api/admin/stats", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['total_users', 'waitlisted_users', 'whitelisted_users', 'admin_users']
                
                if all(field in data for field in required_fields):
                    self.log_test("Admin Stats Endpoint", True, f"Stats retrieved: {data}")
                    
                    # Test admin users list endpoint
                    list_response = requests.get(f"{self.base_url}/api/admin/users", headers=headers)
                    
                    if list_response.status_code == 200:
                        list_data = list_response.json()
                        if 'users' in list_data and 'pagination' in list_data:
                            self.log_test("Admin Users List", True, f"Retrieved {len(list_data['users'])} users")
                            return True
                        else:
                            self.log_test("Admin Users List", False, "Invalid response format")
                            return False
                    else:
                        self.log_test("Admin Users List", False, f"Users list failed with status {list_response.status_code}")
                        return False
                else:
                    self.log_test("Admin Stats Endpoint", False, "Missing required fields in stats response")
                    return False
            else:
                self.log_test("Admin Stats Endpoint", False, f"Stats endpoint failed with status {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Admin Endpoints", False, f"Admin endpoints error: {str(e)}")
            return False
    
    def test_unauthorized_admin_access(self):
        """Test that regular users cannot access admin endpoints"""
        if not self.regular_user_token:
            self.log_test("Unauthorized Admin Access", False, "No regular user token available")
            return False
        
        headers = {"Authorization": f"Bearer {self.regular_user_token}"}
        
        try:
            # Try to access admin stats with regular user token
            response = requests.get(f"{self.base_url}/api/admin/stats", headers=headers)
            
            if response.status_code == 403:
                self.log_test("Unauthorized Admin Access", True, "Regular user correctly denied admin access")
                return True
            else:
                self.log_test("Unauthorized Admin Access", False, f"Expected 403, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Unauthorized Admin Access", False, f"Unauthorized access test error: {str(e)}")
            return False
    
    def test_user_status_endpoint(self):
        """Test user status endpoint with admin token"""
        if not self.admin_token:
            self.log_test("User Status Endpoint", False, "No admin token available")
            return False
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        try:
            response = requests.get(f"{self.base_url}/api/user/status", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                user = data.get('user', {})
                credits = data.get('credits', {})
                
                if user.get('is_admin') == True and 'remaining_credits' in credits:
                    self.log_test("User Status Endpoint", True, f"Status retrieved for admin user: {user['email']}")
                    return True
                else:
                    self.log_test("User Status Endpoint", False, "Invalid user status response")
                    return False
            else:
                self.log_test("User Status Endpoint", False, f"Status endpoint failed with status {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("User Status Endpoint", False, f"User status error: {str(e)}")
            return False
    
    def test_invalid_credentials(self):
        """Test login with invalid credentials"""
        try:
            invalid_login_data = {
                "email": "nonexistent@example.com",
                "password": "wrongpassword"
            }
            
            response = requests.post(f"{self.base_url}/api/auth/login", json=invalid_login_data)
            
            if response.status_code == 401:
                self.log_test("Invalid Credentials", True, "Invalid credentials correctly rejected")
                return True
            else:
                self.log_test("Invalid Credentials", False, f"Expected 401, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Invalid Credentials", False, f"Invalid credentials test error: {str(e)}")
            return False
    
    def test_missing_fields(self):
        """Test API endpoints with missing required fields"""
        try:
            # Test login with missing password
            incomplete_login = {"email": "test@example.com"}
            response = requests.post(f"{self.base_url}/api/auth/login", json=incomplete_login)
            
            if response.status_code == 400:
                self.log_test("Missing Fields", True, "Missing fields correctly rejected")
                return True
            else:
                self.log_test("Missing Fields", False, f"Expected 400, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Missing Fields", False, f"Missing fields test error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("=" * 60)
        print("RPM Platform Comprehensive Test Suite")
        print("=" * 60)
        
        tests = [
            self.test_health_check,
            self.test_admin_login,
            self.test_regular_user_registration,
            self.test_regular_user_login,
            self.test_admin_endpoints,
            self.test_unauthorized_admin_access,
            self.test_user_status_endpoint,
            self.test_invalid_credentials,
            self.test_missing_fields
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
            print("-" * 40)
        
        print("=" * 60)
        print(f"Test Results: {passed}/{total} tests passed")
        print("=" * 60)
        
        # Print detailed results
        for result in self.test_results:
            status_symbol = "✓" if result['status'] == 'PASS' else "✗"
            print(f"{status_symbol} {result['test']}: {result['message']}")
        
        return passed == total

def main():
    """Main test runner"""
    # Check if server is running
    test_suite = RPMTestSuite()
    
    print("Starting RPM Platform Test Suite...")
    print("Make sure the backend server is running on http://localhost:5000")
    print()
    
    success = test_suite.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed! The RPM platform is working correctly.")
        return 0
    else:
        print("\n❌ Some tests failed. Please check the results above.")
        return 1

if __name__ == "__main__":
    exit(main())

