# The real problem with mongoDB types is the ObjectID used for id (the "_id") field.
# The rest is deserialized as a normal python dict

def trajetResponseEntity(trajet) -> dict:
    temp_trajet = trajet.copy()
    temp_trajet["id"] = str(temp_trajet["_id"])
    del temp_trajet["_id"]
    return temp_trajet


def trajetResponseListEntity(trajets) -> list:
    return [trajetResponseEntity(trajet) for trajet in trajets]

