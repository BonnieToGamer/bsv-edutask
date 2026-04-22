import pytest
from bson import ObjectId
from pymongo.errors import WriteError
from src.util.dao import DAO


def extract_id(doc: any) -> ObjectId:
    return ObjectId(doc["_id"]["$oid"])


def create_clear_dao(collection_name: str) -> DAO:
    dao = DAO(collection_name)
    dao.drop()
    return DAO(collection_name)


@pytest.fixture
def dao():
    dao = create_clear_dao("user")
    yield dao

    # cleanup after test
    dao.drop()


@pytest.fixture
def task_dao():
    dao = create_clear_dao("task")
    yield (dao)

    # cleanup after test
    dao.drop()


@pytest.mark.integration
def test_full_valid(dao, task_dao):
    # arrange
    task_id1 = extract_id(
        task_dao.create({"title": "test1", "description": "test task 1"})
    )

    task_id2 = extract_id(
        task_dao.create({"title": "test2", "description": "test task 2"})
    )

    new_user = {
        "firstName": "Mattias",
        "lastName": "Larsson",
        "email": "mattias.larsson@example.com",
        "tasks": [task_id1, task_id2],
    }

    # act
    inserted_user = dao.create(new_user)

    # assert
    assert inserted_user != None
    assert inserted_user["firstName"] == new_user["firstName"]
    assert inserted_user["lastName"] == new_user["lastName"]
    assert inserted_user["email"] == new_user["email"]
    assert [ObjectId(t["$oid"]) for t in inserted_user["tasks"]] == [task_id1, task_id2]


@pytest.mark.integration
def test_minimal_valid_doc(dao):
    # arrange
    new_user = {
        "firstName": "Mattias",
        "lastName": "Larsson",
        "email": "mattias.larsson@example.com",
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
    # arrange
    new_user = {
        "firstName": "Mattias",
        "lastName": "Larsson",
    }

    # act & assert
    with pytest.raises(WriteError):
        dao.create(new_user)

@pytest.mark.integration
def test_wrong_type(dao):
    # arrange
    new_user = {
        "firstName": True,
        "lastName": 10.0,
        "email": ["testing@example.com"]
    }
    
    # act & assert
    with pytest.raises(WriteError):
        dao.create(new_user)