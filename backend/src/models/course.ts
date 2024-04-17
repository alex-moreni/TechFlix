import mongoose from "mongoose";

// Define the schema for the Course model in the MongoDB database.
const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },

  category: {
    area: { type: String, required: true },
    techName: { type: String, required: true },
  },

  isPublished: { type: Boolean, required: true },
});

// Export the User model so that it can be used in other modules.
export const CourseModel = mongoose.model("Course", CourseSchema);

// Course Model Actions (CRUD)
export const getCourse = () => CourseModel.find();
export const getCourseById = (id: string) => CourseModel.findById(id);
export const getCourseByArea = (area: string) =>
  CourseModel.findOne({ "category.area": area });
export const getCourseByTechName = (techName: string) =>
  CourseModel.findOne({ "category.techName": techName });
export const createCourse = (values: Record<string, any>) =>
  new CourseModel(values).save().then((Course) => Course.toObject());
export const deleteCourseById = (id: string) =>
  CourseModel.findOneAndDelete({ _id: id });
export const updateCourseById = (id: string, values: Record<string, any>) =>
  CourseModel.findByIdAndUpdate(id, values);
