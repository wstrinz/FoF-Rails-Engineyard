require 'websocket_helper'
require 'net/http'

class WebsocketController < WebsocketRails::BaseController

  include WebsocketHelper

  def initialize_session
    unless controller_store[:id_num]
      controller_store[:id_num] = 0
      Thread.abort_on_exception = true
      Thread.new do
        puts "starting listener"
        # watch_pipe('redis')
        subscribe_to_redis
      end
    end
  end

  def connected
    puts "connection made!"
    # send_message :test, "hello!"
  end

  def send_event(send_channel, msg)
    if send_channel
      WebsocketRails[:"#{send_channel}"].trigger(:event, msg)
    else
      puts "no channel specified, skipping #{msg}"
      # WebsocketRails[:"#{controller_store[:current_event_id]}"].trigger(:event, msg)
    end

    # send_message :event, msg
  end

  def receive_event
    puts "received #{message}"
    controller_store[:current_event_id] = message[0]
    jss = ActiveSupport::JSON.decode(message[2])
    jss["clientID"] = message[0]
    jss["roomID"] = message[1]
    jss["deviseName"] = "#{current_user.email}"
    # write_pipe(ActiveSupport::JSON.encode(jss))
    if(jss["event"] == "changeSettings")
      send_event(jss["roomName"],ActiveSupport::JSON.encode(jss))
    end
    # puts "current #{current_user.email}"
    # else
    #if @mode == "redis"
      write_queue(ActiveSupport::JSON.encode(jss))
    #else
     # write_pipe(ActiveSupport::JSON.encode(jss))
    # end
    # end
    # puts "wrote"
  end

  def get_new_id
    trigger_success "#{controller_store[:id_num]}"
    controller_store[:id_num] += 1
  end

  def watch_pipe(mode)
    loop do
      # if mode == "redis"
      # puts "check queue"
      str = read_queue(true)
      # puts "read queue"
      puts "got #{str}"
      # else
      #   str = read_pipe
      # end
      obj = ActiveSupport::JSON.decode(str);

      if(obj["event"] == "changeSettings")
        send_channel = obj["roomName"]
      else
        send_channel = obj["clientID"]    #redundant?
      end

      puts "Sending #{str} to #{send_channel}"

      send_event(send_channel,str)
    end
  end

  def check_model
    if ENV["RAILS_ENV"] == "development"
      url = URI.parse('http://localhost:4567/start')
    else
      url = URI.parse('http://mysterious-cliffs-4762.herokuapp.com/start')
    end
    req = Net::HTTP::Get.new(url.path)
    res = Net::HTTP.start(url.host, url.port) {|http|
      http.request(req)
    }
    trigger_success
  end

  def subscribe_to_redis
    if ENV["RAILS_ENV"] == "development"
      redis = REDISLOCALR
    else
      redis = REDISREAD
    end
    puts "subscribing"
    redis.subscribe(:toRuby) do |on|
      on.message do |channel, msg|
        data = JSON.parse(msg)
        puts "sending #{msg}"
        send_event(data["clientID"], msg)
        # puts "##{channel} - [#{data['user']}]: #{data['msg']}"
    end
  end
end
end