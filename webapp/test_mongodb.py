import pymongo
import sys

if __name__ == "__main__":
    mongodb_uri = "mongodb+srv://user307:ANNIX@cluster0.8bxbeme.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    client = None
    try:
        client = pymongo.MongoClient(mongodb_uri)
        print("Connected successfully to MongoDB server")
    except pymongo.errors.ConnectionFailure as e:
        print("Could not connect to MongoDB server:", e)
        sys.exit(1)
    
    database = client["account_info"]
    collection = database["user_info"]

    print("Attempting to create user with username 'testUSER' and password 'passUSER'...")
    insert_status = collection.insert_one({"username": "testUSER", "password": "passUSER"})
    if insert_status:
        print("User inserted successfully!")
    else:
        print("Could not insert document into collection")
        sys.exit(1)
    
    print("Attempting to update password to 'NEWpassUSER'...")
    update_status = collection.update_one({"username": "testUSER"}, {"$set": {"password": "NEWpassUSER"}})
    if update_status.matched_count == 0:
        print("No matches found!")
        sys.exit(1)
    elif update_status.modified_count == 0:
        print("No documents modified!")
        sys.exit(1)
    else:
        print("Password successfully changed!")

    print("Attempting to print the user we created...")
    query_status = collection.find_one({"username": "testUSER"})
    if query_status:
        print("User found! Details below...")
        print(query_status)
    else:
        print("No user found!")
        sys.exit(1)

    print("Attempting to delete the user we created...")
    delete_status = collection.delete_one({"password":"NEWpassUSER"})
    if delete_status.deleted_count == 0:
        print("No Document deleted!")
    else:
        print("User successfully deleted!")

    client.close()