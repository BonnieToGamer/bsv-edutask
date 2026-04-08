import pytest
import unittest
from src.util.helpers import diceroll

@pytest.mark.parametrize("value, result", [
    (1, False),
    (3, False),
    (4, True),
    (5, True),
    (6, True)
])
@pytest.mark.unit
def test_diceRoll(value, result):
    with unittest.mock.patch('random.randint') as random_mock:
        random_mock.return_value = value
        assert diceroll() == result