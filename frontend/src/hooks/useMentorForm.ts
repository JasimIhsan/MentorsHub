// src/hooks/useMentorForm.ts
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axiosInstance from "@/api/config/api.config";
import { validateFormData } from "@/schema/mentor.application.form";
import { RootState } from "@/store/store";
import { MentorApplication, FormErrors } from "@/types/mentor.application";
import { TOTAL_STEPS } from "@/constants/mentor.application";

export const useMentorForm = () => {
	const [step, setStep] = useState(1);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formErrors, setFormErrors] = useState<FormErrors>({});
	const user = useSelector((state: RootState) => state.auth.user);

	const [formData, setFormData] = useState<MentorApplication>({
		firstName: user?.firstName || "",
		lastName: user?.lastName || "",
		professionalTitle: "",
		bio: user?.bio || "",
		languages: [],
		primaryExpertise: "",
		skills: user?.skills || [],
		yearsExperience: "",
		workExperiences: [{ jobTitle: "", company: "", startDate: "", endDate: "", currentJob: false, description: "" }],
		educations: [{ degree: "", institution: "", startYear: "", endYear: "" }],
		certifications: [{ name: "", issuingOrg: "", issueDate: "", expiryDate: "" }],
		sessionFormat: "both",
		sessionTypes: [],
		pricing: "both-pricing",
		hourlyRate: "",
		availability: [],
		hoursPerWeek: "",
		documents: [],
		terms: false,
		guidelines: false,
		interview: false,
	});

	const handleInputChange = (field: keyof MentorApplication, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setFormErrors((prev) => ({ ...prev, [field]: "" }));
	};

	const handleArrayChange = (field: keyof MentorApplication, value: string, checked: boolean) => {
		setFormData((prev) => {
			const current = prev[field] as string[];
			if (checked) {
				return { ...prev, [field]: [...current, value] };
			} else {
				return { ...prev, [field]: current.filter((item) => item !== value) };
			}
		});
		setFormErrors((prev) => ({ ...prev, [field]: "" }));
	};

	const handleNestedChange = (field: "workExperiences" | "educations" | "certifications", index: number, subField: string, value: any) => {
		setFormData((prev) => {
			const updated = [...(prev[field] as any[])];
			updated[index] = { ...updated[index], [subField]: value };
			return { ...prev, [field]: updated };
		});
		setFormErrors((prev) => ({ ...prev, [`${field}[${index}].${subField}`]: "" }));
	};

	const handleAddNested = (field: "workExperiences" | "educations" | "certifications") => {
		setFormData((prev) => {
			if (field === "workExperiences") {
				return {
					...prev,
					workExperiences: [...prev.workExperiences, { jobTitle: "", company: "", startDate: "", endDate: "", currentJob: false, description: "" }],
				};
			} else if (field === "educations") {
				return {
					...prev,
					educations: [...prev.educations, { degree: "", institution: "", startYear: "", endYear: "" }],
				};
			} else {
				return {
					...prev,
					certifications: [...prev.certifications, { name: "", issuingOrg: "", issueDate: "", expiryDate: "" }],
				};
			}
		});
	};

	const handleRemoveNested = (field: "workExperiences" | "educations" | "certifications", index: number) => {
		setFormData((prev) => ({
			...prev,
			[field]: (prev[field] as any[]).filter((_, i) => i !== index),
		}));
		setFormErrors((prev) => {
			const newErrors = { ...prev };
			Object.keys(newErrors).forEach((key) => {
				if (key.startsWith(`${field}[${index}]`)) {
					delete newErrors[key];
				}
			});
			return newErrors;
		});
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newFiles = Array.from(e.target.files);
			setFormData((prev) => ({
				...prev,
				documents: [...prev.documents, ...newFiles],
			}));
			setFormErrors((prev) => {
				const newErrors = { ...prev };
				newFiles.forEach((_, index) => {
					delete newErrors[`documents[${prev.documents.length + index}]`];
				});
				return newErrors;
			});
		}
	};

	const handleRemoveFile = (index: number) => {
		setFormData((prev) => ({
			...prev,
			documents: prev.documents.filter((_, i) => i !== index),
		}));
		setFormErrors((prev) => ({ ...prev, [`documents[${index}]`]: "" }));
	};

	const handleNext = async () => {
		if (step === TOTAL_STEPS) {
			const { isValid, errors } = validateFormData(formData);
			setFormErrors(errors);
			if (!isValid) {
				setShowErrorModal(true);
				return;
			}

			setIsLoading(true);
			const userId = user?.id;
			const submissionData = new FormData();
			submissionData.append("userId", userId!);
			submissionData.append("firstName", formData.firstName);
			submissionData.append("lastName", formData.lastName);
			submissionData.append("bio", formData.bio);
			submissionData.append("professionalTitle", formData.professionalTitle);
			submissionData.append("languages", JSON.stringify(formData.languages));
			submissionData.append("primaryExpertise", formData.primaryExpertise);
			submissionData.append("skills", JSON.stringify(formData.skills));
			submissionData.append("yearsExperience", formData.yearsExperience);
			submissionData.append("workExperiences", JSON.stringify(formData.workExperiences));
			submissionData.append("educations", JSON.stringify(formData.educations));
			submissionData.append("certifications", JSON.stringify(formData.certifications));
			submissionData.append("sessionFormat", formData.sessionFormat);
			submissionData.append("sessionTypes", JSON.stringify(formData.sessionTypes));
			submissionData.append("pricing", formData.pricing);
			submissionData.append("hourlyRate", formData.hourlyRate);
			submissionData.append("availability", JSON.stringify(formData.availability));
			submissionData.append("hoursPerWeek", formData.hoursPerWeek);

			formData.documents.forEach((file) => {
				submissionData.append("documents", file);
			});

			try {
				const response = await axiosInstance.post("/user-profile/mentor-application", submissionData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});

				if (!response.data.success) {
					throw new Error("Failed to submit application");
				}

				toast.success(response.data.message);
				setIsSubmitted(true);
			} catch (error: any) {
				toast.error(error.response?.data?.message || "Failed to submit application");
			} finally {
				setIsLoading(false);
			}
		} else {
			setStep(step + 1);
			window.scrollTo(0, 0);
		}
	};

	const handleBack = () => {
		if (step > 1) {
			setStep(step - 1);
			window.scrollTo(0, 0);
		}
	};

	return {
		step,
		isSubmitted,
		formData,
		formErrors,
		showErrorModal,
		isLoading,
		setShowErrorModal,
		handleInputChange,
		handleArrayChange,
		handleNestedChange,
		handleAddNested,
		handleRemoveNested,
		handleFileChange,
		handleRemoveFile,
		handleNext,
		handleBack,
	};
};
``;
