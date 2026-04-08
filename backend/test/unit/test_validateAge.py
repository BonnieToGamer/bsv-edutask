import pytest
import unittest
from src.util.helpers import ValidationHelper

@pytest.fixture
def mockedUserController(age: int):
    mocked_user_controller = unittest.mock.MagicMock()
    mocked_user_controller.get.return_value = {"age": age}
    return mocked_user_controller


@pytest.mark.parametrize("age, result", [
        (-1, "invalid"),
        (0, "underaged"),
        (1, "underaged"),
        (17, "underaged"),
        (18, "underaged"),
        (19, "valid"),
        (119, "valid"),
        (120, "valid"),
        (121, "invalid")
])
@pytest.mark.unit
def test_validateAge_Underage(age, result, mockedUserController):
    validationHelper = ValidationHelper(mockedUserController)
    assert validationHelper.validateAge("") == result