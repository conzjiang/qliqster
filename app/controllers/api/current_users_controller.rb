class Api::CurrentUsersController < ApplicationController
  def add_watchlist
    @watchlist = current_user.watchlists.find_or_initialize_by(
      tv_show_id: watchlist_params[:tv_show_id]
    )

    if @watchlist.update(watchlist_params)
      render :watchlist
    else
      render json: @watchlist.errors.full_messages, status: 422
    end
  end

  def delete_watchlist
    watchlist = current_user.watchlists.find_by(
      tv_show_id: params[:tv_show_id]
    )

    watchlist.destroy!
    render json: { destroyed: true }
  end

  def favorites
    @favorite = current_user.favorites.find_or_initialize_by(
      tv_show_id: params[:tv_show_id]
    )

    if @favorite.persisted?
      @favorite.destroy!
      render json: { destroyed: true }
    else
      @favorite.save!
      render :favorite
    end
  end

  def show
    unless signed_in?
      render json: "Not signed in."
    end
  end

  def update
    if params[:password].present?
      return if !validate_password
    end

    if current_user.update(user_params)
      render :show
    else
      errors = current_user.errors.messages

      if errors[:password]
        errors[:new_password] = errors[:password]
        errors.delete(:password)
      end

      render json: errors, status: 422
    end
  end

  private
  def user_params
    params.require(:current_user).permit(:email, :image_url)
  end

  def validate_password
    password = params[:password]
    new_password = params[:new_password]
    password_confirmation = params[:password_confirmation]

    return true unless new_password.present?

    if !current_user.is_password?(password)
      render json: {
        password: ["is incorrect."]
      }, status: 422
      return false
    end

    if new_password != password_confirmation
      render json: {
        password_confirmation: ["does not match."]
      }, status: 422
      return false
    end

    current_user.password = new_password
    true
  end

  def watchlist_params
    params.require(:current_user).permit(:tv_show_id, :status)
  end
end