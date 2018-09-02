""" EMF Forum
"""
___name___         = "EMF Forum"
___license___      = "MIT"
___dependencies___ = ["wifi", "http", "ugfx_helper", "sleep", "dialogs", "sim800", "database"]
___categories___   = ["Other"]
___bootstrapped___ = True

import app, buttons, ugfx, ugfx_helper, http, dialogs, sim800, database, ujson, ure
from tilda import Buttons
from machine import Neopix

colour_black = 0x000000

running = True
api_url = "http://52.169.72.106"
n = Neopix()

ugfx_helper.init()
ugfx.clear(ugfx.html_color(colour_black))

style = ugfx.Style()
style.set_enabled([ugfx.WHITE, ugfx.WHITE, ugfx.html_color(0x888888), ugfx.html_color(0x444444)])
style.set_background(ugfx.html_color(colour_black))
ugfx.set_default_style(style)

def show_threads():
    ugfx.clear(ugfx.html_color(colour_black))
    threads = http.get(api_url + "/threads").raise_for_status().content
    threads = [{"title": thread.title, "threadID": thread.id} for thread in threads]
    thread = prompt_option(threads, none_text="Create new thread", text="Select a thread to view or create.")

    if thread == -1:
        create_thread()
    else:
        show_thread(thread)

def create_thread():
    title = dialogs.prompt_text("Whats the title of the new thread?:")
    request = {
        "who": sim800.imei(),
        "title": title,
    }
    request_json = ujson.dumps(request)

    try:
        http.post(api_url+'/threads', json=request_json).raise_for_status().close()
    except:
        ugfx.clear()
        ugfx.text(5, 100, "Error. Try again later. :(", ugfx.BLACK)
        return False

def show_thread(thread):
    comments = [{"title": comment.comment, "app": comment.id } for comment in thread.comments]
    comment = prompt_option(comments, none_text="No comments..", text=thread.title)

    if comment == -1:
        create_comment(thread)
    else:
        show_threads()

def create_comment(thread):
    title = dialogs.prompt_text("Whats your comment?:")
    request = {
        "who": sim800.imei(),
        "comment": title,
    }
    request_json = ujson.dumps(request)

    try:
        http.post(api_url+"/threads/"+thread.threadID, json=request_json).raise_for_status().close()
    except:
        ugfx.clear()
        ugfx.text(5, 100, "Error. Try again later. :(", ugfx.BLACK)
        return False

def quit_loop():
    while True:
        if buttons.is_triggered(Buttons.BTN_Menu):
            return False

while running:
    if not quit_loop():
        break

app.restart_to_default()