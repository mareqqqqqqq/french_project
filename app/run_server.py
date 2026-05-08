import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "backend.main:app", # вот строчка, которая делает main реально главным файлом
        host="127.0.0.1",
        port=8000,
        reload=True
    )
