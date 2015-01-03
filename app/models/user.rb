class User < ActiveRecord::Base
  include BCrypt
  attr_reader :password

  validates :email, :username, presence: true, uniqueness: true
  validates :username, length: { minimum: 3, maximum: 10 }
  validates :password, length: { minimum: 6, allow_nil: true }

  has_many :tv_shows, foreign_key: :admin_id
  has_many :watchlists, foreign_key: :watcher_id, inverse_of: :watcher
  has_many :watchlist_shows, through: :watchlists, source: :tv_show
  has_many :favorites, foreign_key: :favoriter_id
  has_many :favorite_shows, through: :favorites, source: :tv_show

  after_initialize :ensure_session_token

  def self.find_by_credentials(identifier, password)
    user = User.where("username = :id OR email = :id", id: identifier).first
    user.try(:is_password?, password) ? user : nil
  end

  def admin?
    self.is_admin
  end

  def is_password?(password)
    Password.new(self.password_digest).is_password?(password)
  end

  def password=(password)
    @password = password
    self.password_digest = Password.create(password)
  end

  def reset_session_token!
    self.session_token = SecureRandom.urlsafe_base64(16)
    self.save!
    self.session_token
  end

  private
  def ensure_session_token
    self.session_token ||= SecureRandom.urlsafe_base64(16)
  end
end
