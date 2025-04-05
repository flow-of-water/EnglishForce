import * as CourseSectionModel from "../models/courseSectionModel.js";

// Tạo course section mới
export async function createCourseSection(req, res) {
    try {
        const { name, course_id, video_link, order_index , description } = req.body;

        if (!name || !course_id || order_index === undefined) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const section = await CourseSectionModel.create(name, course_id, video_link, order_index , description);
        return res.status(201).json(section);
    } catch (error) {
        console.error("❌ Error creating section:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Lấy tất cả course sections
export async function getAllCourseSections(req, res) {
    try {
        const sections = await CourseSectionModel.getAll();
        return res.json(sections);
    } catch (error) {
        console.error("❌ Error fetching sections:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Lấy tất cả sections theo course_id
export async function getAllCourseSectionsByCourseId(req, res) {
    try {
        const { course_id } = req.params;

        if (!course_id) {
            return res.status(400).json({ message: "Missing course_id parameter" });
        }

        const sections = await CourseSectionModel.getAllByCourseId(course_id);
        return res.json(sections);
    } catch (error) {
        console.error("❌ Error fetching sections by course_id:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Lấy course section theo ID
export async function getCourseSectionById(req, res) {
    try {
        const { id } = req.params;
        const section = await CourseSectionModel.getById(id);

        if (!section) {
            return res.status(404).json({ message: "Course section not found" });
        }

        return res.json(section);
    } catch (error) {
        console.error("❌ Error fetching section:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Xóa course section
export async function deleteCourseSection(req, res) {
    try {
        const { id } = req.params;
        const deleted = await CourseSectionModel.deleteSection(id);

        if (!deleted) {
            return res.status(404).json({ message: "Course section not found" });
        }

        return res.json({ message: "Course section deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting section:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const updateCourseSection = async (req, res) => {
    const { id } = req.params;
    const { name, description, video_link, order_index } = req.body;
  
    try {
      const updatedSection = await CourseSectionModel.updateCourseSection(id, name, description, video_link, order_index);
      if (!updatedSection) {
        return res.status(404).json({ message: "Course section not found" });
      }
      res.status(200).json(updatedSection);
    } catch (error) {
      console.error("Error updating course section:", error);
      res.status(500).json({ message: "Error updating course section" });
    }
};