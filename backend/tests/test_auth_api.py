import unittest

from fastapi import HTTPException
from pydantic import ValidationError
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.api.auth import login_user, register_user
from app.core.database import Base
from app.core.security import verify_password
from app.models import User
from app.schemas import UserLogin, UserRegister


class AuthApiTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine(
            "sqlite:///:memory:",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        Base.metadata.create_all(bind=self.engine)
        self.session = sessionmaker(bind=self.engine)()

    def tearDown(self):
        self.session.close()
        self.engine.dispose()

    def test_registration_creates_hashed_password_and_login_returns_server_token(self):
        result = register_user(
            UserRegister(email="student@example.com", password="Secret123!", full_name="Туршилтын Сурагч"),
            self.session,
        )
        self.assertTrue(result["access_token"])
        self.assertEqual(result["user"].email, "student@example.com")
        account = self.session.query(User).filter_by(email="student@example.com").one()
        self.assertNotEqual(account.hashed_password, "Secret123!")
        self.assertTrue(verify_password("Secret123!", account.hashed_password))

        login_result = login_user(UserLogin(email="STUDENT@example.com", password="Secret123!"), self.session)
        self.assertTrue(login_result["access_token"])

    def test_duplicate_email_is_rejected_without_creating_another_user(self):
        values = UserRegister(email="student@example.com", password="Secret123!", full_name="Туршилтын Сурагч")
        register_user(values, self.session)
        with self.assertRaises(HTTPException) as error:
            register_user(values, self.session)
        self.assertEqual(error.exception.status_code, 400)

    def test_incorrect_password_returns_authentication_error(self):
        register_user(
            UserRegister(email="student@example.com", password="Secret123!", full_name="Туршилтын Сурагч"),
            self.session,
        )
        with self.assertRaises(HTTPException) as error:
            login_user(UserLogin(email="student@example.com", password="incorrect"), self.session)
        self.assertEqual(error.exception.status_code, 401)

    def test_registration_rejects_invalid_email_and_short_password(self):
        with self.assertRaises(ValidationError):
            UserRegister(email="not-an-email", password="Secret123!", full_name="Нэр")
        with self.assertRaises(ValidationError):
            UserRegister(email="student@example.com", password="123", full_name="Нэр")


if __name__ == "__main__":
    unittest.main()
