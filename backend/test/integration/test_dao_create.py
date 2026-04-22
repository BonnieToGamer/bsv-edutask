import pytest
from unittest.mock import MagicMock
from bson import ObjectId
from pymongo.errors import WriteError
from src.util.dao import DAO

def create_clear_dao(collection_name: str) -> DAO:
    dao = DAO(collection_name)
    dao.drop()
    return DAO(collection_name)

@pytest.fixture
def dao():
    collection_name = "user"

    dao = create_clear_dao(collection_name)

    yield dao

    # cleanup after test
    dao.drop()
    

@pytest.mark.integration
def test_full_valid(dao):
    # arrange
    task_dao = create_clear_dao("task")
    task_id1 = ObjectId(task_dao.create({
        "title": "test1",
        "description": "test task 1"
    })["_id"]["$oid"])

    task_id2 = ObjectId(task_dao.create({
        "title": "test2",
        "description": "test task 2"
    })["_id"]["$oid"])
    
    new_user = {
        "firstName": "Mattias",
        "lastName": "Larsson",
        "email": "mattias.larsson@example.com",
        "tasks": [task_id1, task_id2]
    }
    
    # act
    inserted_user = dao.create(new_user)

    # assert
    assert inserted_user != None
    assert inserted_user["firstName"] == new_user["firstName"]
    assert inserted_user["lastName"] == new_user["lastName"]
    assert inserted_user["email"] == new_user["email"]
    assert inserted_user["tasks"] == [
        {"$oid": str(task_id1)},
        {"$oid": str(task_id2)}
    ]
    
    
@pytest.mark.integration 
def test_minimal_valid_doc(dao):
    # arrange
    new_user = {
        "firstName": "Mattias",
        "lastName": "Larsson",
        "email": "mattias.larsson@example.com"
    }
    
    # act
    inserted_user = dao.create(new_user)

    # assert
    assert inserted_user != None
    assert inserted_user["firstName"] == new_user["firstName"]
    assert inserted_user["lastName"] == new_user["lastName"]
    assert inserted_user["email"] == new_user["email"]
    
    
@pytest.mark.integration 
def test_missing_fields_doc(dao):

    with pytest.raises(WriteError):
        # arrange
        new_user = {
            "firstName": "Mattias",
            "lastName": "Larsson",
        }
        
        # act
        inserted_user = dao.create(new_user)
