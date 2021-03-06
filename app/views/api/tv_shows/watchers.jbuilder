json.watchers @tv_show.watchers do |watcher|
  json.extract! watcher, :id, :username, :slug
  json.image_url asset_path(watcher.image.url(:thumb))
end

json.watching_idols_count @tv_show.watching_idols_count