Rails.application.routes.draw do
  root to: 'static_pages#root'

  resources :users, except: [:edit, :update]
  get 'profile/edit', to: 'users#edit', as: 'edit_user'
  put 'profile/update', to: 'users#update', as: 'update_user'

  resource :session, only: [:new, :create, :destroy]

  namespace :api, defaults: { format: :json } do
    resource :current_user, only: [:show, :update]
    post 'current_user/watchlists', to: 'current_users#add_watchlist'
    delete 'current_user/watchlists/:tv_show_id',
      to: 'current_users#delete_watchlist'
    post 'current_user/favorites', to: 'current_users#favorites'

    resources :users, only: [:create]
    get 'users/:username', to: 'users#show'
    resource :session, only: [:create]
    resources :tv_shows, only: [:index, :create, :show, :update]
    get 'genres/:genre', to: "tv_shows#genre"

    get 'search', to: 'searches#get'
    get 'search/ids', to: "searches#ids"
  end
end
