Rails.application.routes.draw do
  root to: 'static_pages#root'

  resources :users, except: [:edit, :update]
  get 'profile/edit', to: 'users#edit', as: 'edit_user'
  put 'profile/update', to: 'users#update', as: 'update_user'

  resource :session, only: [:new, :create, :destroy]

  namespace :api, defaults: { format: :json } do
    get 'current_user', to: 'api#current'
    get 'current_tv', to: 'api#current_tv'

    resources :users, only: [:create]
    get 'users/:username', to: 'users#show', as: 'user'
    resource :session, only: [:create]
    resources :tv_shows, only: [:create, :show, :update]

    get 'search', to: 'searches#get'
  end
end
