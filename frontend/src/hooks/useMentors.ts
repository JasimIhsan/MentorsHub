import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { IMentorDTO } from "@/interfaces/mentor.interface";
import { fetchMentors } from "@/api/mentors.api.service";
import { updateRole } from "@/store/slices/userSlice";

interface UseMentorsProps {
	page: number;
	limit: number;
	search: string;
	status: "pending" | "approved" | "rejected";
}

interface UseMentorsReturn {
	mentors: IMentorDTO[];
	total: number;
	loadingMentors: boolean;
}

export const useMentors = ({ page, limit, search, status }: UseMentorsProps): UseMentorsReturn => {
	const [mentors, setMentors] = useState<IMentorDTO[]>([]);
	const [total, setTotal] = useState(0);
	const [loadingMentors, setLoadingMentors] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchData = async () => {
			setLoadingMentors(true);
			try {
				const response = await fetchMentors({
					page,
					limit,
					search,
					status,
				});
				if (response.success) {
					dispatch(updateRole("mentor"));
					setMentors(response.mentors);
					setTotal(response.total);
				}
			} catch (error) {
				console.error("Error fetching mentors:", error);
				toast.error("Failed to fetch mentors.");
			} finally {
				setLoadingMentors(false);
			}
		};
		fetchData();
	}, [page, search, status, limit, dispatch]);

	return {
		mentors,
		total,
		loadingMentors,
	};
};
