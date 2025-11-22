import os
import json
import uuid
import nkapi

TASKS = {}

MIMETYPES = {
    "html": "text/html",
    "css": "text/css",
    "js": "text/javascript"
}

def root(request):
    return nkapi.NKResponse(
        headers={"Content-Type": "text/html"},
        body=open("./static/index.html", "r").read(),
        status=200
    )

def static(request):
    filename = os.path.join("./static/", request.params["file"])

    if os.path.exists(filename):
        return nkapi.NKResponse(
            headers={
                "Content-Type": MIMETYPES.get(filename.split(".")[-1], "text/plain")
            },
            body=open(filename, "r").read()
        )
    else:
        return nkapi.NKResponse(
            body="404 File Not Found",
            status=404
        )

def tasks_list(request):
    return nkapi.NKResponse(
        headers={"Content-Type": "application/json"},
        body=list(TASKS.values())
    )

def tasks_create(request):
    data = request.body
    text = data.get("text", "").strip()

    if not text:
        return nkapi.NKResponse(body="Missing 'text'", status=400)

    task_id = str(uuid.uuid4())
    TASKS[task_id] = {
        "id": task_id,
        "text": text,
        "completed": False
    }

    return nkapi.NKResponse(
        headers={"Content-Type": "application/json"},
        body=TASKS[task_id],
        status=201
    )

def tasks_update(request):
    data = request.body

    task_id = data.get("id")
    completed = data.get("completed")

    if task_id not in TASKS:
        return nkapi.NKResponse(body="Task not found", status=404)

    if not isinstance(completed, bool):
        return nkapi.NKResponse(body="'completed' must be boolean", status=400)

    TASKS[task_id]["completed"] = completed

    return nkapi.NKResponse(
        headers={"Content-Type": "application/json"},
        body=TASKS[task_id]
    )

def tasks_delete(request):
    data = request.body
    task_id = data.get("id")

    if task_id not in TASKS:
        return nkapi.NKResponse(body="Task not found", status=404)

    del TASKS[task_id]

    return nkapi.NKResponse(body="OK", status=200)