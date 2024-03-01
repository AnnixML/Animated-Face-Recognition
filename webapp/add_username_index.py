import pymongo

uri = "mongodb+srv://user307:ANNIX@cluster0.8bxbeme.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
def create_unique_index():
    try:
        client = pymongo.MongoClient(uri)
        my_db = client["account_info"]
        my_collection = my_db["user_info"]
        index_name = "username_unique_index"
        result = my_collection.create_index([("username", pymongo.ASCENDING)],
                                            unique=True, name=index_name)
        print("Unique index created successfully:", result)
        
    except pymongo.errors.ConnectionFailure as e:
        print("Could not connect to MongoDB server:", e)
    except pymongo.errors.OperationFailure as e:
        print("Error creating unique index:", e)
    finally:
        client.close()

if __name__ == "__main__":
    create_unique_index()