from models import TutorProfile

def generate_suggested_matches(request, top_n=4):
    """
    Given a TutorRequest object, return top N suggested TutorProfile matches
    based on majors, interests, and weights from the form.
    """
    matches = []

    # Extract request data
    requested_majors = request.majors  # list of selected majors, empty if "no preference"
    major_weight = request.major_weight or 0.5
    interests = request.interests.split(",") if request.interests else []
    interest_weight = request.interest_weight or 0.5

    # Loop through all tutors
    for tutor in TutorProfile.query.all():
        score = 0

        # Major match
        if requested_majors:
            tutor_majors = [m.name for m in tutor.majors]  # assuming tutor.majors is a list of objects
            major_matches = set(requested_majors).intersection(tutor_majors)
            score += major_weight * (len(major_matches) / len(requested_majors))

        # Interest match
        tutor_interests = tutor.interests.split(",") if tutor.interests else []
        if interests:
            interest_matches = set(interests).intersection(tutor_interests)
            score += interest_weight * (len(interest_matches) / len(interests))

        matches.append((tutor, score))

    # Sort descending by score and return top_n
    matches.sort(key=lambda x: x[1], reverse=True)
    return matches[:top_n]
