// import axiosInstance from "../api.config";
// import { MentorApplicationFormData } from "@/schema/mentor.application.form";

// export const submitApplication = async (userId: string, data: MentorApplicationFormData, documents: File[]) => {
// 	try {
// 		const formData = new FormData();
// 		formData.append("userId", userId);
// 		formData.append("firstName", data.firstName);
// 		formData.append("lastName", data.lastName);
// 		formData.append("professionalTitle", data.professionalTitle);
// 		formData.append("bio", data.bio);
// 		formData.append("languages", JSON.stringify(data.languages));
// 		formData.append("primaryExpertise", data.primaryExpertise);
// 		formData.append("skills", JSON.stringify(data.skills));
// 		formData.append("yearsExperience", data.yearsExperience);
// 		formData.append("workExperiences", JSON.stringify(data.workExperiences));
// 		formData.append("educations", JSON.stringify(data.educations || []));
// 		formData.append("certifications", JSON.stringify(data.certifications || []));
// 		formData.append("sessionFormat", data.sessionFormat);
// 		formData.append("pricing", data.pricing);
// 		if (data.hourlyRate) formData.append("hourlyRate", data.hourlyRate);
// 		formData.append("availability", JSON.stringify(data.availability));
// 		formData.append("hoursPerWeek", data.hoursPerWeek);
// 		formData.append("sessionLength", data.sessionLength);
// 		formData.append("terms", String(data.terms));
// 		formData.append("guidelines", String(data.guidelines));
// 		formData.append("interview", String(data.interview));

// 		// ✅ Append documents passed from the component
// 		if (documents && documents.length > 0) {
// 			documents.forEach((file) => {
// 				formData.append("documents", file);
// 			});
// 		}

// 		// ✅ No need to call setIsSubmitted or form.setError here
// 		const response = await axiosInstance.post("/api/mentor-application", formData, {
// 			headers: { "Content-Type": "multipart/form-data" },
// 		});

// 		return response.data;
// 	} catch (error) {
// 		throw error;
// 	}
// };
