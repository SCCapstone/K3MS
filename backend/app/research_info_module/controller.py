from flask_login import current_user
from app.models.grants import Grants
from app.models.publications import Publications
from app.models.expenditures import Expenditures as Expens

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
    
# Expenditures Controller
def expenditures_controller():
    # Get Current User's Email
    email = current_user.email

    try:
        # Query Database for All Grants Associated With email
        expens = Expens.query.filter_by(email = email).all()

        # If No Expens Exist for email
        if not expens:
            return jsonify({'error': 'No expenditures found for this user.'}), 404

        # Add Each expenditures's Information to a Dict (exclude email and date_added)
        expens_data = []

        for expen in expens:
            expen_dict = {
                'year': expen.year,
                'amount': expen.amount,
                'reporting_department': expen.reporting_department,
                'pi_name': expen.pi_name
            }
            expens_data.append(expen_dict)

        return jsonify(expens_data), 200
    
    except Exception as e:
        print("Error retrieving grants: {e}")
        return jsonify({'error': f'Internal Server Error = {e}'}), 500
    
# Limited Expenditures Controller
def limited_expens_controller():
    # Get Current User's Email
    email = current_user.email

    try:
        # Query Database for First Four Expenditures Associated With email
        expens = Expens.query.filter_by(email = email).limit(4).all()

        # If No Expenditures Exist for email
        if not expens:
            return jsonify({'error': 'No expenditures found for this user.'}), 404

        # Add Each Expenditure's Information to a Dict (exclude email and date_added)
        expens_data = []

        for expen in expens:
            expen_dict = {
                'year': expen.year,
                'amount': expen.amount,
                'reporting_department': expen.reporting_department,
                'pi_name': expen.pi_name
            }
            expens_data.append(expen_dict)

        return jsonify(expens_data), 200
    
    except Exception as e:
        print("Error retrieving grants: {e}")
        return jsonify({'error': f'Internal Server Error - {e}'}), 500