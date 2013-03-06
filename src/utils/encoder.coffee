{spawn} = require "child_process"

class Encoder
  constructor: ({@source,@bitrate,@target,@log}) ->
    @target  ||= @source.replace /\.wav$/, ".mp3"
    @bitrate ||= 128

  pathToBin: "vendor/bin/osx/shineenc"

  process: ->
    @log "Starting encoding process.."

    @child = spawn @pathToBin, ["-b",@bitrate,@source,@target]

    @child.stdout.on "data", (data) =>
      @log "#{data}"

    @child.stderr.on "data", (data) =>
      @log "ERROR: #{data}"

    @child.on "exit", (code) =>
      @log "Encoding process existed with code: #{code}"
