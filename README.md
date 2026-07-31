# 🇫🇷 French App

Платформа для изучения французского языка с интерактивными уроками: словарные карточки, упражнения на заполнение пропусков и упражнения на сопоставление слов (в разработке).

Backend полностью асинхронный, с разделением ролей "преподаватель" / "студент": преподаватели создают уроки и наполняют их контентом, студенты проходят уроки.

## 🛠️ Технологии

**Backend:** FastAPI, SQLAlchemy 2.0 (async), Alembic (миграции), Pydantic v2
**Auth:** JWT (access + refresh токены в httponly cookies с ротацией refresh-токена), passlib + bcrypt для хеширования паролей
**Защита:** slowapi — rate limiting на auth-эндпоинтах (register/login/refresh), настраиваемые лимиты
**БД:** MySQL (асинхронный доступ через aiomysql/asyncmy)
**Frontend:** React, Tailwind CSS
**Качество кода:** pytest, flake8, black, pre-commit hooks

## ✨ Основные возможности

- Регистрация и вход с JWT-авторизацией (access-токен на 15 минут, refresh — на 7 дней, хранятся в httponly cookies)
- Ролевой доступ: эндпоинты для преподавателей защищены отдельной зависимостью `require_teacher`
- Преподаватель может создавать и удалять уроки, добавлять словарные карточки и упражнения на заполнение пропусков
- Студенты видят список опубликованных уроков со всем содержимым
- Централизованная обработка ошибок: собственная иерархия исключений (`EntityNotFoundException`, `NotAuthorizedException`, `DatabaseException`) и единые JSON-обработчики ошибок, включая необработанные сбои SQLAlchemy
- Rate limiting на чувствительных эндпоинтах (защита от брутфорса при регистрации/входе)

## 🏗️ Архитектура

Backend разделён по слоям:

```
app/backend/
├── api/v1/        — эндпоинты (auth, lesson)
├── core/          — конфиг, security (JWT, bcrypt), зависимости, обработка исключений
├── models/        — таблицы БД (SQLAlchemy ORM)
├── schemas/       — валидация и сериализация (Pydantic)
├── services/      — бизнес-логика
├── repositories/  — доступ к БД (асинхронные запросы через AsyncSession)
└── tests/         — тесты (pytest)
```

Работа с БД — полностью асинхронная: запросы через `AsyncSession`, связанные данные подгружаются через `selectinload`, чтобы избежать N+1-запросов.

## 🚀 Установка и запуск

### 1. Клонировать репозиторий
```
git clone https://github.com/mareqqqqqqq/french_project.git
cd french_project
```

### 2. Создать виртуальное окружение
```
python -m venv venv
venv\Scripts\activate
```

### 3. Установить зависимости
```
pip install -r requirements.txt
```

### 4. Настроить переменные окружения
```
cp .env.example .env
```
Заполнить `.env`: данные подключения к MySQL (`DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`) и `SECRET_KEY` для JWT.

### 5. Настроить базу данных
```
mysql -u root -p
CREATE DATABASE french_app;
exit
```

### 6. Применить миграции
```
alembic upgrade head
```

### 7. Запустить сервер
```
python app/run_server.py
```

## 📡 API-документация

После запуска доступна по адресу: `http://127.0.0.1:8000/docs`

## 📌 В разработке

- Упражнение на сопоставление карточек (`check_match`) — эндпоинт есть, логика ещё дорабатывается
- Расширение покрытия тестами (сейчас есть базовая проверка авторизации эндпоинтов)
- Настройка CI (GitHub Actions)
