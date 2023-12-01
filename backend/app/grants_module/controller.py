from http import HTTPStatus
from app.models import User
from flask_login import login_required, current_user
from models.grants import Grants
from flask import jsonify

@login_required
def grants_controller():
    # Get Current User's Email
    email = current_user.email

    try:
        # Query Database for All Grants Associated With email
        grants = Grants.query.filter_by(email = email).all()

        # If No Grants Exist for email
        if not grants:
            return jsonify({'error': 'No grants found for this user.'}), 404

        # Add Each Grant's Information to a Dict (exclude email and date_added)
        grants_data = []

        for grant in grants:
            grant_dict = {
                'title': grant.title,
                'year': grant.year,
                'amount': grant.amount
            }
            grants_data.append(grant_dict)

        return jsonify(grants_data), 200
    
    except Exception as e:
        print("Error retrieving grants: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500



        

        






