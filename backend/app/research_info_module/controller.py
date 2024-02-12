from flask_login import current_user
from app.models.grants import Grants
from app.models.publications import Publications
from flask import jsonify

# Grants Controller
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
    
# Publications Controller
def publications_controller():
    # Get Current User's Email
    email = current_user.email

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
    





        

        






