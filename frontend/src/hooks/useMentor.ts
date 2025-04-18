import { useState, useEffect } from "react";
import { IMentorDTO } from "@/interfaces/mentor.application.dto";
import { fetchMentorAPI } from "@/api/mentors.api.service";

function useMentor(mentorId: string) {
	const [mentor, setMentor] = useState<IMentorDTO | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchMentor = async () => {
			try {
				setLoading(true);
				const response = await fetchMentorAPI(mentorId);
				if (response.success) {
					setMentor(response.mentor);
				}
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				}
			} finally {
				setLoading(false);
			}
		};
		if (mentorId) fetchMentor();
	}, [mentorId]);

	return { mentor, loading, error };
}

export { useMentor };
