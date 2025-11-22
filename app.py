import os
import nkapi
import views

app = nkapi.NKServer(
    host="0.0.0.0",
    port=int(os.environ.get("PORT", 8000)),
    debug=True
)

app.router.register(methods=["GET", "POST"], path="/", callback=views.root)
app.router.register(methods=["GET", "POST"], path="/static/<file>", callback=views.static)

app.router.register(methods=["GET"], path="/tasks/list", callback=views.tasks_list)
app.router.register(methods=["POST"], path="/tasks/create", callback=views.tasks_create)
app.router.register(methods=["POST"], path="/tasks/update", callback=views.tasks_update)
app.router.register(methods=["POST"], path="/tasks/delete", callback=views.tasks_delete)

if __name__ == "__main__":
    app.start()
