import pytest


@pytest.mark.anyio
async def test_all_lesson_requires_auth(client):
    response = await client.get("/api/v1/lesson/all_lessons")
    assert response.status_code == 401
