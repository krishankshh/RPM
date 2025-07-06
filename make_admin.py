#!/usr/bin/env python3

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'rpm/backend'))

from src.database import User
from datetime import datetime

def make_user_admin(email):
    """Make a user admin by email"""
    try:
        # Find user by email
        user = User.find_by_email(email)
        if not user:
            print(f"User with email {email} not found")
            return False
        
        # Make user admin and whitelist them
        user_id = str(user['_id'])
        User.make_admin(user_id)
        User.whitelist_user(user_id)
        
        print(f"Successfully made {email} an admin and whitelisted them!")
        return True
        
    except Exception as e:
        print(f"Error making user admin: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 make_admin.py <email>")
        sys.exit(1)
    
    email = sys.argv[1]
    make_user_admin(email)

