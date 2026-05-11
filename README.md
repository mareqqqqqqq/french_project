# 🇫🇷 French App

Платформа для изучения французского языка с интерактивными тестами.

## 🛠️ Технологии

- **Backend:** FastAPI, SQLAlchemy, MySQL, JWT
- **Frontend:** React, Tailwind CSS
- **Инфраструктура:** Docker, GitHub Actions

## 🚀 Установка и запуск

### 1. Клонировать репозиторий
git clone https://github.com/mareqqqqqqq/french_project.git
cd french_project

### 2. Создать виртуальное окружение
python -m venv venv
venv\Scripts\activate

### 3. Установить зависимости
pip install -r requirements.txt

### 4. Настроить переменные окружения
cp .env.example .env
# Заполнить .env своими данными

### 5. Настроить базу данных
# Установить MySQL сервер если нет
# Создать базу данных:
mysql -u root -p
CREATE DATABASE french_app;
exit

### 6. Применить миграции
# Пока миграций нет, запустить:
python app/backend/init_db.py

### 7. Запустить сервер
python app/run_server.py

## 📡 API документация
http://127.0.0.1:8000/docs

## 🗂️ Структура проекта
app/
├── backend/
│   ├── api/          — endpoints
│   ├── core/         — безопасность, конфиг
│   ├── models/       — таблицы БД
│   ├── schemas/      — валидация
│   ├── services/     — бизнес логика
│   ├── repositories/ — работа с БД
│   └── tests/        — тесты
└── frontend/
    └── src/          — React компоненты