$ ->
  logsElem = $("div.logs")
  log = (data) ->
    logsElem.html "#{logsElem.html()}<br>#{data.replace /\n/, "<br>"}"

  form = new EncodeFormView
    log: log

  form.render().$el.appendTo $("div.form")

  log "All is good dude, I just loaded all my stuff!"
