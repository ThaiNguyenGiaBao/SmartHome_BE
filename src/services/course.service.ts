import { BadRequestError, ForbiddenError, NotFoundError } from "../helper/errorRespone";

import { checkUUID } from "../utils";
import CourseModel from "../model/course.model";
import slugify from "slugify";

class CourseService {
    //router.get("/", asyncHandler(CourseController.getAllCourses));
    static async getAllCourses({ page, limit }: { page: number; limit: number }) {
        const courses = await CourseModel.getAllCourses({page, limit});
        return courses;
    }
    // router.get("/:slug", asyncHandler(CourseController.getCourseBySlug));
    static async getCourseBySlug(slug: string) {
        if (!slug) {
            throw new BadRequestError("Course slug is required");
        }
        const course = await CourseModel.getCourseBySlug(slug);

        if (!course) {
            throw new NotFoundError("Course not found");
        }

        return course;
    }
    
    // router.post("/", asyncHandler(CourseController.createCourse));
    static async createCourse({
        title,
        description,
        category,
        duration,
        isFeature,
        price,
        level,
        imageUrl,
        teacher_id
    }: {
        title: string;
        description: string;
        category: string;
        duration: number;
        isFeature: boolean;
        slug: string;
        price: number;
        level: string;
        imageUrl: string;
        teacher_id: string;
    }) {
        if(!title  ||!imageUrl ||  !price || !level || !teacher_id) {
            throw new BadRequestError("All fields are required");
        }
        if (!checkUUID(teacher_id)) {
            throw new BadRequestError("Invalid input syntax for type uuid");
        }
        
        if(!category) {
            category = "Others";
        }
        
        const slug = slugify(title, { lower: true });

        const course = await CourseModel.createCourse({
            title,
            description,
            category,
            duration,
            isFeature,
            slug,
            price,
            level,
            imageUrl,
            teacher_id
        });

        return course;
    }
    
    // router.patch("/:slug", asyncHandler(CourseController.updateCourse));
    static async updateCourse(slug: string, updates: Partial<{
        title: string;
        description: string;
        category: string;
        duration: number;
        isFeature: boolean;
        price: number;
        level: string;
        imageUrl: string;
        teacher_id: string;
    }>) {
        if (!slug) {
            throw new BadRequestError("Course slug is required");
        }

        
        
        const course = await CourseModel.getCourseBySlug(slug);
        if (!course) {
            throw new NotFoundError("Course not found");
        }

        
        var updateSlug 
        if(updates.title) {
            updateSlug = slugify(updates.title, { lower: true });
        }
        console.log("updateSlug", updateSlug)
        

        const result = await CourseModel.updateCourse(slug, {...updates, slug:updateSlug});

        return result

    }
    // router.delete("/:slug", asyncHandler(CourseController.deleteCourse));
    static async deleteCourse(slug: string) {
        if (!slug) {
            throw new BadRequestError("Course slug is required");
        }
        
        const course = await CourseModel.getCourseBySlug(slug);

        if (!course) {
            throw new NotFoundError("Course not found");
        }

        const result = await CourseModel.deleteCourse(slug);

        return result
    }
}   

export default CourseService;