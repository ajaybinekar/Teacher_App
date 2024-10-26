# frozen_string_literal: true

class Student < ApplicationRecord
  belongs_to :teacher
  validates :name, presence: true
  validates :subject, presence: true
end
