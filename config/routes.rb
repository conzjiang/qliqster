Rails.application.routes.draw do
  root to: 'static_pages#root'

  resources :users, except: [:edit, :update]
  get 'profile/edit', to: 'users#edit', as: 'edit_user'
  put 'profile/update', to: 'users#update', as: 'update_user'

  resource :session, only: [:new, :create, :destroy]
  get 'auth/facebook/callback', to: 'sessions#facebook'

  namespace :api, defaults: { format: :json } do
    resource :current_user, only: [:show, :update]
    resource :feed, only: [:new, :show]

    resources :users, only: [:create]
    get 'username', to: 'users#username'
    get 'users/:slug', to: 'users#show'
    get 'users/id/:id', to: 'users#show'
    post "users/:slug/follow", to: "users#follow"

    resource :session, only: [:create]
    post 'session/demo', to: 'sessions#demo'
    post 'session/facebook', to: 'sessions#facebook'

    get 'tv_shows/admin', to: 'tv_shows#admin'
    resources :tv_shows, only: [:index, :create, :show, :update]
    post 'tv_shows/:id/favorite', to: "tv_shows#favorite"
    post 'tv_shows/:id/watchlist', to: "tv_shows#watchlist"
    get 'tv_shows/:id/watchers', to: 'tv_shows#watchers'
    get 'tv_shows/:id/watch_counts', to: 'tv_shows#watch_counts'

    get 'genres/:genre', to: "tv_shows#genre"

    get 'search', to: 'searches#by_genre_and_decade'
    get 'search/ids', to: "searches#by_ids"
  end
end
