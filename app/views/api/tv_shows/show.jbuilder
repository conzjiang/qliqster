json.extract!(
  @tv_show,
  :id,
  :title,
  :start_year,
  :end_year,
  :status,
  :imdb_id,
  :rating,
  :blurb,
  :num_seasons,
  :network
)

json.image_url @tv_show.image.url(:original)
json.partial! "api/tv_shows/tv_show", tv_show: @tv_show
json.genres @tv_show.genres
json.belongs_to_admin current_user.admins?(@tv_show) if signed_in?
json.watch_counts @tv_show.watch_counts
