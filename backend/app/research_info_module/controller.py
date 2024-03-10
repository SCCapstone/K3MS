from flask_login import current_user
from app.models.grants import Grants
from app.models.publications import Publications
from app.models.user import User
from flask import jsonify
from http import HTTPStatus

# Grants Controller
def grants_controller(user_email=None): 
    # Get Current User's Email
    email = current_user.email

    # If user_email is provided, use it to query the database
    if user_email:
        if current_user.position != 'chair':
            return dict(error='You do not have authority to access this information'), HTTPStatus.UNAUTHORIZED
        email = user_email

        # make sure provided user is not a chair
        if User.query.filter_by(email=email, position='chair').first():
            return dict(error='You do not have authority to access this information'), HTTPStatus.UNAUTHORIZED
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
    
# Limited Grants Controller
def limited_grants_controller():
    # Get Current User's Email
    email = current_user.email

    try:
        # Query Database for First Four Grants Associated With email
        grants = Grants.query.filter_by(email = email).limit(4).all()

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
    
# Publications Controller
def publications_controller(user_email=None):
    # Get Current User's Email
    email = current_user.email

    # If user_email is provided, use it to query the database
    if user_email:
        if current_user.position != 'chair':
            return dict(error='You do not have authority to access this information'), HTTPStatus.UNAUTHORIZED
        email = user_email

        # make sure provided user is not a chair
        if User.query.filter_by(email=email, position='chair').first():
            return dict(error='You do not have authority to access this information'), HTTPStatus.UNAUTHORIZED

    try:
        # Query Database for All Publications Associated With email
        publications = Publications.query.filter_by(email = email).all()

        # If No Publications Exist for email
        if not publications:
            return jsonify({'error': 'No publications found for this user.'}), 404

        # Add Each Publication's Information to a Dict (exclude email and date_added)
        publications_data = []

        for publication in publications:
            publication_dict = {
                'title': publication.title,
                'authors': publication.authors,
                'publication_year': publication.publication_year,
                'isbn': publication.isbn
            }
            publications_data.append(publication_dict)

        return jsonify(publications_data), 200
    
    except Exception as e:
        print("Error retrieving publications: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
    
# Limited Publications Controller
def limited_publications_controller():
    # Get Current User's Email
    email = current_user.email

    try:
        # Query Database for All Publications Associated With email
        publications = Publications.query.filter_by(email = email).limit(4).all()

        # If No Publications Exist for email
        if not publications:
            return jsonify({'error': 'No publications found for this user.'}), 404

        # Add Each Publication's Information to a Dict (exclude email and date_added)
        publications_data = []

        for publication in publications:
            publication_dict = {
                'title': publication.title,
                'authors': publication.authors,
                'publication_year': publication.publication_year,
                'isbn': publication.isbn
            }
            publications_data.append(publication_dict)

        return jsonify(publications_data), 200
    
    except Exception as e:
        print("Error retrieving publications: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
    





        

        






