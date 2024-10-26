# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :teachers
  resources :students
  root 'students#index'
end
