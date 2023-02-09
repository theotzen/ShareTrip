# The real problem with mongoDB types is the ObjectID used for id (the "_id") field.
# The rest is deserialized as a normal python dict

def userEntity(user) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "password": user["password"],
        "created_at": user["created_at"],
        "updated_at": user["updated_at"]
    }


def userResponseEntity(user) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "created_at": user["created_at"],
        "updated_at": user["updated_at"]
    }

def userResponseEntity_2(user) -> dict:
    temp_user = user.copy()
    temp_user["id"] = str(temp_user["_id"])
    del temp_user["_id"]
    del temp_user["password"]
    return temp_user


def embeddedUserResponse(user) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
    }


def userListEntity(users) -> list:
    return [userEntity(user) for user in users]


def userResponseListEntity(users) -> list:
    return [userResponseEntity(user) for user in users]

