class EncodeFormView extends Backbone.View
  tagName: "form"
  events:
    "submit" : "onSubmit"

  initialize: ({@logsElem}) ->

  render: ->
    @$el.html "Please wait while loading.."

    $.ajax "https://raw.github.com/toots/nw-shine-encoder/master/templates/form.html"
      success: (data) =>
        @$el.html data

      error: =>
        @$el.html "Sorry, the unicorn is hungover.."

    this

  onSubmit: (e) ->
    e.preventDefault()

    data =
      source:  @$("input.file").val()
      bitrate: parseInt @$("input.bitrate").val()
      log: (data) =>
        @logsElem.html "#{@logsElem.html()}<br>#{data}"

    return console.log "no file!" unless data.source?

    (new Encoder data).process()
