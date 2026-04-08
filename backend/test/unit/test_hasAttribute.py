import pytest
from src.util.helpers import hasAttribute

@pytest.fixture
def obj():
    return {"name": "Jane"}

@pytest.mark.unit
def test_hasAttribute_True(obj):
    result = hasAttribute(obj, "name")
    assert result == True

@pytest.mark.unit
def test_hasAttribute_False(obj):
    result = hasAttribute(obj, "age")
    assert result == False
