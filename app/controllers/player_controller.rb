class PlayerController < ApplicationController
  before_filter :authenticate_user!

  def index
  end

  def help
  end
end
