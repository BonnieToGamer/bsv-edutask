import pytest
from unittest.mock import MagicMock
from src.controllers.usercontroller import UserController

@pytest.mark.unit
def test_get_user_by_email_invalid():
    #Arrange
    dao_mock = MagicMock()
    dao_mock.find.return_value = None
    #Act  
    usercontrol = UserController(dao_mock)
    #Assert 
    with pytest.raises(ValueError):
        usercontrol.get_user_by_email("Email")
        

@pytest.mark.unit
def test_get_user_by_email_valid_email_no_user():
    # arrange
    dao_mock = MagicMock()
    dao_mock.find.return_value = [None]

    # act
    user_controller = UserController(dao_mock)
    result = user_controller.get_user_by_email("email@example.com")

    # assert
    assert result is None