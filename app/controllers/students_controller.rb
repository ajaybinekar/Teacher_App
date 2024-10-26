# frozen_string_literal: true

class StudentsController < ApplicationController
  before_action :authenticate_teacher!
  before_action :set_student, only: %i[edit update destroy]

  def index
    @students = current_teacher.students
  end

  def new
    @student = current_teacher.students.build
  end

  def show
    @student = Student.find(params[:id])
  end

  def create
    @student = current_teacher.students.find_or_initialize_by(name: params[:name], subject: params[:subject])
    @student.marks = @student.new_record? ? params[:marks].to_i : @student.marks + params[:marks].to_i

    if @student.save
      flash[:notice] = 'Student was successfully created.'
      redirect_to students_path
    else
      flash.now[:alert] = 'There was an error creating the student.'
      render :index
    end
  end

  def edit; end

  def update
    @student = Student.find(params[:id])
    if @student.update(student_params)
      redirect_to students_path, notice: 'Student was successfully updated.'
    else
      render :edit
    end
  end

  def destroy
    @student = Student.find(params[:id])
    @student.destroy
    redirect_to students_path, notice: 'Student was successfully deleted.'
  end

  private

  def set_student
    @student = current_teacher.students.find(params[:id])
  end

  def student_params
    params.require(:student).permit(:name, :subject, :marks)
  end
end
